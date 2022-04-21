import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { truncate } from "../components/ContentBlockEditor/ContentBlock";
import { Textarea } from "../components/Form/Textarea";
import { usePrompt } from "../tmp-prompt";

const schema = yup.object({
    html: yup.string().required(),
});

export const HtmlPreview = ({ content, showDetails }) => {
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

export const HtmlBlockEditor = forwardRef(({ content, save }, ref) => {
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
            <Textarea
                label="Text"
                style={{ height: '20rem' }}
                name="html"
            />
        </FormProvider>
    );
});