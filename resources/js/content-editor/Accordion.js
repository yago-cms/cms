import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Chip, Divider, FormGroup } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { truncate } from "../components/ContentBlockEditor/ContentBlock";
import { Error } from "../components/Error";
import { FieldActions } from "../components/Field";
import { Checkbox } from "../components/Form/Checkbox";
import { Input } from "../components/Form/Input";
import { Select } from "../components/Form/Select";
import { Wysiwyg } from "../components/Form/Wysiwyg";
import { PageCard } from "../components/PageCard";
import { usePrompt } from "../tmp-prompt";
import { CardFields } from "./Card";

const schema = yup.object({
    alwaysOpen: yup.bool(),
    firstOpen: yup.bool(),
    useLabelAsId: yup.bool(),
    type: yup.string().required(),
    cardTemplate: yup.number(),
    cards: yup.array().of(
        yup.object().shape({
            label: yup.string().required(),
        }),
    ),
    texts: yup.array().of(
        yup.object().shape({
            label: yup.string().required(),
        }),
    ),
});

export const AccordionPreview = ({ content, showDetails }) => {
    return showDetails
        ? <div>
            <dl>
                <dt>Text</dt>
                <dd>{content.text}</dd>
            </dl>
        </div>
        : <div>
            {truncate(content.text)}
        </div>
};

const TextFields = ({ register }) => {
    const { fields, append, swap, remove } = useFieldArray({
        name: 'texts'
    });

    return (
        <>
            <Divider
                textAlign="left"
                sx={(theme) => ({
                    marginBottom: theme.spacing(2),
                })}
            >
                <Chip label="Text" />
            </Divider>

            {fields.map((field, index) => {
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
                        label="Label"
                        name={`texts.${index}.label`}
                    />

                    <div className="mb-3" style={{ height: '20rem' }}>
                        <Wysiwyg name={`texts.${index}.text`} />
                    </div>
                </PageCard>
            })}

            <Button onClick={() => append({})}>
                Add text
            </Button>
        </>
    );
};

export const AccordionBlockEditor = forwardRef(({ content, save }, ref) => {
    const methods = useForm({
        resolver: yupResolver(schema),
    });

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

    const watchType = methods.watch('type');

    usePrompt('Are you sure you want to leave this page? You will lose any unsaved data.', methods.isDirty);

    useEffect(() => {
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

        for (const field in json) {
            if (field in schema.fields) {
                methods.setValue(field, json[field]);
            }
        }
    }, []);

    useEffect(() => {
        if (watchType == 'card') {
            methods.reset({
                ...methods.getValues(),
            });
        } else if (watchType == 'text') {
            methods.reset({
                ...methods.getValues(),
                cards: [],
            });
        }
    }, [watchType]);

    return (
        <FormProvider {...methods}>
            <FormGroup sx={{ mb: 2 }}>
                <Checkbox
                    label="Always open"
                    name="alwaysOpen"
                />

                <Checkbox
                    label="Open first item"
                    name="firstOpen"
                />

                <Checkbox
                    label="Use label as ID"
                    name="useLabelAsId"
                />
            </FormGroup>

            <Select
                label="Type"
                options={[
                    {
                        value: 'card',
                        label: 'Card',
                    },
                    {
                        value: 'text',
                        label: 'Text',
                    },
                ]}
                name="type"
            />

            {watchType == 'card' && <CardFields
                isLabelEnabled
            />}

            {watchType == 'text' &&
                <TextFields />
            }
        </FormProvider>
    );
});