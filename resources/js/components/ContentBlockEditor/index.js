import { faTimes } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Divider, Drawer, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { contentTypeGroups } from "../../module";
import ContentBlock from "./ContentBlock";
import ContentTypeList from "./ContentTypeList";

const getContentTypes = (contentTypeGroups) =>
    contentTypeGroups.map(contentTypeGroup => contentTypeGroup.types).flat();

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const [sourceSectionIndex, sourceColumnIndex] = droppableSource.droppableId.split('-');
    const [destinationSectionIndex, destinationColumnIndex] = droppableDestination.droppableId.split('-');

    const result = {};
    _.set(result, `[${sourceSectionIndex}][${sourceColumnIndex}]`, sourceClone);
    _.set(result, `[${destinationSectionIndex}][${destinationColumnIndex}]`, destClone);

    return result;
};

const insert = (list, index, block) => {
    const result = Array.from(list);

    result.splice(index, 0, block);

    return result;
};

export const ContentBlockEditor = ({ sections, isDrawerOpen, setIsDrawerOpen, handleChange }) => {

    const handleDragEnd = ({ draggableId, source, destination }) => {
        if (!destination) {
            return;
        }

        const sourceIndex = source.droppableId;
        const destinationIndex = destination.droppableId;

        const [sourceSectionIndex, sourceColumnIndex] = sourceIndex.split('-');
        const [destinationSectionIndex, destinationColumnIndex] = destinationIndex.split('-');

        if (source.droppableId == 'new') {
            // add new block
            let block = null;

            getContentTypes(contentTypeGroups).some(contentType => {
                if (contentType.id == draggableId) {
                    block = {
                        id: `block-${new Date().getTime()}`,
                        isNew: true,
                        type: contentType.id,
                        pageTemplateSectionId: sections[destinationSectionIndex].id,
                        pageTemplateSectionColumnId: sections[destinationSectionIndex].columns[destinationColumnIndex].id,
                    };

                    return true;
                }
            });

            if (!block) {
                return;
            }

            const blocks = insert(sections[destinationSectionIndex].columns[destinationColumnIndex].blocks, destination.index, block);
            const newSections = [...sections];

            newSections[destinationSectionIndex].columns[destinationColumnIndex].blocks = blocks;
            handleChange(newSections);
        } else if (sourceIndex == destinationIndex) {
            // move within the same column
            const blocks = reorder(sections[sourceSectionIndex].columns[sourceColumnIndex].blocks, source.index, destination.index);
            const newSections = [...sections];

            newSections[sourceSectionIndex].columns[sourceColumnIndex].blocks = blocks;
            handleChange(newSections);
        } else {
            // move to another column
            const result = move(
                sections[sourceSectionIndex].columns[sourceColumnIndex].blocks,
                sections[destinationSectionIndex].columns[destinationColumnIndex].blocks,
                source,
                destination
            );

            const newSections = [...sections];

            newSections[sourceSectionIndex].columns[sourceColumnIndex].blocks = result[sourceSectionIndex][sourceColumnIndex];
            newSections[destinationSectionIndex].columns[destinationColumnIndex].blocks = result[destinationSectionIndex][destinationColumnIndex];

            newSections[destinationSectionIndex].columns[destinationColumnIndex].blocks[destination.index].pageTemplateSectionId = newSections[destinationSectionIndex].id;
            newSections[destinationSectionIndex].columns[destinationColumnIndex].blocks[destination.index].pageTemplateSectionColumnId = newSections[destinationSectionIndex].columns[destinationColumnIndex].id;
            handleChange(newSections);
        }
    }

    const handleRemove = (blockIndex, sectionIndex, columnIndex) => {
        const blocks = sections[sectionIndex].columns[columnIndex].blocks;
        blocks.splice(blockIndex, 1);

        const newSections = [...sections];

        newSections[sectionIndex].columns[columnIndex].blocks = blocks;
        handleChange(newSections);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                variant="persistent"
                sx={{
                    width: '30vw',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '30vw',
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">Add content</Typography>

                    <IconButton size="small" onClick={() => setIsDrawerOpen(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </IconButton>
                </Box>

                <Divider />

                <Box sx={{ p: 2 }}>
                    <p>Drag the content type you want and drop it where you want.</p>

                    <Droppable
                        key={0}
                        droppableId={`new`}
                        isDropDisabled={true}
                    >
                        {(provided) =>
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <ContentTypeList typeGroups={contentTypeGroups} />

                                {provided.placeholder}
                            </div>
                        }
                    </Droppable>
                </Box>
            </Drawer>

            <Stack>
                {sections.map((section, sectionIndex) =>
                    <Box
                        key={sectionIndex}
                        sx={{ mb: 2 }}
                    >
                        <Typography variant="h6">{section.name}</Typography>

                        <Paper
                            elevation={1}
                            sx={{
                                backgroundColor: (theme) => theme.palette.mode == 'dark' ? '#0b0a05' : '#f4f5fa',
                                p: 2,
                                pb: 0,
                            }}
                        >
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    '& .MuiGrid-item': {
                                        position: 'relative',

                                        '&:not(:first-of-type)::before': {
                                            content: '""',
                                            borderLeft: 1,
                                            borderLeftColor: (theme) => theme.palette.mode == 'dark' ? '#050505' : '#d4d4d4',
                                            position: 'absolute',
                                            top: 0,
                                            left: 8,
                                            bottom: 0,
                                        }
                                    }
                                }}
                            >
                                {section.columns.map((column, columnIndex) =>
                                    <Droppable
                                        key={`${sectionIndex}-${columnIndex}`}
                                        droppableId={`${sectionIndex}-${columnIndex}`}
                                    >
                                        {(provided) =>
                                            <Grid item xs={parseInt(12 / section.columns.length)}
                                            >
                                                <Box
                                                    style={{ height: '100%', minHeight: '2rem' }}
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}

                                                >
                                                    {column.blocks.map((block, blockIndex) =>
                                                        <Draggable
                                                            key={block.id}
                                                            draggableId={block.id}
                                                            index={blockIndex}
                                                        >
                                                            {(provided) =>
                                                                <ContentBlock
                                                                    block={block}
                                                                    blockIndex={blockIndex}
                                                                    sectionIndex={sectionIndex}
                                                                    columnIndex={columnIndex}
                                                                    provided={provided}
                                                                    handleRemove={handleRemove}
                                                                    handleUpdate={() => { handleChange(sections) }}
                                                                />
                                                            }
                                                        </Draggable>
                                                    )}

                                                    {provided.placeholder}
                                                </Box>
                                            </Grid>
                                        }
                                    </Droppable>
                                )}
                            </Grid>
                        </Paper>
                    </Box>
                )}
            </Stack>
        </DragDropContext>
    )
};