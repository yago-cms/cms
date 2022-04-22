import { Checkbox as MuiCheckbox, FormControlLabel, FormHelperText } from "@mui/material";
import { useController } from "react-hook-form";

export const Checkbox = ({ name, label, helperText, ...props }) => {
    const {
        field: { onChange, onBlur, value, ref },
    } = useController({
        name,
        defaultValue: false,
    });

    const Checkbox = () => (
        <MuiCheckbox
            inputRef={ref}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            checked={value}
            {...props}
        />
    );

    return (
        label
            ? <FormControlLabel
                control={
                    <Checkbox />
                }
                label={<>
                    {label}
                    {helperText && <FormHelperText>{helperText}</FormHelperText>}
                </>}
            />
            : <Checkbox />
    );
};