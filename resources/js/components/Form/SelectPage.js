import { faFileAlt } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogContent, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useController } from "react-hook-form";
import { DialogTitle } from "../DialogTitle";
import { PageTree } from "../PageTree";

export const SelectPage = ({ label, name, ...props }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { field, fieldState: { error } } = useController({
        name,
        defaultValue: '',
    });

    const handleSelectPage = (id) => {
        field.onChange(id);
        setIsDrawerOpen(false);
    };

    return (
        <>
            <TextField
                fullWidth
                label={label}
                inputRef={field.ref}
                value={field.value}
                error={!!error?.message}
                helperText={error?.message}
                onBlur={field.onBlur}
                onClick={() => { setIsDrawerOpen(true) }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <FontAwesomeIcon icon={faFileAlt} size="lg" />
                        </InputAdornment>
                    )
                }}
                {...props}
            />

            <Dialog
                fullScreen
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            >
                <DialogTitle onClose={() => setIsDrawerOpen(false)}>Select page</DialogTitle>

                <DialogContent dividers>
                    <PageTree
                        onSelectPage={handleSelectPage}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};