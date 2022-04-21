import * as React from 'react';
import { Box, Alert } from "@mui/material";

export const Error = ({ message }) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Alert severity="error">
                {message}
            </Alert>
        </Box>
    );
}