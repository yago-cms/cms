import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { truncate } from "../components/ContentBlockEditor/ContentBlock";
import { Input } from "../components/Form/Input";
import { Select } from "../components/Form/Select";
import { SelectPage } from "../components/Form/SelectPage";
import { usePrompt } from "../tmp-prompt";

const schema = yup.object({
    type: yup.string().required(),
    source: yup.string().required(),
    label: yup.string().required(),
    url: yup.string().when('source', {
        is: 'external',
        then: (schema) => schema.required(),
    }),
    page: yup.string().when('source', {
        is: 'page',
        then: (schema) => schema.required(),
    }),
});

export const CtaPreview = ({ content, showDetails }) => {
    return showDetails
        ? <div>
            <dl>
                <dt>Source</dt>
                <dd>{content.source}</dd>

                <dt>Label</dt>
                <dd>{content.label}</dd>

                <dt>URL</dt>
                <dd>{content.url}</dd>
            </dl>
        </div>
        : <div>
            {truncate(content.label)} - {truncate(content.url)}
        </div>
};

export const CtaBlockEditor = forwardRef(({ content, save }, ref) => {
    const methods = useForm({
        resolver: yupResolver(schema),
    });

    const watchSource = methods.watch('source');

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
    }, [])

    return (
        <FormProvider {...methods}>
            <Select
                label="Type"
                options={[
                    {
                        value: 'link',
                        label: 'Link',
                    },
                    {
                        value: 'button',
                        label: 'Button',
                    },
                ]}
                name="type"
            />

            <Select
                label="Source"
                options={[
                    {
                        value: 'page',
                        label: 'Page',
                    },
                    {
                        value: 'external',
                        label: 'External URL',
                    },
                ]}
                name="source"
            />

            <Input
                label="Label"
                name="label"
            />

            {watchSource == 'page' && <SelectPage
                label="Page"
                name="page"
            />}

            {watchSource == 'external' && <Input
                label="URL"
                name="url"
            />}
        </FormProvider>
    );
});