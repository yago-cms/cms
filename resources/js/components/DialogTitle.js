import { faClose } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DialogTitle as MuiDialogTitle, IconButton } from "@mui/material";

export const DialogTitle = ({ children, onClose, ...props }) => {
    return (
        <MuiDialogTitle sx={{ m: 0, p: 2 }} {...props}>
            {children}
            {onClose
                ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <FontAwesomeIcon icon={faClose} />
                    </IconButton>
                )
                : null}
        </MuiDialogTitle>
    );
};