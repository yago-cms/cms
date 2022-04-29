import { useQuery } from "@apollo/client";
import { faMapMarkerAlt } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Wrapper } from "@googlemaps/react-wrapper";
import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { GET_SETTINGS } from "../../queries";
import { DialogTitle } from "../DialogTitle";
import { Error } from "../Error";
import { Loading } from "../Loading";
import { Map, Marker } from "../Map";

export const Location = ({ name, label, defaultZoom, defaultCenter, helperText, ...props }) => {
    const [marker, setMarker] = useState(null);
    const [zoom, setZoom] = useState(defaultZoom);
    const [center, setCenter] = useState(defaultCenter);
    const [isMapShowing, setIsMapShowing] = useState(false);
    const [displayValue, setDisplayValue] = useState('');

    const {
        field: { onChange, onBlur, value, ref },
        formState,
    } = useController({
        name,
        defaultValue: {
            lat: 0,
            lng: 0,
        },
    });

    const getSettingsResult = useQuery(GET_SETTINGS, {
        variables: {
            id: 'general'
        }
    });

    const handleClick = (event) => {
        const latLng = {
            lat: _.round(event.latLng.lat(), 8),
            lng: _.round(event.latLng.lng(), 8),
        };

        setMarker(latLng);
        onChange(latLng);
        setDisplayValue(`${latLng.lat}, ${latLng.lng}`);
    };

    const handleToggleMap = () => {
        setIsMapShowing(!isMapShowing);
    };

    useEffect(() => {
        if (value && value.lat != 0 && value.lng != 0) {
            setMarker(value);
            setDisplayValue(`${value.lat}, ${value.lng}`);

            if (!isMapShowing) {
                setCenter(value);
            }
        }
    }, [value]);

    const isLoading = getSettingsResult.loading;
    const error = getSettingsResult.error;

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    const settings = getSettingsResult.data.settings ? JSON.parse(getSettingsResult.data.settings.value) : null;
    const googleMapsApiKey = settings?.api?.googleMaps ?? false;

    const render = (status) => {
        return status;
    };

    return (
        googleMapsApiKey
            ? (
                <>
                    <FormControl fullWidth>
                        <InputLabel htmlFor={name}>{label}</InputLabel>

                        <OutlinedInput
                            id={name}
                            type="text"
                            value={displayValue}
                            onChange={onChange}
                            onBlur={onBlur}
                            inputRef={ref}
                            error={!!formState.error?.message}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleToggleMap}
                                        edge="end"
                                    >
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                    </IconButton>
                                </InputAdornment>
                            }
                            label={label}
                        />

                        {formState.error?.message && <FormHelperText error>{formState.error.message}</FormHelperText>}
                        {helperText && <FormHelperText>{helperText}</FormHelperText>}
                    </FormControl>

                    <Dialog
                        open={isMapShowing}
                        fullWidth
                        maxWidth="lg"
                    >
                        <DialogTitle onClose={() => setIsMapShowing(false)}>Location</DialogTitle>

                        <DialogContent dividers>
                            <Box sx={{ display: 'flex', height: '40rem' }}>
                                <Wrapper apiKey={googleMapsApiKey} render={render} >
                                    <Map
                                        zoom={zoom}
                                        center={center}
                                        onClick={handleClick}
                                    >
                                        {marker && <Marker position={marker} />}
                                    </Map>
                                </Wrapper>
                            </Box>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleToggleMap}>
                                Save and close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            ) : (
                <Typography>Please add a Google Maps API key in settings to use this component.</Typography>
            )
    );
};