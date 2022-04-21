import { useLazyQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { Select } from "../components/Form/Select";
import { Loading } from "../components/Loading";
import { GET_FIELDS } from "../queries";
import { usePrompt } from "../tmp-prompt";

const schema = yup.object({
    field: yup.string().required(),
});

export const FieldPreview = ({ content }) => {
    return <div>
        <dl>
            <dt>Field</dt>
            <dd>{content.field}</dd>
        </dl>
    </div>
};

export const FieldBlockEditor = forwardRef(({ content, save }, ref) => {
    const [fields, setFields] = useState([]);

    const methods = useForm({
        resolver: yupResolver(schema),
    });

    const [getFields, getFieldsResult] = useLazyQuery(GET_FIELDS);

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

    const isLoading = getFieldsResult.loading;
    const error = getFieldsResult.error;

    useEffect(() => {
        getFields();

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
        if (getFieldsResult.loading === false && getFieldsResult.data) {
            setFields(getFieldsResult.data.fields);
        }
    }, [getFieldsResult.loading, getFieldsResult.data]);

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <FormProvider {...methods}>
            {fields.length
                ? (
                    <Select
                        label="Field"
                        options={fields.map(field => ({
                            value: field.key,
                            label: field.name,
                        }))}
                        name="field"
                    />
                )
                : (
                    <Typography>There are no fields.</Typography>
                )
            }
        </FormProvider>
    );
});