import { useMutation, useQuery } from "@apollo/client";
import { faPlus } from "@fortawesome/pro-duotone-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Box, Button, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { ContentBlockEditor } from "../../components/ContentBlockEditor";
import { Error } from "../../components/Error";
import { Checkbox } from "../../components/Form/Checkbox";
import { Input } from "../../components/Form/Input";
import { Select } from "../../components/Form/Select";
import { Loading } from "../../components/Loading";
import { Page, PageContent } from "../../components/Page";
import { GET_LATEST_PAGE_REVISION, GET_PAGE, GET_PAGES, GET_PAGE_TEMPLATES, UPDATE_PAGE_REVISION_IS_SAVED, UPSERT_PAGE, UPSERT_PAGE_REVISION } from "../../queries";
import { usePrompt } from "../../tmp-prompt";

const schema = yup.object({
  name: yup.string().required(),
  template: yup.number().required().positive(),
  isRoot: yup.boolean(),
  isShownInMenu: yup.boolean(),
});

const getBlocks = (sections) =>
  sections.map((section, sectionIndex) =>
    section.columns.map((column, columnIndex) =>
      column.blocks.map(block => ({ ...block, sectionIndex, columnIndex }))
    ).flat()
  ).flat();

export const PageForm = () => {
  const [isSectionsDirty, setIsSectionsDirty] = useState(false);
  const [isForcedClean, setIsForcedClean] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [sections, setSections] = useState();
  const [page, setPage] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { id, parentId } = useParams();
  const isNew = id === undefined;
  const navigate = useNavigate();

  const getPageResult = useQuery(GET_PAGE, {
    variables: {
      id,
    },
    skip: isNew,
  });

  const getPageTemplateResult = useQuery(GET_PAGE_TEMPLATES, {});

  const [upsertPage, upsertPageResult] = useMutation(UPSERT_PAGE, {
    onCompleted: (data) => {
      navigate(`/pages/${data.upsertPage.id}`);
    },
    update: (cache, { data: { upsertPage } }) => {
      // Update GET_PAGES
      const pagesData = cache.readQuery({
        query: GET_PAGES
      });

      if (pagesData !== null) {
        const pages = _.cloneDeep(pagesData.pages);

        if (upsertPage.is_root === true) {
          // Set is_root to false on all other pages
          pages.forEach(page => {
            if (page.id !== upsertPage.id) {
              const pageData = cache.readQuery({
                query: GET_PAGE,
                variables: {
                  id: page.id
                }
              });

              if (pageData) {
                const page = _.cloneDeep(pageData.page);

                page.is_root = false;

                cache.writeQuery({
                  query: GET_PAGE,
                  data: {
                    page: page,
                  },
                  variables: {
                    id: page.id,
                  }
                });
              }
            }
          });
        }

        if (isNew) {
          pages.push(upsertPage);
        } else {
          pages.forEach(page => {
            if (page.id === upsertPage.id) {
              page = upsertPage;
            }
          });
        }

        cache.writeQuery({
          query: GET_PAGES,
          data: {
            pages
          },
        });
      }

      // Update GET_PAGE
      cache.writeQuery({
        query: GET_PAGE,
        data: {
          page: upsertPage,
        },
        variables: {
          id,
        }
      });
    },
  });

  const getLatestPageRevisionResult = useQuery(GET_LATEST_PAGE_REVISION, {
    variables: {
      pageId: id
    },
    skip: isNew,
  });

  const [upsertPageRevision] = useMutation(UPSERT_PAGE_REVISION, {});
  const [upsertPageRevisionIsSaved] = useMutation(UPDATE_PAGE_REVISION_IS_SAVED, {});

  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const watchTemplate = methods.watch('template');

  usePrompt('Are you sure you want to leave this page? You will lose any unsaved data.', (methods.isDirty || isSectionsDirty) && !isForcedClean);

  const handleChange = (sections) => {
    setSections(sections);
    setIsSectionsDirty(true);
  };

  const handlePublish = (data) => {
    setIsSectionsDirty(false);
    setIsForcedClean(true);

    const blocks = getBlocks(sections);

    const getBlockInput = (block, i) => ({
      id: !block.isNew ? block.id : null,
      page_id: page.id,
      page_template_section_id: block.pageTemplateSectionId,
      page_template_section_column_id: block.pageTemplateSectionColumnId,
      type: block.type,
      content: block.content ?? '',
      sorting: i,
    });

    const getPageInput = (page) => ({
      id: page.id ?? null,
      parent_page_id: page.parentPageId,
      page_template_id: page.pageTemplateId,
      name: page.name,
      is_root: page.isRoot,
      is_published: page.isPublished,
      is_shown_in_menu: page.isShownInMenu,
      pageBlocks: {
        upsert: page.pageBlocks.map(getBlockInput),
        delete: [],
      }
    });

    const page = {
      id: !isNew ? id : null,
      parentPageId: parentId,
      pageTemplateId: watchTemplate,
      name: data.name,
      isRoot: data.isRoot,
      isPublished: data.isPublished ?? true,
      isShownInMenu: data.isShownInMenu,
      pageBlocks: blocks,
    };

    const upsertPageInput = getPageInput(page);

    // Deleted blocks
    if (!isNew) {
      const oldBlocks = getPageResult.data.page.pageBlocks;
      const newBlocks = getBlocks(sections);
      const deletedBlocks = [];

      oldBlocks.forEach(oldBlock => {
        let deleted = true;

        newBlocks.forEach(newBlock => {
          if (oldBlock.id == newBlock.id) {
            deleted = false;
          }
        });

        if (deleted) {
          deletedBlocks.push(oldBlock);
        }
      });

      deletedBlocks.forEach(deletedBlock => {
        upsertPageInput.pageBlocks.delete.push(deletedBlock.id);
      });
    }

    upsertPage({
      variables: {
        input: upsertPageInput
      }
    });

    // disable page revision
    if (getLatestPageRevisionResult?.data?.latestPageRevision) {
      const { id: pageRevisionId } = getLatestPageRevisionResult.data.latestPageRevision;

      upsertPageRevisionIsSaved({
        variables: {
          input: {
            id: pageRevisionId,
            is_saved: false,
          }
        }
      }).then(() => {
        getLatestPageRevisionResult.refetch();
      });
    }
  };

  const handlePreview = (data) => {
    // preview, i.e. create a page revision
    const blocks = getBlocks(sections);

    const getPageRevisionBlockInput = (block, i) => ({
      id: !block.isNew ? block.id : null,
      page_revision_id: pageRevision.id,
      page_template_section_id: block.pageTemplateSectionId,
      page_template_section_column_id: block.pageTemplateSectionColumnId,
      type: block.type,
      content: block.content ?? '',
      sorting: i,
    });

    const getPageRevisionInput = (pageRevision) => ({
      page_id: pageRevision.pageId,
      page_template_id: pageRevision.pageTemplateId,
      name: pageRevision.name,
      pageRevisionBlocks: {
        upsert: pageRevision.pageRevisionBlocks.map(getPageRevisionBlockInput),
        delete: [],
      }
    });

    const pageRevision = {
      pageId: page.id,
      pageTemplateId: watchTemplate,
      name: data.name,
      pageRevisionBlocks: blocks,
    };

    const upsertPageRevisionInput = getPageRevisionInput(pageRevision);

    upsertPageRevision({
      variables: {
        input: upsertPageRevisionInput
      }
    }).then((response) => {
      const { id } = response.data.upsertPageRevision;
      window.open(`/admin/revision/page/${id}`);
    });
  };

  const handleUnpublish = (data) => {
    data.isPublished = false;
    handlePublish(data);
  };

  const handleDraft = (data) => {
    setIsSectionsDirty(false);
    setIsForcedClean(true);

    if (isNew) {
      data.isPublished = false;
      handlePublish(data);
      return;
    }

    // save draft, i.e. create a page revision with is_saved = true
    const blocks = getBlocks(sections);

    const getPageRevisionBlockInput = (block, i) => ({
      id: !block.isNew ? block.id : null,
      page_revision_id: pageRevision.id,
      page_template_section_id: block.pageTemplateSectionId,
      page_template_section_column_id: block.pageTemplateSectionColumnId,
      type: block.type,
      content: block.content ?? '',
      sorting: i,
    });

    const getPageRevisionInput = (pageRevision) => ({
      page_id: pageRevision.pageId,
      page_template_id: pageRevision.pageTemplateId,
      name: pageRevision.name,
      is_saved: pageRevision.isSaved,
      pageRevisionBlocks: {
        upsert: pageRevision.pageRevisionBlocks.map(getPageRevisionBlockInput),
        delete: [],
      }
    });

    const pageRevision = {
      pageId: getPageResult.data.page.id,
      pageTemplateId: watchTemplate,
      name: data.name,
      isSaved: true,
      pageRevisionBlocks: blocks,
    };

    const upsertPageRevisionInput = getPageRevisionInput(pageRevision);

    upsertPageRevision({
      variables: {
        input: upsertPageRevisionInput
      }
    });
  };

  const Footer = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      {page.is_published
        ? (
          <>
            <Box>
              <Button color="error" onClick={methods.handleSubmit(handleUnpublish)}>Unpublish</Button>
              <Button color="neutral" onClick={methods.handleSubmit(handlePreview)}>Preview changes</Button>
            </Box>

            <Box>
              <Button color="secondary" onClick={methods.handleSubmit(handlePublish)}>Update</Button>
            </Box>
          </>
        )
        : (
          <>
            <Box>
              <Button color="neutral" onClick={methods.handleSubmit(handleDraft)}>Save draft</Button>
              <Button color="neutral" onClick={methods.handleSubmit(handlePreview)}>Preview</Button>
            </Box>

            <Box>
              <Button color="secondary" onClick={methods.handleSubmit(handlePublish)}>Publish</Button>
            </Box>
          </>
        )}
    </Box>
  );

  const isLoading = getPageResult.loading || getLatestPageRevisionResult.loading || upsertPageResult.loading || getPageTemplateResult.loading;
  const error = getPageResult.error || getLatestPageRevisionResult.error || upsertPageResult.error || getPageTemplateResult.error;

  useEffect(() => {
    if (getPageResult.loading === false
      && getPageResult.data
      && getLatestPageRevisionResult.loading === false
      && getLatestPageRevisionResult.data) {
      let page;

      if (getLatestPageRevisionResult.data.latestPageRevision) {
        page = getLatestPageRevisionResult.data.latestPageRevision;
        setIsDraft(true);
      } else {
        page = getPageResult.data.page;
        if (page.is_published) {
          setIsDraft(false);
        } else {
          setIsDraft(true);
        }
      }

      const sections = page.pageTemplate.pageTemplateSections.map(pageTemplateSection => {
        const section = {
          id: pageTemplateSection.id,
          name: pageTemplateSection.name,
          columns: [],
        };

        pageTemplateSection.pageTemplateSectionColumns.forEach(pageTemplateSectionColumn => {
          const column = {
            id: pageTemplateSectionColumn.id,
            blocks: [],
          };

          page.pageBlocks.forEach(pageBlock => {
            if (pageBlock.page_template_section_id == pageTemplateSection.id
              && pageBlock.page_template_section_column_id == pageTemplateSectionColumn.id) {
              column.blocks.push({
                id: pageBlock.id,
                pageTemplateSectionId: pageTemplateSection.id,
                type: pageBlock.type,
                content: pageBlock.content,
                sorting: pageBlock.sorting,
              });
            }
          });

          section.columns.push(column);
        });

        // sorting
        section.columns.forEach((column) =>
          column.blocks = column.blocks.sort((a, b) => a.sorting - b.sorting));

        return section;
      });

      setSections(sections);
      methods.setValue('name', page.name);
      methods.setValue('template', page.page_template_id);
      methods.setValue('isRoot', page.is_root);
      methods.setValue('isShownInMenu', page.is_shown_in_menu);

      setPage(page);
    }
  }, [
    getPageResult.loading,
    getPageResult.data,
    getLatestPageRevisionResult.loading,
    getLatestPageRevisionResult.data
  ]);

  useEffect(() => {
    if (isNew && watchTemplate > 0) {
      const pageTemplates = getPageTemplateResult.data.pageTemplates;

      pageTemplates.forEach(pageTemplate => {
        if (pageTemplate.id == watchTemplate) {
          const sections = pageTemplate.pageTemplateSections.map(pageTemplateSection => {
            const section = {
              id: pageTemplateSection.id,
              name: pageTemplateSection.name,
              columns: [],
            };

            pageTemplateSection.pageTemplateSectionColumns.forEach(pageTemplateSectionColumn => {
              section.columns.push({
                id: pageTemplateSectionColumn.id,
                blocks: [],
              });
            });

            return section;
          });

          setSections(sections);
        }
      });
    }
  }, [watchTemplate]);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  const heading = isNew ? 'Add page' : 'Edit page';

  const pageTemplateList = getPageTemplateResult.data.pageTemplates.map(pageTemplate => ({
    value: pageTemplate.id,
    label: pageTemplate.name,
  }));

  const hasSections = sections && sections.length > 0;
  const hasTemplate = !(watchTemplate > 0 && sections && sections.length == 0);
  let url;

  if (!isNew) {
    url = `//${window.location.hostname}/${getPageResult.data.page.route}`;
  }

  return (
    <FormProvider {...methods}>
      <Page
        heading={heading}
        footer={pageTemplateList.length > 0 && <Footer />}
        fab={(hasSections && hasTemplate) && {
          handleClick: () => setIsDrawerOpen(true),
          icon: faPlus,
        }}
        isDrawerOpen={isDrawerOpen}
      >

        {pageTemplateList.length > 0
          ? (
            <>
              <PageContent>
                {isDraft && <Alert severity="info" sx={{ mb: 2 }}>
                  This page is a draft and therefore not published. You can continue editing this draft and save changes with <strong>Save draft</strong> or publish it with <strong>Publish</strong>.
                </Alert>}

                {!isNew && <Link href={url} target="_blank" sx={{ display: 'block', mb: 2 }}>{url}</Link>}

                <Input
                  name="name"
                  label="Name"
                />

                <Select
                  name="template"
                  label="Template"
                  options={pageTemplateList}
                  disabled={!isNew}
                />

                <Checkbox
                  label="Root page"
                  name="isRoot"
                />

                <Checkbox
                  label="Show in menu"
                  name="isShownInMenu"
                />
              </PageContent>

              <PageContent>
                {hasSections && <ContentBlockEditor
                  sections={sections}
                  handleChange={handleChange}
                  isDrawerOpen={isDrawerOpen}
                  setIsDrawerOpen={setIsDrawerOpen}
                />}

                {!hasTemplate && <p>This page template has no sections.</p>}
              </PageContent>
            </>
          )
          : (
            <PageContent>
              <Typography>There are no page templates defined. You need to <Link to="/pages/templates/create">create one</Link> before adding pages.</Typography>
            </PageContent>
          )}
      </Page>
    </FormProvider>
  );
};