import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Chip, Divider, FormGroup, Grid, styled, Typography } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { Error } from "../../components/Error";
import { Checkbox } from "../../components/Form/Checkbox";
import { Input } from "../../components/Form/Input";
import { Select } from "../../components/Form/Select";
import { SelectBreakpoint } from "../../components/Form/SelectBreakpoint";
import { usePrompt } from "../../tmp-prompt";
import { Breakpoints } from "./Breakpoints";
import { CardFields } from "./CardFields";
import { Slides } from "./Slides";
import { contentTypeModules } from "../../module";

const schema = yup.object({
    options: yup.object().shape({
        pagination: yup.boolean(),
        navigation: yup.boolean(),
        scrollbar: yup.boolean(),
        loop: yup.boolean(),
        autoplay: yup.object().shape({
            autoplay: yup.boolean(),
            disableOnInteraction: yup.boolean(),
            pauseOnMouseEnter: yup.boolean(),
            stopOnLastSlide: yup.boolean(),
            delay: yup.number(),
        }),
        direction: yup.string().required(),
        tabs: yup.boolean(),
        tabType: yup.string(),
        breakpoints: yup.boolean(),
    }),

    tabs: yup.array().of(
        yup.object(),
    ),

    type: yup.string().required(),
    cardTemplate: yup.number(),
    cards: yup.array().of(
        yup.object(),
    ),

    captions: yup.boolean(),
    breakpoint: yup.string().when('type', {
        is: 'fixed',
        then: (schema) => schema.required(),
    }),
    slides: yup.array().of(
        yup.object().shape({
            media: yup.string().required(),
            alt: yup.string(),
            caption: yup.string(),
            subCaption: yup.string(),
        }),
    ),

    breakpoints: yup.array().of(
        yup.object().shape({
            targetWidth: yup.number().min(0).required(),
            slidesPerView: yup.number().min(0),
            slidesPerGroup: yup.number().min(0),
            spaceBetween: yup.number().min(0),
        }),
    ),
});

export const CarouselPreview = ({ content }) => {
    if (!content.slides) {
        return null;
    }

    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap'
        }}>
            {content.slides.map((slide, key) => <Box sx={{ width: '25%', p: 1 }} key={key}>
                {slide.alt}
                <img style={{ width: '100%' }} src={`/storage/upload/${slide.media}`} />
            </Box>)}
        </Box>
    );
};

