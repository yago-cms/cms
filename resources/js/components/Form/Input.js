import { Input as MuiInput, TextField } from "@mui/material";
import { useController } from "react-hook-form";

export const Input = ({ name, helperText, onChange, ...props }) => {
    const {
        field,
        fieldState: { error },
        formState: { isSubmitting }
    } = useController({
        name,
        defaultValue: '',
    });

    if (props.type == 'hidden') {
        return (
            <MuiInput
                type="hidden"
                onChange={(event) => {
                    field.onChange(event);

                    if (onChange) {
                        onChange(event);
                    }
                }}
                value={field.value}
                sx={{ display: 'none' }}
            />
        );
    }

    return (
        <TextField
            fullWidth
            disabled={isSubmitting}
            onChange={(event) => {
                field.onChange(event);

                if (onChange) {
                    onChange(event);
                }
            }}
            onBlur={field.onBlur}
            value={field.value}
            name={name}
            inputRef={field.ref}
            error={!!error?.message}
            helperText={error?.message || helperText}
            {...props}
        />
    );
};