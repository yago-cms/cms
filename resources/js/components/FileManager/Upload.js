import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

const UploadFileList = ({ files }) => {
    const list = (files) => {
        const label = (file) => `${file.name}`;
        return <List>
            {files.map((file) => <ListItem key={file.name}>{label(file)}</ListItem>)}
        </List>;
    };

    if (files.length === 0) {
        return null;
    }

    const fileList = useMemo(() => list(files), [files]);
    return <ListItemText>{fileList}</ListItemText>;
};

const Upload = ({ files, setFiles }) => {
    const fileInput = useRef(null);

    const handleFileDrop = useCallback((item) => {
        if (item) {
            setFiles(item.files);
        }
    }, [files]);

    const handleFileChange = useCallback((event) => {
        setFiles(Array.from(event.target.files));
    }, [files]);

    const handleFileClick = useCallback(() => {
        fileInput.current.click();
    }, [files]);

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: [NativeTypes.FILE],
        drop(item) {
            if (handleFileDrop) {
                handleFileDrop(item);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [handleFileDrop]);

    const isActive = canDrop && isOver;

    return (
        <Box
            ref={drop}
            onClick={handleFileClick}
            sx={{
                cursor: 'pointer',
                minWidth: '300px'
            }}
        >
            <input style={{ display: 'none' }} type="file" ref={fileInput} multiple onChange={handleFileChange} />

            <Typography>
                {isActive ? 'Release to drop' : 'Drag files here or click to upload'}
            </Typography>

            <UploadFileList files={files} />
        </Box>
    );
};

export const UploadDrawer = ({ path, getFilesResult, uploadFiles, isUploadActive, setIsUploadActive }) => {
    const [files, setFiles] = useState([]);

    const handleUpload = () => {
        uploadFiles({
            variables: {
                files,
                path,
            }
        }).then(() => {
            setIsUploadActive(false);

            getFilesResult.refetch({
                path,
            }
            );

            setFiles([]);
        });
    };

    const hasFiles = files.length > 0;

    return (
        <Dialog
            open={isUploadActive}
            onClose={() => setIsUploadActive(false)}
        >
            <DialogTitle>Upload files</DialogTitle>

            <DialogContent>
                <Upload files={files} setFiles={setFiles} />
            </DialogContent>

            <DialogActions>
                <Button
                    color="secondary"
                    disabled={!hasFiles}
                    onClick={handleUpload}
                >
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
};