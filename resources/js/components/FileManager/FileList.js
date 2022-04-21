import { Box } from "@mui/material";
import { useCallback } from "react";
import { TYPE_DIRECTORY } from ".";
import Directory from "./Directory";
import { File } from "./File";

export const FileList = ({
    files,
    path,
    navigate,
    moveFile,
    isSelectMode,
    handleSelectFile,
    handleChangeName,
    handleDelete,
    handlePreview,
    setErrorMessage,
}) => {
    const handleDrop = useCallback((source, destination) => {
        moveFile({
            variables: {
                input: {
                    path,
                    source: source.file.path,
                    destination: destination.path,
                }
            }
        })
            .catch(() => {
                setErrorMessage('Could not move file. File probably already exists at target.');
            });
    }, []);

    const isRoot = path == '/';
    const parentPath = path.substring(0, path.lastIndexOf('/') + 1).substring(1);
    const parentDirectory = {
        name: 'Go back',
        type: 'DIRECTORY',
        path: parentPath,
        extension: '..',
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
            }}
        >
            {!isRoot && <Directory
                file={parentDirectory}
                navigate={navigate}
                handleDrop={(source) => handleDrop(source, parentDirectory)}
                key={0} />}
            {files.map((file, i) =>
                file.type == TYPE_DIRECTORY
                    ? <Directory
                        file={file}
                        navigate={navigate}
                        handleDrop={(source) => handleDrop(source, file)}
                        isSelectMode={isSelectMode}
                        handleChangeName={handleChangeName}
                        handleDelete={handleDelete}
                        key={i + 1}
                    />
                    : <File
                        file={file}
                        isSelectMode={isSelectMode}
                        handleSelectFile={handleSelectFile}
                        handleChangeName={handleChangeName}
                        handleDelete={handleDelete}
                        handlePreview={handlePreview}
                        key={i + 1}
                    />
            )}
        </Box>
    );
};