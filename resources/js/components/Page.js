import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Container, Divider, Fab, Grid, Paper, Typography } from "@mui/material";

export const PageContent = ({ heading, children }) => {
    return (
        <Paper sx={{ p: 2, mb: 4, mt: heading ? 0 : 4 }} elevation={6}>
            {heading && <Typography sx={{ fontWeight: 500, mb: 2 }}>{heading}</Typography>}
            {children}
        </Paper>
    );
};

export const Page = ({ heading, subHeading, actions, fab, footer, isDrawerOpen, children }) => {
    return (
        <>
            <Box sx={
                (theme) => ({
                    marginRight: '0vw',
                    ...(isDrawerOpen && {
                        // TODO: figure out how to make this work
                        transition: theme.transitions.create('marginRight', {
                            easing: theme.transitions.easing.easeOut,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        marginRight: '30vw',
                    })
                })
            }>
                <Container sx={{
                    paddingTop: 4
                }}>
                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5" component="h1" mb={1}>{heading}</Typography>
                        </Grid>
                    </Grid>

                    <Divider />

                </Container>

                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    {children}

                    {footer && <Paper sx={{ p: 2 }} elevation={6}>
                        {footer}
                    </Paper>}
                </Container>
            </Box>

            {fab && (Array.isArray(fab)
                ? (
                    <Box
                        sx={(theme) => ({
                            display: 'flex',
                            gap: 1,
                            position: 'absolute',
                            bottom: theme.spacing(4),
                            right: theme.spacing(4),
                        })}
                    >
                        {fab.map((fab, index) => (
                            <Fab
                                color="secondary"
                                size="medium"
                                onClick={fab.handleClick}
                                key={index}
                            >
                                <FontAwesomeIcon icon={fab.icon} />
                            </Fab>
                        ))}
                    </Box>
                )
                : (
                    <Fab
                        color="secondary"
                        size="medium"
                        onClick={fab.handleClick}
                        sx={(theme) => ({
                            position: 'absolute',
                            bottom: theme.spacing(4),
                            right: theme.spacing(4),
                        })}
                    >
                        <FontAwesomeIcon icon={fab.icon} />
                    </Fab>
                ))}
        </>
    );
}