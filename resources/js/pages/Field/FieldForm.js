import { useMutation, useQuery } from "@apollo/client";
import { faPlus } from "@fortawesome/pro-duotone-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { ContentBlockEditor } from "../../components/ContentBlockEditor";
import { Error } from "../../components/Error";
import { Input } from "../../components/Form/Input";
import { Select } from "../../components/Form/Select";
import { Loading } from "../../components/Loading";
import { Page, PageContent } from "../../components/Page";
import { GET_FIELD, GET_FIELDS, UPSERT_FIELD } from "../../queries";
import { usePrompt } from "../../tmp-prompt";

const schema = yup.object({
  name: yup.string().required(),
  key: yup.string().required(),
  columns: yup.number().required().positive(),
});

const getBlocks = (sections) =>
  sections.map((section, sectionIndex) =>
    section.columns.map((column, columnIndex) =>
      column.blocks.map(block => ({ ...block, sectionIndex, columnIndex }))
    ).flat()
  ).flat();

export const FieldForm = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSectionsDirty, setIsSectionsDirty] = useState(false);
  const [isForcedClean, setIsForcedClean] = useState(false);
  const [sections, setSections] = useState([{
    id: 1,
    name: 'Fields',
    columns: [],
  }]);

  const { id } = useParams();
  const isNew = id === undefined;
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      key: '',
      columns: '',
    },
  });

  const watchName = methods.watch('name');
  const watchColumns = methods.watch('columns');

  const getFieldResult = useQuery(GET_FIELD, {
    variables: {
      id
    },
    skip: isNew,
  });

  const [upsertField, upsertFieldResult] = useMutation(UPSERT_FIELD, {
    onCompleted: (data) => {
      navigate(`/fields/${data.upsertField.id}`);
    },
    update: (cache, { data: { upsertField } }) => {
      const data = cache.readQuery({
        query: GET_FIELDS
      });

      if (data !== null) {
        const fields = _.cloneDeep(data.fields);

        if (isNew) {
          fields.push(upsertField);
        } else {
          fields.forEach(field => {
            if (field.id === upsertField.id) {
              field = upsertField;
            }
          });
        }

        cache.writeQuery({
          query: GET_FIELDS,
          data: {
            fields
          },
        });
      }
    },
  });

  usePrompt('Are you sure you want to leave this page? You will lose any unsaved data.', (methods.isDirty || isSectionsDirty) && !isForcedClean);

  const handleChange = (sections) => {
    setSections(sections);
    setIsSectionsDirty(true);
  };

  const handleSave = (data) => {
    setIsSectionsDirty(false);
    setIsForcedClean(true);

    const blocks = getBlocks(sections);

    const getBlockInput = (block, i) => ({
      id: !block.isNew ? block.id : null,
      field_id: field.id,
      column: block.pageTemplateSectionColumnId,
      type: block.type,
      content: block.content ?? '',
      sorting: i,
    });

    const getFieldInput = (field) => ({
      id: field.id ?? null,
      name: field.name,
      key: field.key,
      columns: field.columns,
      fieldBlocks: {
        upsert: field.fieldBlocks.map(getBlockInput),
        delete: [],
      }
    });

    const field = {
      id: !isNew ? id : null,
      name: data.name,
      key: data.key,
      columns: data.columns,
      fieldBlocks: blocks
    };

    const upsertFieldInput = getFieldInput(field);

    // Deleted blocks
    if (!isNew) {
      const oldBlocks = getFieldResult.data.field.fieldBlocks;
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
        upsertFieldInput.fieldBlocks.delete.push(deletedBlock.id);
      });
    }

    upsertField({
      variables: {
        input: upsertFieldInput
      }
    });
  };

  const Footer = () => (
    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
      <Button color="secondary" onClick={methods.handleSubmit(handleSave)}>Save</Button>
    </Box>
  );

  const heading = isNew ? 'Add field' : 'Edit field';

  const isLoading = getFieldResult.loading || upsertFieldResult.loading;
  const error = getFieldResult.error || upsertFieldResult.error;

  useEffect(() => {
    if (getFieldResult.loading === false && getFieldResult.data) {
      const field = getFieldResult.data.field;

      methods.setValue('name', field.name);
      methods.setValue('key', field.key);
      methods.setValue('columns', field.columns);

      const sections = [{
        id: 1,
        name: 'Fields',
        columns: [],
      }];

      for (let i = 0; i < field.columns; i++) {
        sections[0].columns.push({
          id: i + 1,
          blocks: [],
        });
      }

      field.fieldBlocks.forEach(fieldBlock => {
        if (fieldBlock.column - 1 < field.columns) {
          sections[0].columns[fieldBlock.column - 1].blocks.push({
            id: fieldBlock.id,
            type: fieldBlock.type,
            content: fieldBlock.content,
            sorting: fieldBlock.sorting,
          });
        }
      });

      sections[0].columns.forEach((column) =>
        column.blocks = column.blocks.sort((a, b) => a.sorting - b.sorting));

      setSections(sections);
    }
  }, [getFieldResult.loading, getFieldResult.data]);

  useEffect(() => {
    const subscription = methods.watch((value, { name, type }) => {
      if (name === 'name') {
        methods.setValue('key', _.kebabCase(value.name));
      } else if (name === 'columns') {
        const [{ columns }] = sections;

        const delta = Math.abs(columns.length - value.columns);

        if (columns.length < value.columns) {
          const newSections = [...sections];
          const newColumns = [];

          for (let i = 0; i < delta; i++) {
            newColumns.push({
              id: columns.length + i + 1,
              blocks: [],
            });
          }

          newSections[0].columns = [
            ...columns,
            ...newColumns,
          ];
          setSections(newSections);
        } else if (columns.length > value.columns) {
          console.log(sections);
          const newSections = [...sections];

          for (let i = 0; i < delta; i++) {
            columns.pop();
          }

          newSections[0].columns = [
            ...columns,
          ];

          setSections(newSections);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [methods.watch, sections]);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <FormProvider {...methods}>
      <Page
        heading={heading}
        footer={<Footer />}
        fab={{
          handleClick: () => setIsDrawerOpen(true),
          icon: faPlus,
        }}
        isDrawerOpen={isDrawerOpen}
      >
        <PageContent>
          <Input
            label="Name"
            name="name"
          />

          <Input
            label="Key"
            name="key"
            disabled
          />

          <Select
            label="Columns"
            name="columns"
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ]}
          />
        </PageContent>

        {watchColumns > 0 && <PageContent>
          <ContentBlockEditor
            sections={sections}
            handleChange={handleChange}
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
          />
        </PageContent>}
      </Page>
    </FormProvider>
  );
};