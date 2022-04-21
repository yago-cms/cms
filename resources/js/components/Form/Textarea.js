import { TextField } from "@mui/material";
import { useController } from "react-hook-form";

export const Textarea = ({ name, ...props }) => {
    const {
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
        formState: { isSubmitting }
    } = useController({
        name,
        defaultValue: '',
    });

    const { onChangeExtra } = props;

    return (
        <TextField
            fullWidth
            multiline
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
            helperText={error?.message}
            minRows={6}
            {...props}
        />
    );
};