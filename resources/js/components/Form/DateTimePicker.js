import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useController } from "react-hook-form";

export const DateTimePicker = ({ name, ...props }) => {
    const {
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
    } = useController({
        name,
        defaultValue: null,
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDateTimePicker
                inputFormat="yyyy-MM-dd HH:mm"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                inputRef={ref}
                mask="____-__-__ __:__"
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