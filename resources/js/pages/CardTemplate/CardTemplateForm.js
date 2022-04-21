import { useMutation, useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { Error } from "../../components/Error";
import { FieldActions } from "../../components/Field";
import { Input } from "../../components/Form/Input";
import { Select } from "../../components/Form/Select";
import { Loading } from "../../components/Loading";
import { Page, PageContent } from "../../components/Page";
import { PageCard } from "../../components/PageCard";
import { GET_CARD_TEMPLATE, GET_CARD_TEMPLATES, UPSERT_CARD_TEMPLATE } from "../../queries";

// TODO: no duplicate names
const schema = yup.object({
    name: yup.string().required(),
    key: yup.string().required(),
    fields: yup.array().of(
        yup.object().shape({
            id: yup.string().required(),
            type: yup.string().required(),
            label: yup.string().required(),
        }),
    ),
});

const fieldTypes = [
    {
        value: '',
        label: 'Choose type...',
    },
    {
        value: 'text',
        label: 'Text',
    },
    {
        value: 'media',
        label: 'Media',
    },
    {
        value: 'cta',
        label: 'Call to action',
        fields: [
            {
                value: 'text',
                label: 'Button text',
            },
        ],
    },
    {
        value: 'wysiwyg',
        label: 'WYSIWYG',
    },
    {
        value: 'list',
        label: 'List',
    },
];

const hasSubFields = (field) =>
    fieldTypes.some(fieldType =>
        fieldType.value == field.type && fieldType.fields !== undefined
    );

const SubFields = ({ field, index }) => {
    if (!hasSubFields(field)) {
        return null;
    }

    const fieldType = fieldTypes.find(fieldType =>
        fieldType.value == field.type && fieldType.fields !== undefined);

    const { fields, remove, append } = useFieldArray({
        name: `fields.${index}.fields`
    });

    return <>
        {fieldType.fields.map((field, subIndex) => <div className="row" key={subIndex}>
            <div className="col-4">
                <Input
                    label={field.label}
                    name={`fields.${index}.fields.${subIndex}.${field.value}`}
                />
            </div>
        </div>)}
    </>
};

export const CardTemplateForm = () => {
    const { id } = useParams();
    const isNew = id === undefined;

    const methods = useForm({
        resolver: yupResolver(schema),
    });

    const { fields, append, remove, swap, update } = useFieldArray({
        control: methods.control,
        name: 'fields',
        keyName: 'key',
    });

    const watchName = methods.watch('name');

    const navigate = useNavigate();

    const getCardTemplateResult = useQuery(GET_CARD_TEMPLATE, {
        variables: {
            id
        },
        skip: isNew,
    });

    const [upsertCardTemplate, upsertCardTemplateResult] = useMutation(UPSERT_CARD_TEMPLATE, {
        onCompleted: (data) => {
            navigate(`/pages/cards/${data.upsertCardTemplate.id}`);
        },
        update: (cache, { data: { upsertCardTemplate } }) => {
            const data = cache.readQuery({
                query: GET_CARD_TEMPLATES
            });

            if (data !== null) {
                const cardTemplates = _.cloneDeep(data.cardTemplates);

                if (isNew) {
                    cardTemplates.push(upsertCardTemplate);
                } else {
                    cardTemplates.forEach(cardTemplate => {
                        if (cardTemplate.id === upsertCardTemplate.id) {
                            cardTemplate = upsertCardTemplate;
                        }
                    });
                }

                cache.writeQuery({
                    query: GET_CARD_TEMPLATES,
                    data: {
                        cardTemplates
                    },
                });
            }
        },
    });

    const handleSave = (data) => {
        let { fields } = data;

        const cardTemplate = {
            id: !isNew ? id : null,
            name: data.name,
            key: data.key,
            config: JSON.stringify(fields),
        };

        upsertCardTemplate({
            variables: {
                input: cardTemplate
            }
        });
    };

    const Footer = () => (
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button color="secondary" onClick={methods.handleSubmit(handleSave)}>Save</Button>
        </Box>
    );

    const heading = isNew ? 'Add card template' : 'Edit card template';

    const isLoading = getCardTemplateResult.loading || upsertCardTemplateResult.loading;
    const error = getCardTemplateResult.error || upsertCardTemplateResult.error;

    useEffect(() => {
        if (getCardTemplateResult.loading === false && getCardTemplateResult.data) {
            const cardTemplate = getCardTemplateResult.data.cardTemplate;

            methods.setValue('name', cardTemplate.name);
            methods.setValue('key', cardTemplate.key);
            methods.setValue('fields', JSON.parse(cardTemplate.config));
        }
    }, [getCardTemplateResult.loading, getCardTemplateResult.data]);

    useEffect(() => {
        const subscription = methods.watch((value, { name, type }) => {
          if (name === 'name') {
            methods.setValue('key', _.kebabCase(value.name));
          }
        });

        return () => subscription.unsubscribe();
      }, [methods.watch]);

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

                    <Input
                        label="Key"
                        name="key"
                        disabled
                    />
                </PageContent>

                <PageContent heading="Fields">
                    {fields.map((field, index) => {
                        return (
                            <PageCard
                                key={field.key}
                                footer={
                                    <FieldActions
                                        fields={fields}
                                        index={index}
                                        swap={swap}
                                        remove={remove}
                                    />
                                }
                            >
                                <Select
                                    label="Type"
                                    name={`fields.${index}.type`}
                                    options={fieldTypes}
                                    onChange={(e) => update(index, { ...field, type: e.target.value })}
                                />

                                <div className="row">
                                    <div className="col-4">
                                        <Input
                                            label="Label"
                                            name={`fields.${index}.label`}
                                            onChangeExtra={(e) => methods.setValue(`fields.${index}.id`, _.kebabCase(e.target.value))}
                                        />
                                    </div>

                                    <div className="col-2">
                                        <Input
                                            label="Key"
                                            disabled
                                            name={`fields.${index}.id`}
                                        />
                                    </div>
                                </div>

                                <SubFields
                                    field={field}
                                    index={index}
                                />
                            </PageCard>
                        );
                    })}

                    <Button onClick={() => append({})}>
                        Add field
                    </Button>
                </PageContent>
            </Page>
        </FormProvider>
    );
};