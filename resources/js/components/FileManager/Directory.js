import { faArrowLeft, faEdit, faFolder, faTrash } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useDrag, useDrop } from 'react-dnd';

export default function Directory({
    file,
    navigate,
    handleDrop,
    isSelectMode,
    handleChangeName,
    handleDelete
}) {
    const [{ isOver, isTarget }, drop] = useDrop({
        accept: ['file', 'directory'],
        drop: handleDrop,
        canDrop: (item) => item.file.name != file.name,
        collect: (monitor) => ({
            isTarget: monitor.canDrop(),
            isOver: monitor.isOver(),
        }),
    });

    const [{ opacity }, drag] = useDrag(() => ({
        type: 'directory',
        item: {
            type: 'directory',
            file
        },
        canDrag: () => !isSelectMode,
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.4 : 1.0,
        }),
    }), [file]);

    const isParentDirectory = file.extension == '..';

    return (
        <Paper
            ref={(node) => drag(drop(node))}
            style={{ opacity }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '13rem',
                p: 2,
                transition: 'border-color 0.3s',
                border: 1,
                borderColor: isTarget ? 'primary.main' : 'transparent',
            }}
        >
            <Box
                onClick={() => navigate(file.path)}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100%',
                    mb: 1,
                    opacity: isOver ? 0.8 : 1,
                    cursor: 'pointer',
                }}
            >
                <Box>
                    {isParentDirectory
                        ? <FontAwesomeIcon icon={faArrowLeft} size="3x" fixedWidth />
                        : <FontAwesomeIcon icon={faFolder} size="3x" fixedWidth />
                    }
                </Box>

                <Typography>
                    {file.name}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {!isParentDirectory && <>
                    <IconButton size="small" onClick={() => handleChangeName(file)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </IconButton>

                    <IconButton size="small" onClick={() => handleDelete(file)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                </>
                }
            </Box>
        </Paper>
    );
};