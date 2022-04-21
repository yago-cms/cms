import { useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Chip, Divider } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Controller, FormProvider, useController, useFieldArray, useForm, useFormContext, useWatch } from "react-hook-form";
import * as yup from "yup";
import { Error } from "../components/Error";
import { FieldActions } from "../components/Field";
import { Input } from "../components/Form/Input";
import { Select } from "../components/Form/Select";
import { SelectMedia } from "../components/Form/SelectMedia";
import { Wysiwyg } from "../components/Form/Wysiwyg";
import { Loading } from "../components/Loading";
import { PageCard } from "../components/PageCard";
import { GET_CARD_TEMPLATES } from "../queries";
import { usePrompt } from "../tmp-prompt";

const schema = yup.object({
    template: yup.number().required().positive(),
});

export const CardTitle = ({ content }) => {
    const { loading: isLoading, error, data } = useQuery(GET_CARD_TEMPLATES);

    if (isLoading) return null;
    if (error) return <Error message={error.message} />

    let templateName = 'N/A';

    data.cardTemplates.forEach(cardTemplate => {
        if (cardTemplate.id == content.template) {
            templateName = cardTemplate.name;
        }
    });

    return (
        <div>
            Card <span className="fw-normal">- {templateName}</span>
        </div>
    );
};

export const CardPreview = ({ content, showDetails }) => {
    delete content.template;

    return (
        showDetails
            ? <div>
                <dl>
                    {Object.entries(content).map(([name, value], key) => <div key={key}>
                        <dt>{_.startCase(_.replace(name, '-', ' '))}</dt>
                        <dd>{value}</dd>
                    </div>)}
                </dl>
            </div>
            : null
    )
};

export const CardFields = ({ isLabelEnabled }) => {
    const [cardTemplates, setCardTemplates] = useState([]);
    const [templateCardFields, setTemplateCardFields] = useState([]);

    const { reset, getValues, watch } = useFormContext();

    const getCardTemplatesResult = useQuery(GET_CARD_TEMPLATES);

    const { fields, append, swap, remove } = useFieldArray({
        name: 'cards'
    });
    const watchTemplate = watch('cardTemplate');

    const loading = getCardTemplatesResult.loading;
    const error = getCardTemplatesResult.error;

    useEffect(() => {
        if (getCardTemplatesResult.loading === false && getCardTemplatesResult.data) {
            let cardTemplates = getCardTemplatesResult.data.cardTemplates;
            cardTemplates = cardTemplates.map(cardTemplate => ({
                value: cardTemplate.id,
                label: cardTemplate.name,
            }));
            setCardTemplates(cardTemplates);
        }
    }, [getCardTemplatesResult.loading, getCardTemplatesResult.data]);

    useEffect(() => {
        if (getCardTemplatesResult.data) {
            if (watchTemplate > 0) {
                const cardTemplates = getCardTemplatesResult.data.cardTemplates;

                cardTemplates.forEach(cardTemplate => {
                    if (cardTemplate.id == watchTemplate) {
                        setTemplateCardFields(JSON.parse(cardTemplate.config));
                    }
                });
            } else {
                setTemplateCardFields([]);
                reset({
                    ...getValues(),
                    cards: [],
                });
            }
        }
    }, [watchTemplate, getCardTemplatesResult.data]);

    if (loading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <>
            <Select
                label="Template"
                name="cardTemplate"
                options={cardTemplates}
            />

            {watchTemplate && <>
                <Divider
                    textAlign="left"
                    sx={(theme) => ({
                        marginBottom: theme.spacing(2),
                    })}
                >
                    <Chip label="Cards" />
                </Divider>

                {fields.map((field, fieldIndex) => {
                    return <PageCard
                        key={field.id}
                        footer={
                            <FieldActions
                                fields={fields}
                                index={fieldIndex}
                                swap={swap}
                                remove={remove}
                            />
                        }
                    >
                        {isLabelEnabled && <Input
                            label="Label"
                            name={`cards.${fieldIndex}.label`}
                        />}

                        {templateCardFields && templateCardFields.map((templateCardField, index) => {
                            const cardField = {
                                ...templateCardField
                            };
                            cardField.id = `cards.${fieldIndex}.${cardField.id}`;

                            return <CardField
                                key={index}
                                field={cardField}
                            />
                        })}
                    </PageCard>
                })}

                <Button onClick={() => append({})}>
                    Add card
                </Button>
            </>}
        </>
    );
};

