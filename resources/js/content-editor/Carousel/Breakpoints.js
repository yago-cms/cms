import { Button } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import { FieldActions } from "../../components/Field";
import { Input } from "../../components/Form/Input";
import { PageCard } from "../../components/PageCard";

export const Breakpoints = () => {
    const { fields, append, remove, swap } = useFieldArray({
        name: 'breakpoints',
        keyName: 'key',
    });

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
                    <Input
                        label="Target width"
                        name={`breakpoints.${index}.targetWidth`}
                    />

                    <Input
                        label="Slides per view"
                        name={`breakpoints.${index}.slidesPerView`}
                    />

                    <Input
                        label="Slides per group"
                        name={`breakpoints.${index}.slidesPerGroup`}
                    />

                    <Input
                        label="Space between"
                        name={`breakpoints.${index}.spaceBetween`}
                    />
                </PageCard>
            })}

            <Button onClick={() => append({
                targetWidth: '',
                slidesPerView: 0,
                slidesPerGroup: 0,
                spaceBetween: 0,
            })}>
                Add breakpoint
            </Button>
        </>
    );
};
