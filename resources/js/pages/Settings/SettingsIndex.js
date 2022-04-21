import { useMutation, useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { Input } from "../../components/Form/Input";
import { Loading } from "../../components/Loading";
import { Page, PageContent } from "../../components/Page";
import { GET_SETTINGS, UPSERT_SETTINGS } from "../../queries";

const schema = yup.object({
    api: yup.object({
        googleMapsApiKey: yup.string(),
    })
});

export const SettingsIndex = () => {

    const methods = useForm({
        resolver: yupResolver(schema),
    });

    const getSettingsResult = useQuery(GET_SETTINGS, {
        variables: {
            id: 'general'
        }
    });

    const [upsertSettings, upsertSettingsResult] = useMutation(UPSERT_SETTINGS, {
        update: (cache, { data: { upsertSettings } }) => {
          const data = cache.readQuery({
            query: GET_SETTINGS,
            variables: {
              id: 'general'
            },
          });

          if (data !== null) {
            cache.writeQuery({
              query: GET_SETTINGS,
              data: {
                settings: upsertSettings
              },
              variables: {
                id: 'general'
              }
            });
          }
        },
      });

    const handleSave = (data) => {
        upsertSettings({
            variables: {
                id: 'general',
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
        if (getSettingsResult.loading === false && getSettingsResult.data && getSettingsResult.data.settings) {
            const data = JSON.parse(getSettingsResult.data.settings.value);

            methods.setValue('api.googleMaps', data.api.googleMaps);
        }
    }, [getSettingsResult.loading, getSettingsResult.data]);

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <FormProvider {...methods}>
            <Page heading="General settings" footer={<Footer />}>
                <PageContent>
                    <Input
                        label="Google Maps API key"
                        name="api.googleMaps"
                    />
                </PageContent>
            </Page>
        </FormProvider>
    );
};