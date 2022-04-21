import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { FieldActions } from "../components/Field";
import { Input } from "../components/Form/Input";
import { Select } from "../components/Form/Select";
import { PageCard } from "../components/PageCard";
import { usePrompt } from "../tmp-prompt";

const schema = yup.object({
    type: yup.string().required(),
    items: yup.array().of(
        yup.object().shape({
            item: yup.string().required(),
        }),
    ),
});

export const ListPreview = ({ content, showDetails }) => {
    return showDetails
        ? <div>
            <dl>
                <dt>Type</dt>
                <dd>{content.type}</dd>

                {content.items && <>
                    <dt>Items</dt>
                    <dd>{content.items.map(item => item.item).join(' - ')}</dd>
                </>}
            </dl>
        </div>
        : null
};

export const ListBlockEditor = forwardRef(({ content, save }, ref) => {
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

    const { fields, append, remove, swap } = useFieldArray({
        control: methods.control,
        name: 'items',
    });

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

    return (
        <FormProvider {...methods}>
            <Select
                label="Type"
                options={[
                    {
                        value: 'ul',
                        label: 'Unordered',
                    },
                    {
                        value: 'ol',
                        label: 'Ordered',
                    }
                ]}
                name="type"
            />

            <div className="mb-3">
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
                            label="Item"
                            name={`items.${index}.item`}
                        />
                    </PageCard>
                })}
            </div>

            <Button
                onClick={() => append({})}
            >
                Add item
            </Button>
        </FormProvider>
    );
});