import { Button } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FieldActions } from "../../components/Field";
import { Input } from "../../components/Form/Input";
import { SelectMedia } from "../../components/Form/SelectMedia";
import { PageCard } from "../../components/PageCard";

export const Slides = () => {
    const { fields, append, remove, swap, update } = useFieldArray({
        name: 'slides',
        keyName: 'key',
    });

    const { watch } = useFormContext();

    const watchCaption = watch('captions');

    return (
        <>
            {fields.map((field, index) => {
                return <PageCard
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
                    <SelectMedia
                        label="Media"
                        name={`slides.${index}.media`}
                    />

                    <Input
                        label="Alternative text"
                        name={`slides.${index}.alt`}
                    />

                    {watchCaption === true && <>
                        <Input
                            label="Caption"
                            name={`slides.${index}.caption`}
                        />

                        <Input
                            label="Sub caption"
                            name={`slides.${index}.subCaption`}
                        />
                    </>}
                </PageCard>
            })}

            <Button onClick={() => append({})}>
                Add slide
            </Button>
        </>
    );
};