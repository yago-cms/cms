import { Grid, Paper, Typography } from "@mui/material";
import { blueGrey, grey } from "@mui/material/colors";

export const PageCard = ({ heading, footer, children }) => {
    return (
        <Paper
            elevation={1}
            sx={{
                mb: 2,
                p: 2,
                backgroundColor: (theme) => theme.palette.mode == 'dark' ? '#0b0a05' : '#f4f5fa',
            }}
        >
            {heading && <Typography sx={{fontWeight: '700', mb: 2}}>{heading}</Typography>}

            <Grid container spacing={4}>
                <Grid item xs={footer ? 10 : 12}>
                    {children}
                </Grid>

                {footer && <Grid item xs={2}>
                    {footer}
                </Grid>}
            </Grid>
        </Paper>
    );
};