import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { truncate } from "../components/ContentBlockEditor/ContentBlock";
import { Input } from "../components/Form/Input";
import { Select } from "../components/Form/Select";
import { usePrompt } from "../tmp-prompt";

const schema = yup.object({
    type: yup.string().required(),
    text: yup.string().required(),
});

export const HeadingPreview = ({ content, showDetails }) => {
    return showDetails
        ? <div>
            <dl>
                <dt>Type</dt>
                <dd>{content.type}</dd>

                <dt>Text</dt>
                <dd>{content.text}</dd>
            </dl>
        </div>
        : <div>
            {truncate(content.text)}
        </div>
};

export const HeadingBlockEditor = forwardRef(({ content, save }, ref) => {
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
                        value: 'h1',
                        label: 'Header 1',
                    },
                    {
                        value: 'h2',
                        label: 'Header 2',
                    },
                    {
                        value: 'h3',
                        label: 'Header 3',
                    },
                    {
                        value: 'h4',
                        label: 'Header 4',
                    },
                    {
                        value: 'h5',
                        label: 'Header 5',
                    },
                    {
                        value: 'h6',
                        label: 'Header 6',
                    },
                ]}
                name="type"
            />

            <Input
                label="Text"
                name="text"
            />
        </FormProvider>
    );
});