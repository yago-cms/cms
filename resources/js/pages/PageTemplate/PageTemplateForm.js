import { useMutation, useQuery } from "@apollo/client";
import { faArrowLeft, faTimes } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { ButtonUnstyled } from "@mui/base";
import { Avatar, Box, Button, Chip, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { Error } from "../../components/Error";
import { FieldActions } from "../../components/Field";
import { Input } from "../../components/Form/Input";
import { Loading } from "../../components/Loading";
import { Page, PageContent } from "../../components/Page";
import { PageCard } from "../../components/PageCard";
import { GET_PAGE_TEMPLATE, GET_PAGE_TEMPLATES, UPSERT_PAGE_TEMPLATE } from "../../queries";

const schema = yup.object({
    name: yup.string().required(),
    sections: yup.array().of(
        yup.object().shape({
            name: yup.string().required(),
            key: yup.string().required(),
            columns: yup.array().of(
                yup.object().shape({
                }),
            ),
        })
    )
});

const Columns = ({ index }) => {
    const { fields, remove, append } = useFieldArray({
        name: `sections.${index}.columns`,
        keyName: 'key',
    });

    return (
        <Box>
            <Divider textAlign="left"><Chip label="Columns" /></Divider>

            <List>
                {fields.map((field, subIndex) =>
                    <ListItem secondaryAction={
                        <IconButton size="small" onClick={() => remove(subIndex)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </IconButton>
                    }>
                        <Input
                            type="hidden"
                            name={`sections.${index}.columns.${subIndex}.id`}
                        />
                        <ListItemText primary={`Column #${subIndex + 1}`} />
                    </ListItem>
                )}
            </List>

            <Button onClick={() => append({})}>
                Add column
            </Button>
        </Box >
    );
};

export const PageTemplateForm = () => {
    const { id } = useParams();
    const isNew = id === undefined;

    const methods = useForm({
        resolver: yupResolver(schema),
    });

    const { fields, append, remove, swap } = useFieldArray({
        control: methods.control,
        name: 'sections',
        keyName: '_key',
    });

    const navigate = useNavigate();

    const getPageTemplateResult = useQuery(GET_PAGE_TEMPLATE, {
        variables: {
            id
        },
        skip: isNew,
    });

    const [upsertPageTemplate, upsertPageTemplateResult] = useMutation(UPSERT_PAGE_TEMPLATE, {
        onCompleted: (data) => {
            navigate(`/pages/templates/${data.upsertPageTemplate.id}`);
        },
        update: (cache, { data: { upsertPageTemplate } }) => {
            const data = cache.readQuery({
                query: GET_PAGE_TEMPLATES
            });

            if (data !== null) {
                const pageTemplates = _.cloneDeep(data.pageTemplates);

                if (isNew) {
                    pageTemplates.push(upsertPageTemplate);
                } else {
                    pageTemplates.forEach(pageTemplate => {
                        if (pageTemplate.id === upsertPageTemplate.id) {
                            pageTemplate = upsertPageTemplate;
                        }
                    });
                }

                cache.writeQuery({
                    query: GET_PAGE_TEMPLATES,
                    data: {
                        pageTemplates
                    },
                });
            }
        },
    });

    const handleSave = (data) => {
        const pageTemplateSections = {
            upsert: [],
            delete: [],
        };

        data.sections.forEach((section, sectionIndex) => {
            const pageTemplateSectionColumns = {
                upsert: [],
                delete: [],
            };

            section.columns.forEach(columns => {
                pageTemplateSectionColumns.upsert.push({
                    id: columns.id || null,
                });
            });

            pageTemplateSections.upsert.push({
                id: section.id || null,
                name: section.name,
                key: section.key,
                sorting: sectionIndex,
                pageTemplateSectionColumns,
            });
        });

        const pageTemplate = {
            id: !isNew ? id : null,
            name: data.name,
            pageTemplateSections,
        };

        if (!isNew) {
            // deleted sections
            const oldSections = getPageTemplateResult.data.pageTemplate.pageTemplateSections;
            const newSections = data.sections;

            oldSections.forEach(oldSection => {
                let deleted = true;

                newSections.forEach(newSection => {
                    if (oldSection.id == newSection.id) {
                        deleted = false;
                    }
                });

                if (deleted) {
                    pageTemplate.pageTemplateSections.delete.push(oldSection.id);
                }
            });

            // deleted columns
            oldSections.forEach(oldSection => {
                const oldColumns = oldSection.pageTemplateSectionColumns;
                let newColumns = [];

                data.sections.some(section => {
                    if (section.id == oldSection.id) {
                        newColumns = section.columns;
                        return true;
                    }

                    return false;
                });

                oldColumns.forEach(oldColumn => {
                    let deleted = true;

                    newColumns.forEach(newColumn => {
                        if (oldColumn.id == newColumn.id) {
                            deleted = false;
                        }
                    });

                    if (deleted) {
                        pageTemplate.pageTemplateSections.upsert = pageTemplate.pageTemplateSections.upsert.map(section => {
                            if (section.id == oldSection.id) {
                                section.pageTemplateSectionColumns.delete.push(oldColumn.id);
                            }

                            return section;
                        });
                    }
                });
            });
        }

        upsertPageTemplate({
            variables: {
                input: pageTemplate,
            }
        });
    };

    const Footer = () => (
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button color="secondary" onClick={methods.handleSubmit(handleSave)}>Save</Button>
        </Box>
    );

    const heading = isNew ? 'Add page template' : 'Edit page template';

    const isLoading = getPageTemplateResult.loading || upsertPageTemplateResult.loading;
    const error = getPageTemplateResult.error || upsertPageTemplateResult.error;

    useEffect(() => {
        if (getPageTemplateResult.loading === false && getPageTemplateResult.data) {
            const pageTemplate = getPageTemplateResult.data.pageTemplate;

            const sections = [];

            pageTemplate.pageTemplateSections.forEach(pageTemplateSection => {
                const columns = [];

                pageTemplateSection.pageTemplateSectionColumns.forEach(pageTemplateSectionColumn => {
                    columns.push({
                        id: pageTemplateSectionColumn.id,
                    });
                })

                sections.push({
                    id: pageTemplateSection.id,
                    name: pageTemplateSection.name,
                    key: pageTemplateSection.key,
                    columns: columns,
                });
            })

            methods.setValue('name', pageTemplate.name);
            methods.setValue('sections', sections);
        }
    }, [getPageTemplateResult.loading, getPageTemplateResult.data]);

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <FormProvider {...methods}>
            <Page
                heading={heading}
                footer={<Footer />}
            >
                <PageContent>
                    <Input
                        label="Name"
                        name="name"
                    />
                </PageContent>

                <PageContent heading="Sections">
                    {fields.map((field, index) => {
                        return (
                            <PageCard
                                key={field._key}
                                footer={
                                    <FieldActions
                                        fields={fields}
                                        index={index}
                                        swap={swap}
                                        remove={remove}
                                    />
                                }
                            >
                                <Input
                                    type="hidden"
                                    name={`sections.${index}.id`}
                                />

                                <Input
                                    label="Name"
                                    name={`sections.${index}.name`}
                                    onChangeExtra={(e) => methods.setValue(`sections.${index}.key`, _.kebabCase(e.target.value))}
                                />

                                <Input
                                    label="Key"
                                    name={`sections.${index}.key`}
                                    disabled
                                />

                                <div className="row">
                                    <Columns index={index} />
                                </div>
                            </PageCard>
                        );
                    })}

                    <Button onClick={() => append({})}>
                        Add section
                    </Button>
                </PageContent>
            </Page>
        </FormProvider >
    );
};