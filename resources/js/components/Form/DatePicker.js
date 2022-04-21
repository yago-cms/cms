import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useController } from "react-hook-form";

export const DatePicker = ({ name, onChangeExtra, ...props }) => {
    const {
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
    } = useController({
        name,
        defaultValue: null,
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
                inputFormat="yyyy-MM-dd"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                inputRef={ref}
                mask="____-__-__"
                renderInput={(params) => <TextField
                    fullWidth
                    error={!!error?.message}
                    helperText={error?.message}
                    {...params}
                />}
                {...props}
            />
        </LocalizationProvider>
    );
};