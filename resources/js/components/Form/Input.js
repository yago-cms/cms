import { Input as MuiInput, TextField } from "@mui/material";
import { useController } from "react-hook-form";

export const Input = ({ name, helperText, onChangeExtra, ...props }) => {
    const {
        field: { onChange, onBlur, value, ref },
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
                onChange={(e) => {
                    onChange(e);

                    if (onChangeExtra) {
                        onChangeExtra(e);
                    }
                }}
                value={value}
                sx={{ display: 'none' }}
            />
        );
    }

    return (
        <TextField
            fullWidth
            disabled={isSubmitting}
            onChange={(e) => {
                onChange(e);

                if (onChangeExtra) {
                    onChangeExtra(e);
                }
            }}
            onBlur={onBlur}
            value={value}
            name={name}
            inputRef={ref}
            error={!!error?.message}
            helperText={error?.message || helperText}
            {...props}
        />
    );
};