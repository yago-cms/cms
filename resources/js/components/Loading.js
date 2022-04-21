import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import PropTypes from "prop-types";

export const Loading = ({ isInline, size }) => {
    return (
        <>
            {!isInline
                ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                )
                : (
                    <CircularProgress />
                )
            }
        </>
    );
};

Loading.propTypes = {
    isInline: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'default']),
};

Loading.defaultProps = {
    isInline: false,
    size: 'default',
};