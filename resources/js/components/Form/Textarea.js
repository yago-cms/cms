import { TextField } from "@mui/material";
import { useController } from "react-hook-form";

export const Textarea = ({ name, helperText, onChange, ...props }) => {
    const {
        field,
        fieldState: { error },
        formState: { isSubmitting }
    } = useController({
        name,
        defaultValue: '',
    });

    return (
        <TextField
            fullWidth
            multiline
            disabled={isSubmitting}
            onChange={(e) => {
                field.onChange(e);

                if (onChange) {
                    onChange(e);
                }
            }}
            onBlur={field.onBlur}
            value={field.value}
            name={name}
            inputRef={field.ref}
            error={!!error?.message}
            helperText={error?.message || helperText}
            minRows={6}
            {...props}
        />
    );
};