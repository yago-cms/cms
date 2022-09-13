import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker as MuiTimePicker } from "@mui/x-date-pickers/TimePicker";
import { useController } from "react-hook-form";

export const TimePicker = ({ name, size, ...props }) => {
    const {
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
    } = useController({
        name,
        defaultValue: null,
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MuiTimePicker
                inputFormat="HH:mm"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                inputRef={ref}
                mask="__:__"
                ampm={false}
                renderInput={(params) => <TextField
                    fullWidth
                    error={!!error?.message}
                    helperText={error?.message}
                    size={size}
                    {...params}
                />}
                {...props}
            />
        </LocalizationProvider>
    );
};