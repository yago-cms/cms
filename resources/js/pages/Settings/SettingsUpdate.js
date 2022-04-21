import { useMutation, useQuery } from "@apollo/client";
import { Alert, Box, Button, Card, CardContent, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { Page, PageContent } from "../../components/Page";
import { GET_CURRENT_VERSION, GET_LATEST_VERSION, UPDATE_TO_LATEST_VERSION } from "../../queries";

export const SettingsUpdate = () => {
    const getCurrentVersionResult = useQuery(GET_CURRENT_VERSION);
    const getLatestVersionResult = useQuery(GET_LATEST_VERSION);
    const [updateToLatestVersion, updateToLatestVersionResult] = useMutation(UPDATE_TO_LATEST_VERSION);

    const isLoading = getCurrentVersionResult.loading || getLatestVersionResult.loading;
    const error = getCurrentVersionResult.error || getLatestVersionResult.error;

    const handleUpdate = () => {
        updateToLatestVersion()
            .then((response) => {
                const { message } = response.data.updateToLatestVersion;
                console.log(message);
                getCurrentVersionResult.refetch();
            });
    };

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    const currentVersion = 'v' + getCurrentVersionResult.data.currentVersion.version;
    const latestVersion = getLatestVersionResult.data.latestVersion.version;


    return (
        <Page heading="Update">
            <PageContent>
                <Box sx={{ mb: 4 }}>
                    <Typography><strong>Note:</strong> The update action is not meant to be run on a production environment. It will probably break everything. The proper procedure for updating is to do it locally and then deploy the changes via git.</Typography>
                </Box>

                {updateToLatestVersionResult.data &&
                    <Alert severity="success">
                        Update completed successfully.
                    </Alert>
                }

                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6">Current version</Typography>
                        <Typography>The currently installed version is {currentVersion}</Typography>
                    </CardContent>
                </Card>

                {currentVersion !== latestVersion
                    ? <Card>
                        <CardContent>
                            <Typography variant="h6">New release</Typography>
                            <Typography>There is a new release available.</Typography>

                            {updateToLatestVersionResult.error &&
                                <Alert severity="error">Could not update. Check the devleoper console for error details.</Alert>
                            }

                            <LoadingButton
                                onClick={handleUpdate}
                                loading={updateToLatestVersionResult.loading}
                                loadingIndicator="Updating..."
                            >
                                Update to {latestVersion}
                            </LoadingButton>
                        </CardContent>
                    </Card>
                    : <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography variant="h6">Latest version</Typography>
                            <Typography>You have the latest version of {latestVersion} installed.</Typography>
                        </CardContent>
                    </Card>
                }
            </PageContent>
        </Page >
    );
};