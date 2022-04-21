import { useQuery } from "@apollo/client";
import { faPhotoVideo } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Dialog, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { GET_SETTINGS } from "../../queries";
import { Error } from "../Error";
import { FileManager } from "../FileManager";
import { Loading } from "../Loading";

export const SelectMedia = ({ label, name, handleDelete, isBreakpointsEnabled, ...props }) => {
    const [breakpointGroups, setBreakpointGroups] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { field, fieldState } = useController({
        name,
        defaultValue: isBreakpointsEnabled ? { source: '', breakpointGroup: 'default' } : '',
    });

    const getSettingsResult = useQuery(GET_SETTINGS, {
        variables: {
            id: 'media',
        }
    });

    const isLoading = getSettingsResult.loading;
    const error = getSettingsResult.error;

    useEffect(() => {
        if (getSettingsResult.loading === false && getSettingsResult.data) {
            const { breakpointGroups } = JSON.parse(getSettingsResult.data.settings.value);

            setBreakpointGroups(breakpointGroups);
        }
    }, [getSettingsResult.loading, getSettingsResult.data]);

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    const handleSelectMedia = (path) => {
        setIsDrawerOpen(false);

        if (isBreakpointsEnabled) {
            field.onChange({
                source: path,
                breakpointGroup: field.value.breakpointGroup,
            });
        } else {
            field.onChange(path);
        }
    };

    const id = `select-${_.uniqueId()}`;

    return (
        <>
            <Box sx={{
                display: 'flex',
            }}>
                <TextField
                    fullWidth={!isBreakpointsEnabled}
                    label={label}
                    inputRef={field.ref}
                    value={isBreakpointsEnabled ? field.value.source : field.value}
                    onBlur={field.onBlur}
                    onClick={() => { setIsDrawerOpen(true) }}
                    error={!!fieldState.error?.message}
                    helperText={fieldState.error?.message}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FontAwesomeIcon icon={faPhotoVideo} size="lg" />
                            </InputAdornment>
                        )
                    }}
                />

                {isBreakpointsEnabled && <FormControl
                    fullWidth
                    error={!!error?.message}
                >
                    <InputLabel id={id}>Breakpoint</InputLabel>

                    {breakpointGroups && <Select
                        id={id}
                        label="Breakpoint"
                        onChange={(e) => {
                            field.onChange({
                                source: field.value.source,
                                breakpointGroup: e.target.value,
                            });
                        }}
                        onBlur={field.onBlur}
                        value={field.value.breakpointGroup}
                    >
                        {breakpointGroups && breakpointGroups.map((breakpointGroup) => (
                            <MenuItem value={breakpointGroup.key} key={breakpointGroup.key}>{breakpointGroup.name}</MenuItem>
                        ))}
                    </Select>}
                </FormControl>}
            </Box>

            <Dialog
                fullScreen
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            >
                <DialogTitle>Select media</DialogTitle>

                <DialogContent>
                    <FileManager
                        isSelectMode
                        filter="media"
                        onSelectFile={handleSelectMedia}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};