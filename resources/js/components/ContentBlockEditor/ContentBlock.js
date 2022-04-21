import { faEdit, faSlidersVSquare, faTrash } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, IconButton, ToggleButton } from "@mui/material";
import { Editor } from '@tinymce/tinymce-react';
import { Children, cloneElement, isValidElement, useMemo, useRef, useState } from "react";
import sanitizeHtml from 'sanitize-html';
import { contentTypeGroups } from "../../module";
import { defaultConfig } from "../Form/Wysiwyg";

export const truncateOptions = {
    length: 40
};

export const truncate = (string) => _.truncate(string, truncateOptions);

const getBlockContentType = type => {
    let blockType = null;

    contentTypeGroups.some(contentTypeGroup => {
        return contentTypeGroup.types.some(contentType => {
            if (type == contentType.id) {
                blockType = contentType;

                return true;
            }
        });
    });

    return blockType;
};

const Preview = ({ content, hideDetails, children }) => {
    const [showDetails, setShowDetails] = useState(false);

    const childrenWithProps = Children.map(children, child => {
        if (isValidElement(child)) {
            return cloneElement(child, { content, showDetails });
        }
        return child;
    });

    return <Box sx={{ overflow: 'hidden' }}>
        {!hideDetails &&
            <Box sx={{ float: 'right' }}>
                <ToggleButton
                    value="details"
                    selected={showDetails}
                    onClick={() => setShowDetails(!showDetails)}
                >
                    <FontAwesomeIcon icon={faSlidersVSquare} />
                </ToggleButton>
            </Box>
        }

        {childrenWithProps}
    </Box>
};

export default function ContentBlock({
    block,
    blockIndex,
    sectionIndex,
    columnIndex,
    provided,
    handleRemove,
    handleUpdate,
}) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [value, setValue] = useState('');

    // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const prefersDarkMode = false;

    const editorRef = useRef(null);
    const childRef = useRef();
    let blockType = getBlockContentType(block.type);
    let { icon,
        blockEditor,
        blockPreview,
        blockTitle,
        isPreviewDetailsHidden,
        isPreviewDetailsToggleHidden,
        isEditingDisabled,
    } = blockType;

    const isBlockEditor = !!blockEditor;
    const isBlockPreview = !!blockPreview;
    const isBlockTitle = !!blockTitle;

    const content = sanitizeHtml(block.content);

    const save = (otherValue = null) => {
        block.content = otherValue ? otherValue : value;

        handleUpdate();
    };

    const handleChange = (value) => {
        setValue(value);
    };

    const handleEdit = () => {
        setIsDrawerOpen(true);
    };

    const handleSave = () => {
        if (isBlockEditor) {
            childRef.current.save()
                .catch(() => { });
        } else {
            save();
        }
    };

    const handleSaveClose = () => {
        if (isBlockEditor) {
            childRef.current.save()
                .then(() => {
                    setIsDrawerOpen(false);
                })
                .catch(() => { });
        } else {
            save();
            setIsDrawerOpen(false);
        }
    };

    const editor = useMemo(() => (
        <Editor
            init={{
                ...defaultConfig,
                skin: prefersDarkMode ? 'oxide-dark' : 'oxide',
                content_css: prefersDarkMode ? 'dark' : '',
            }}
            tinymceScriptSrc="/vendor/cms/js/tinymce/tinymce.min.js"
            initialValue={content}
            onInit={(evt, editor) => editorRef.current = editor}
            onEditorChange={handleChange}
        />
    ), [content, prefersDarkMode]);

    const withHooks = (BlockEditor) => {
        return () => <BlockEditor
            ref={childRef}
            content={block.content}
            save={save}
        />
    };

    const BlockEditor = withHooks(blockEditor);

    const ContentPreview = () => {
        if (isBlockPreview) {
            const withContents = (BlockPreview) => {
                const content = block.content ? JSON.parse(block.content) : {};

                return () => (
                    <Preview
                        hideDetails={isPreviewDetailsToggleHidden}
                        content={content}
                    >
                        <BlockPreview />
                    </Preview>
                );
            };

            const BlockPreview = withContents(blockPreview);

            return <BlockPreview />
        }

        return sanitizeHtml(block.content, {
            allowedTags: [],
            allowedAttributes: {},
        });
    };

    const ContentTitle = () => {
        if (isBlockTitle) {
            const withContents = (BlockTitle) => {
                const content = block.content ? JSON.parse(block.content) : {};

                return () => <BlockTitle
                    content={content}
                />
            };

            const BlockTitle = withContents(blockTitle);

            return <BlockTitle />
        }

        return blockType.name;
    };

    return (
        <>
            <Card
                ref={provided.innerRef}
                {...provided.draggableProps}
                sx={{ mb: 2 }}
            >
                <CardHeader
                    avatar={
                        <FontAwesomeIcon icon={icon} />
                    }
                    title={<ContentTitle />}
                    action={
                        <>
                            {!isEditingDisabled &&
                                <IconButton
                                    size="small"
                                    onClick={() => handleEdit()}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </IconButton>}

                            <IconButton
                                size="small"
                                onClick={() => handleRemove(blockIndex, sectionIndex, columnIndex)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </IconButton>
                        </>
                    }
                    {...provided.dragHandleProps}
                />

                {!isPreviewDetailsHidden && <CardContent>
                    <ContentPreview />
                </CardContent>}
            </Card>

            <Dialog
                fullScreen
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                disableEnforceFocus
            >
                <DialogContent>
                    {isBlockEditor
                        ? <BlockEditor />
                        : <Box sx={{ height: '80vh' }}>
                            {editor}
                        </Box>
                    }
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleSave}>
                        Save
                    </Button>

                    <Button onClick={handleSaveClose}>
                        Save and close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}