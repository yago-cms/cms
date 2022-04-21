import { faEdit, faEye, faFile, faFileAlt, faFileCsv, faFileExcel, faFilePdf, faFilePowerpoint, faFileWord, faTrash } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useDrag } from 'react-dnd';
import { TYPE_FILE } from '.';

const getExtensionIcon = (extension) => {
    switch (extension) {
        case 'pdf':
            return faFilePdf;
        case 'pot':
        case 'potm':
        case 'potx':
        case 'ppa':
        case 'ppam':
        case 'pps':
        case 'ppsm':
        case 'ppsx':
        case 'ppt':
        case 'pptm':
        case 'pptx':
        case 'odp':
            return faFilePowerpoint;
        case 'doc':
        case 'docm':
        case 'docx':
        case 'dot':
        case 'dotm':
        case 'dotx':
        case 'odt':
        case 'rtf':
            return faFileWord;
        case 'csv':
            return faFileCsv;
        case 'xla':
        case 'xlam':
        case 'xls':
        case 'xlsb':
        case 'xlsm':
        case 'xlsx':
        case 'xlt':
        case 'xltm':
        case 'xltx':
        case 'xlw':
            return faFileExcel;
        case 'txt':
            return faFileAlt;
        default:
            return faFile;
    }
};

const fileIsImage = (extension) => {
    switch (extension) {
        case 'svg':
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return true;
        default:
            return false;
    }
};

export const PreviewFile = ({ file }) => {
    if (!file) return null;

    return (
        <Box sx={{
            textAlign: 'center'
        }}>
            <img style={{ width: '100%' }} src={`/storage/upload/${file.path}`} />
        </Box>
    )
};

export const File = ({
    file,
    isSelectMode,
    handleSelectFile,
    handleChangeName,
    handleDelete,
    handlePreview,
}) => {
    const src = `/storage/upload/${file.path}`;

    const [{ opacity }, drag] = useDrag(() => ({
        type: 'file',
        item: {
            type: 'file',
            file
        },
        canDrag: () => !isSelectMode,
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.4 : 1.0,
        }),
    }), [file]);

    return (
        <Paper
            style={{ opacity }}
            onClick={() => handleSelectFile(file)}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '8rem',
                p: 2,
            }}
        >
            <Box
                ref={drag}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100%',
                    mb: 1,
                    cursor: 'pointer',
                }}
            >
                {file.type == TYPE_FILE
                    ? (
                        <Box>
                            <FontAwesomeIcon icon={getExtensionIcon(file.extension)} size="3x" fixedWidth />
                        </Box>
                    )
                    : (
                        <Box>
                            <img src={src} style={{ width: '100%' }} />
                        </Box>
                    )
                }

                <Typography>
                    {file.name}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {fileIsImage && (
                    <IconButton size="small" onClick={() => handlePreview(file)}>
                        <FontAwesomeIcon icon={faEye} />
                    </IconButton>
                )}

                <IconButton size="small" onClick={() => handleChangeName(file)}>
                    <FontAwesomeIcon icon={faEdit} />
                </IconButton>

                <IconButton size="small" onClick={() => handleDelete(file)}>
                    <FontAwesomeIcon icon={faTrash} />
                </IconButton>
            </Box>
        </Paper>
    );
}