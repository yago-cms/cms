import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { FieldActions } from "../components/Field";
import { Input } from "../components/Form/Input";
import { SelectBreakpoint } from "../components/Form/SelectBreakpoint";
import { SelectMedia } from "../components/Form/SelectMedia";
import { PageCard } from "../components/PageCard";
import { usePrompt } from "../tmp-prompt";

const schema = yup.object({
    breakpoint: yup.string().required(),
    medias: yup.array().of(
        yup.object().shape({
            source: yup.string().required(),
            alt: yup.string(),
        })
    ),
});

export const MediaPreview = ({ content }) => {
    if (!content.medias) {
        return null;
    }

    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap'
        }}>
            {content.medias.map((media, key) => <Box sx={{ width: '25%', p: 1 }} key={key}>
                {media.alt}
                <img style={{ width: '100%' }} src={`/storage/upload/${media.source}`} />
            </Box>)}
        </Box>
    );
};

export const MediaBlockEditor = forwardRef(({ content, save }, ref) => {
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
        name: 'medias'
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
            <SelectBreakpoint
                label="Media breakpoint"
                name="breakpoint"
            />

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
                    <SelectMedia
                        label="Media"
                        name={`medias.${index}.source`}
                    />

                    <Input
                        label="Alternative text"
                        name={`medias.${index}.alt`}
                    />
                </PageCard>
            })}

            <Button
                onClick={() => append({})}
            >
                Add media
            </Button>
        </FormProvider>
    );
});