export const CardField = ({ field }) => {
    const { watch, control } = useFormContext();

    const renderField = (field) => {
        switch (field.type) {
            case 'text':
                return <Input
                    label={field.label}
                    name={field.id}
                />
            case 'media':
                return <SelectMedia
                    label={field.label}
                    name={field.id}
                    isBreakpointsEnabled
                />
            case 'cta':
                return <Input
                    label={field.label}
                    name={field.id}
                />
            case 'wysiwyg':
                return (
                    <Box sx={{
                        height: '20rem',
                        mb: 4,
                    }}>
                        <Wysiwyg name={field.id} />
                    </Box>
                )
            case 'list':
                const { fields, append, swap, remove } = useFieldArray({
                    name: field.id
                });
                const watchFieldArray = useWatch({control, name: field.id})
                const controlledFields = fields.map((field, index) => {
                    return {
                        ...field,
                        ...watchFieldArray[index]
                    };
                });
                const fieldId = field.id;

                return (
                    <>
                        <Divider
                            textAlign="left"
                            sx={(theme) => ({
                                marginBottom: theme.spacing(2),
                            })}
                        >
                            <Chip label={field.label} />
                        </Divider>

                        <div className="mb-3">
                            {controlledFields.map((field, index) => {
                                return <PageCard
                                    key={field.id}
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
                                        label="Item"
                                        name={`${fieldId}.${index}.item`}
                                    />
                                </PageCard>
                            })}
                        </div>

                        <Button onClick={() => append({})}>
                            Add item
                        </Button>
                    </>
                );
        }
    };

    return (
        <div>
            {renderField(field)}
        </div>
    );
};

export const CardBlockEditor = forwardRef(({ content, save }, ref) => {
    const [cardTemplates, setCardTemplates] = useState([]);
    const [fields, setFields] = useState([]);

    const methods = useForm({
        resolver: yupResolver(schema),
    });
    const watchTemplate = methods.watch('template');

    const getCardTemplatesResult = useQuery(GET_CARD_TEMPLATES);

    const handleSave = (data) => {
        save(JSON.stringify(data));
    };

    const handleError = () => {
        throw new Error();
    };

    useImperativeHandle(ref, () => ({
        save() {
            return methods.handleSubmit(handleSave, handleError)();
        }
    }));

    usePrompt('Are you sure you want to leave this page? You will lose any unsaved data.', methods.isDirty);

    const loading = getCardTemplatesResult.loading;
    const error = getCardTemplatesResult.error;

    useEffect(() => {
        if (getCardTemplatesResult.loading === false && getCardTemplatesResult.data) {
            let cardTemplates = getCardTemplatesResult.data.cardTemplates;
            cardTemplates = cardTemplates.map(cardTemplate => ({
                value: cardTemplate.id,
                label: cardTemplate.name,
            }));
            setCardTemplates(cardTemplates);
        }
    }, [getCardTemplatesResult.loading, getCardTemplatesResult.data]);

    useEffect(() => {
        if (getCardTemplatesResult.loading === false && getCardTemplatesResult.data) {
            if (!content) {
                return;
            }

            let json = {};

            try {
                json = JSON.parse(content);
            } catch {
                console.log('Invalid JSON');
                return;
            }

            methods.setValue('template', json.template);

            const cardTemplates = getCardTemplatesResult.data.cardTemplates;
            cardTemplates.forEach(cardTemplate => {
                if (cardTemplate.id == json.template) {
                    const fields = JSON.parse(cardTemplate.config);

                    fields.forEach(field => {
                        methods.setValue(field.id, json[field.id]);
                    });
                }
            });
        }
    }, [getCardTemplatesResult.loading, getCardTemplatesResult.data, cardTemplates]);

    useEffect(() => {
        if (watchTemplate > 0) {
            const cardTemplates = getCardTemplatesResult.data.cardTemplates;

            cardTemplates.forEach(cardTemplate => {
                if (cardTemplate.id == watchTemplate) {
                    setFields(JSON.parse(cardTemplate.config));
                }
            });
        }
    }, [watchTemplate]);

    if (loading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <FormProvider {...methods}>
            <Select
                label="Template"
                name="template"
                options={cardTemplates}
            />

            {fields && fields.map((field, index) => <CardField
                key={index}
                field={field}
            />)}
        </FormProvider>
    );
});