export const CarouselBlockEditor = forwardRef(({ content, save }, ref) => {
    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            options: {
                autoplay: {
                    disableOnInteraction: true,
                    delay: '5000'
                }
            }
        }
    });

    const watchAutoplay = methods.watch('options.autoplay.autoplay');
    const watchType = methods.watch('type');
    const watchTabs = methods.watch('options.tabs');
    const watchTabType = methods.watch('options.tabType');
    const watchBreakpoints = methods.watch('options.breakpoints');

    const handleSave = (data) => {
        save(JSON.stringify(data));
    };

    const handleError = () => {
        throw new Error();
    };

    useImperativeHandle(ref, () => ({
        save() {
            return methods.handleSubmit(handleSave, handleError)();
        }
    }));

    usePrompt('Are you sure you want to leave this page? You will lose any unsaved data.', methods.isDirty);

    useEffect(() => {
        if (!content) {
            return;
        }

        let json = {};

        try {
            json = JSON.parse(content);
        } catch {
            console.log('Invalid JSON');
            return;
        }

        for (const field in json) {
            if (field in schema.fields) {
                methods.setValue(field, json[field]);
            }
        }
    }, []);

    const Root = styled('div')(({ theme }) => ({
        '& .MuiDivider-root': {
            marginBottom: theme.spacing(2),
        }
    }));

    return <FormProvider {...methods}>
        <Root>
            <Box>
                <Divider textAlign="left">
                    <Chip label="Options" />
                </Divider>

                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <Select
                            label="Type"
                            name="type"
                            options={[
                                {
                                    value: '',
                                    label: 'Choose type...',
                                },
                                {
                                    value: 'card',
                                    label: 'Card',
                                },
                                {
                                    value: 'fixed',
                                    label: 'Fixed fields',
                                },
                                {
                                    value: 'module',
                                    label: 'Module',
                                },
                            ]}
                        />

                        <Select
                            label="Direction"
                            name="options.direction"
                            options={[
                                {
                                    value: 'horizontal',
                                    label: 'Horizontal',
                                },
                                {
                                    value: 'vertical',
                                    label: 'Vertical',
                                },
                            ]}
                        />

                        <FormGroup>
                            <Checkbox
                                label="Show pagination"
                                name="options.pagination"
                            />

                            <Checkbox
                                label="Show navigation"
                                name="options.navigation"
                            />

                            <Checkbox
                                label="Show scrollbar"
                                name="options.scrollbar"
                            />

                            <Checkbox
                                label="Loop"
                                name="options.loop"
                            />
                        </FormGroup>
                    </Grid>

                    <Grid item xs={6}>
                        <FormGroup>
                            <Checkbox
                                label="Autoplay"
                                name="options.autoplay.autoplay"
                            />
                        </FormGroup>

                        {watchAutoplay === true && <>
                            <FormGroup>
                                <Checkbox
                                    label="Disable on interaction"
                                    name="options.autoplay.disableOnInteraction"
                                />

                                <Checkbox
                                    label="Pause on mouse enter"
                                    name="options.autoplay.pauseOnMouseEnter"
                                />

                                <Checkbox
                                    label="Stop on last slide"
                                    name="options.autoplay.stopOnLastSlide"
                                />
                            </FormGroup>

                            <Input
                                label="Delay"
                                name="options.autoplay.delay"
                                type="number"
                            />
                        </>}
                    </Grid>
                </Grid>
            </Box>

            <Box>
                <Divider textAlign="left">
                    <Chip label="Tabs" />
                </Divider>

                <FormGroup sx={{ mb: 2 }}>
                    <Checkbox
                        label="Use tabs"
                        name="options.tabs"
                    />
                </FormGroup>

                {watchTabs === true && <>
                    <Select
                        label="Tab type"
                        name="options.tabType"
                        options={[
                            {
                                value: 'text',
                                label: 'Text',
                            },
                            {
                                value: 'media',
                                label: 'Media',
                            }
                        ]}
                    />

                    {watchTabType == 'media' &&
                        <SelectBreakpoint
                            name="breakpoint"
                            label="Media breakpoint"
                        />
                    }
                </>}
            </Box>

            <Box>
                <Divider textAlign="left">
                    <Chip label="Breakpoints" />
                </Divider>

                <FormGroup sx={{ mb: 2 }}>
                    <Checkbox
                        label="Use breakpoints"
                        name="options.breakpoints"
                    />
                </FormGroup>

                {watchBreakpoints === true && <Breakpoints />}
            </Box>

            {watchType == 'module' && (
                <Box>
                    <Divider textAlign="left">
                        <Chip label="Module" />
                    </Divider>

                    {contentTypeModules.length > 0
                        ? (
                            <Select
                                label="Module"
                                name="module"
                                options={
                                    contentTypeModules.map(contentTypeModule => ({
                                        value: contentTypeModule.id,
                                        label: contentTypeModule.name,
                                    }))
                                }
                            />
                        )
                        :
                        (
                            <Typography>No modules available.</Typography>
                        )
                    }
                </Box>
            )}

            {watchType == 'card' && <>
                <CardFields
                    isTabsEnabled={watchTabs}
                    tabType={watchTabType}
                />
            </>}

            {watchType == 'fixed' && (
                <Box>
                    <Divider textAlign="left">
                        <Chip label="Slides" />
                    </Divider>

                    <Checkbox
                        label="Use captions"
                        name="captions"
                    />

                    <SelectBreakpoint
                        label="Media breakpoint"
                        name="breakpoint"
                    />

                    <Slides />
                </Box>
            )}
        </Root>
    </FormProvider>
});