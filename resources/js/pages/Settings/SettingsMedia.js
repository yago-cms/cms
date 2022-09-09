import { useMutation, useQuery } from "@apollo/client";
import { faCaretDown, faCaretUp, faTimes } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, ButtonGroup, Grid, IconButton } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
import * as yup from "yup";
import { Input } from "../../components/Form/Input";
import { Select } from "../../components/Form/Select";
import { Loading } from "../../components/Loading";
import { Page, PageContent } from "../../components/Page";
import { PageCard } from "../../components/PageCard";
import { GET_SETTINGS, UPSERT_SETTINGS } from "../../queries";

const MediaBreakpoints = ({ index: parentIndex }) => {
    const { fields, append, remove, swap } = useFieldArray({
        name: `breakpointGroups.${parentIndex}.breakpoints`,
        keyName: 'key',
    });

    return (
        <>
            {fields.map((field, index) => {
                const isFirst = index == 0;
                const isLast = index == fields.length - 1;

                return (
                    <Grid container key={field.key} spacing={2}>
                        <Grid item xs={2}>
                            <Input
                                label="Min width"
                                name={`breakpointGroups.${parentIndex}.breakpoints.${index}.minWidth`}
                                disabled={isFirst}
                            />
                        </Grid>

                        <Grid item xs={2}>
                            <Input
                                label="Target width"
                                name={`breakpointGroups.${parentIndex}.breakpoints.${index}.targetWidth`}
                            />
                        </Grid>

                        <Grid item xs={2}>
                            <Input
                                label="Target height"
                                name={`breakpointGroups.${parentIndex}.breakpoints.${index}.targetHeight`}
                            />
                        </Grid>

                        <Grid item xs={2}>
                            <Input
                                label="Fit"
                                name={`breakpointGroups.${parentIndex}.breakpoints.${index}.fit`}
                            />
                        </Grid>

                        <Grid item xs={2}>
                            <ButtonGroup>
                                {!isFirst && <IconButton
                                    size="small"
                                    onClick={() => remove(index)}
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </IconButton>}

                                {(!isFirst && index != 1) &&
                                    <IconButton
                                        size="small"
                                        onClick={() => swap(index, index - 1)}
                                    >
                                        <FontAwesomeIcon icon={faCaretUp} />
                                    </IconButton>
                                }
                                {(!isFirst && !isLast) &&
                                    <IconButton
                                        size="small"
                                        onClick={() => swap(index, index + 1)}
                                    >
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    </IconButton>
                                }
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                );
            })}

            <Button
                onClick={() => append({
                    fit: 'crop',
                })}
            >
                Add breakpoint
            </Button>
        </>
    );
};

const MediaBreakpointGroups = () => {
    const { setValue } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        name: `breakpointGroups`,
    });

    return (
        <PageContent heading="Breakpoints">
            <Box>
                <p>
                    Here you can specify media breakpoints for <code>&lt;picture&gt;</code> tags.<br />
                    The breakpoint groups you add here will be available to select for any media type you use.
                </p>

                <p>
                    You will need one breakpoint with <code>min width</code> set to <code>0</code>, of which the <code>target width</code> will be used for the base <code>&lt;img&gt;</code> tag.<br />
                </p>
            </Box>

            {fields.map((field, index) => {
                const isFirst = index == 0;

                return (
                    <PageCard
                        key={field.id}
                        footer={
                            !isFirst && (
                                <IconButton
                                    size="small"
                                    onClick={() => remove(index)}
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </IconButton>
                            )
                        }>
                        <Input
                            label="Name"
                            name={`breakpointGroups.${index}.name`}
                            onChange={(e) => setValue(`breakpointGroups.${index}.key`, _.kebabCase(e.target.value))}
                        />

                        <Input
                            label="Key"
                            disabled
                            name={`breakpointGroups.${index}.key`}
                        />

                        <MediaBreakpoints index={index} />
                    </PageCard>
                );
            })}

            <Button
                onClick={() => append({
                    breakpoints: [{
                        minWidth: 0
                    }]
                })}
            >
                Add breakpoint group
            </Button>
        </PageContent>
    );
};

export const SettingsMedia = () => {
    const schema = yup.object({
        cdn: yup.object().shape({
            type: yup.string().required(),
            source: yup.string().when('type', {
                is: 'imgix',
                then: (schema) => schema.required(),
            }),
        }),
        breakpointGroups: yup.array().of(
            yup.object().shape({
                name: yup.string().required(),
                key: yup.string().required(),
                breakpoints: yup.array().of(
                    yup.object().shape({
                        minWidth: yup.number().min(0).integer().required(),
                        targetWidth: yup.number().positive().integer().required(),
                        targetHeight: yup.number().positive().integer().required(),
                        fit: yup.string().required(),
                    }),
                ),
            }),
        ),
    });

    const methods = useForm({
        resolver: yupResolver(schema),
    });

    const watchCdnType = methods.watch('cdn.type',);


    const getSettingsResult = useQuery(GET_SETTINGS, {
        variables: {
            id: 'media'
        }
    });

    const [upsertSettings, upsertSettingsResult] = useMutation(UPSERT_SETTINGS);

    const handleSave = (data) => {
        upsertSettings({
            variables: {
                id: 'media',
                value: JSON.stringify(data),
            }
        });
    };

    const Footer = () => (
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button color="secondary" onClick={methods.handleSubmit(handleSave)}>Save</Button>
        </Box>
    );

    const isLoading = getSettingsResult.loading || upsertSettingsResult.loading;
    const error = getSettingsResult.error || upsertSettingsResult.error;

    useEffect(() => {
        if (getSettingsResult.loading === false && getSettingsResult.data) {
            const data = JSON.parse(getSettingsResult.data.settings.value);

            methods.setValue('cdn', data.cdn);
            methods.setValue('breakpointGroups', data.breakpointGroups);
        }
    }, [getSettingsResult.loading, getSettingsResult.data]);

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <FormProvider {...methods}>
            <Page heading="Media settings" footer={<Footer />}>
                <PageContent heading="CDN">
                    <Select
                        label="CDN"
                        options={[
                            {
                                value: 'default',
                                'label': 'No CDN (use built-in image cache)',
                            },
                            {
                                value: 'imgix',
                                'label': 'imgix',
                            }
                        ]}
                        name="cdn.type"
                    />

                    {watchCdnType == 'imgix' && <>
                        <Input
                            label="imgix source"
                            name="cdn.source"
                        />
                    </>}
                </PageContent>

                <MediaBreakpointGroups />
            </Page>
        </FormProvider>
    );
};