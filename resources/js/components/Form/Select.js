import { FormControl, FormHelperText, InputLabel, MenuItem, Select as MuiSelect } from "@mui/material";
import { useController } from "react-hook-form";

export const Select = ({ name, label, options, helperText, onChange, ...props }) => {
    const {
        field,
        fieldState: { error },
        formState: { isSubmitting }
    } = useController({
        name,
        defaultValue: '',
    });

    const id = `select-${_.uniqueId()}`;

    return (
        <FormControl
            fullWidth
            error={!!error?.message}
        >
            <InputLabel id={id}>{label}</InputLabel>

            {options.length > 0 && <MuiSelect
                id={id}
                label={label}
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
                ref={field.ref}
                {...props}
            >
                {options.map((option) => <MenuItem value={option.value} key={option.value}>
                    {option.label}
                </MenuItem>)}
            </MuiSelect>}
            {error?.message && <FormHelperText error>{error.message}</FormHelperText>}
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};