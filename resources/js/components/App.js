import { useLazyQuery, useMutation } from "@apollo/client";
import { faAngleDown, faAngleUp } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppBar as MuiAppBar, Box, Button, CircularProgress, Collapse, CssBaseline, Divider, Drawer as MuiDrawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { deepPurple, purple } from "@mui/material/colors";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { modules } from "../module";
import { GET_ME, LOGOUT } from "../queries";
import { Login } from "./Login";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar)(
    ({ theme }) => ({
        backgroundColor: 'transparent',
        color: theme.palette.text.primary,
    })
);

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            backgroundColor: 'transparent',
            border: 'none',
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const LinkRef = forwardRef((props, ref) => <div ref={ref}>
    <NavLink {...props} />
</div>);

const MenuItem = ({ menu, isNested }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        menu.children
            ? (
                <>
                    <ListItemButton onClick={handleClick}>
                        {menu.icon && <ListItemIcon sx={{ minWidth: '2em' }}>
                            <FontAwesomeIcon icon={menu.icon} fixedWidth />
                        </ListItemIcon>}

                        <ListItemText primary={menu.name} />

                        {isOpen ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
                    </ListItemButton>

                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List sx={{ p: 0 }}>
                            {menu.children.map((menu, i) => <MenuItem menu={menu} isNested key={i} />)}
                        </List>
                    </Collapse>
                </>
            )
            : (
                <ListItemButton component={LinkRef} to={menu.route} sx={{ pl: isNested ? 6 : 2 }}>
                    {menu.icon && <ListItemIcon sx={{ minWidth: '2em' }}>
                        <FontAwesomeIcon icon={menu.icon} fixedWidth />
                    </ListItemIcon>}
                    <ListItemText primary={menu.name} />
                </ListItemButton>
            )
    );
};

export const App = () => {
    // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const prefersDarkMode = false;

    const [routes, setRoutes] = useState(require('../routes').default);
    const [menuGroups, setMenuGroups] = useState([require('../menus').default]);

    useEffect(() => {
        let newRoutes = [...routes];
        let newMenuGroups = [...menuGroups];

        modules.forEach((module) => {
            newRoutes = newRoutes.concat(module.routes);
            newMenuGroups.push(module.menus);
        })

        setRoutes(newRoutes);
        setMenuGroups(newMenuGroups);
    }, [modules]);

    const theme = useMemo(() =>
        createTheme({
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light',
                primary: {
                    main: deepPurple[500],
                },
                secondary: {
                    main: purple[500],
                },
                neutral: {
                    main: '#64748B',
                    contrastText: '#fff',
                },
            },
            typography: {
                fontFamily: [
                    'Public Sans',
                    'sans-serif'
                ].join(','),
                h4: {
                    fontWeight: 700,
                },
            },
            components: {
                MuiTextField: {
                    styleOverrides: {
                        root: ({ theme }) => ({
                            marginBottom: theme.spacing(2)
                        })
                    }
                },
                MuiFormControl: {
                    styleOverrides: {
                        root: ({ theme }) => ({
                            marginBottom: theme.spacing(2)
                        })
                    }
                },
            },
            shadows: [
                'none',
                '0px 2px 1px -1px rgba(0,0,0,0.1),0px 1px 1px 0px rgba(0,0,0,0.04),0px 1px 3px 0px rgba(0,0,0,0.09)',
                '0px 3px 1px -2px rgba(0,0,0,0.1),0px 2px 2px 0px rgba(0,0,0,0.04),0px 1px 5px 0px rgba(0,0,0,0.09)',
                '0px 3px 3px -2px rgba(0,0,0,0.1),0px 3px 4px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.09)',
                '0px 2px 4px -1px rgba(0,0,0,0.1),0px 4px 5px 0px rgba(0,0,0,0.04),0px 1px 10px 0px rgba(0,0,0,0.09)',
                '0px 3px 5px -1px rgba(0,0,0,0.1),0px 5px 8px 0px rgba(0,0,0,0.04),0px 1px 14px 0px rgba(0,0,0,0.09)',
                '0px 3px 5px -1px rgba(0,0,0,0.1),0px 6px 10px 0px rgba(0,0,0,0.04),0px 1px 18px 0px rgba(0,0,0,0.09)',
                '0px 4px 5px -2px rgba(0,0,0,0.1),0px 7px 10px 1px rgba(0,0,0,0.04),0px 2px 16px 1px rgba(0,0,0,0.09)',
                '0px 5px 5px -3px rgba(0,0,0,0.1),0px 8px 10px 1px rgba(0,0,0,0.04),0px 3px 14px 2px rgba(0,0,0,0.09)',
                '0px 5px 6px -3px rgba(0,0,0,0.1),0px 9px 12px 1px rgba(0,0,0,0.04),0px 3px 16px 2px rgba(0,0,0,0.09)',
                '0px 6px 6px -3px rgba(0,0,0,0.1),0px 10px 14px 1px rgba(0,0,0,0.04),0px 4px 18px 3px rgba(0,0,0,0.09)',
                '0px 6px 7px -4px rgba(0,0,0,0.1),0px 11px 15px 1px rgba(0,0,0,0.04),0px 4px 20px 3px rgba(0,0,0,0.09)',
                '0px 7px 8px -4px rgba(0,0,0,0.1),0px 12px 17px 2px rgba(0,0,0,0.04),0px 5px 22px 4px rgba(0,0,0,0.09)',
                '0px 7px 8px -4px rgba(0,0,0,0.1),0px 13px 19px 2px rgba(0,0,0,0.04),0px 5px 24px 4px rgba(0,0,0,0.09)',
                '0px 7px 9px -4px rgba(0,0,0,0.1),0px 14px 21px 2px rgba(0,0,0,0.04),0px 5px 26px 4px rgba(0,0,0,0.09)',
                '0px 8px 9px -5px rgba(0,0,0,0.1),0px 15px 22px 2px rgba(0,0,0,0.04),0px 6px 28px 5px rgba(0,0,0,0.09)',
                '0px 8px 10px -5px rgba(0,0,0,0.1),0px 16px 24px 2px rgba(0,0,0,0.04),0px 6px 30px 5px rgba(0,0,0,0.09)',
                '0px 8px 11px -5px rgba(0,0,0,0.1),0px 17px 26px 2px rgba(0,0,0,0.04),0px 6px 32px 5px rgba(0,0,0,0.09)',
                '0px 9px 11px -5px rgba(0,0,0,0.1),0px 18px 28px 2px rgba(0,0,0,0.04),0px 7px 34px 6px rgba(0,0,0,0.09)',
                '0px 9px 12px -6px rgba(0,0,0,0.1),0px 19px 29px 2px rgba(0,0,0,0.04),0px 7px 36px 6px rgba(0,0,0,0.09)',
                '0px 10px 13px -6px rgba(0,0,0,0.1),0px 20px 31px 3px rgba(0,0,0,0.04),0px 8px 38px 7px rgba(0,0,0,0.09)',
                '0px 10px 13px -6px rgba(0,0,0,0.1),0px 21px 33px 3px rgba(0,0,0,0.04),0px 8px 40px 7px rgba(0,0,0,0.09)',
                '0px 10px 14px -6px rgba(0,0,0,0.1),0px 22px 35px 3px rgba(0,0,0,0.04),0px 8px 42px 7px rgba(0,0,0,0.09)',
                '0px 11px 14px -7px rgba(0,0,0,0.1),0px 23px 36px 3px rgba(0,0,0,0.04),0px 9px 44px 8px rgba(0,0,0,0.09)',
                '0px 11px 15px -7px rgba(0,0,0,0.1),0px 24px 38px 3px rgba(0,0,0,0.04),0px 9px 46px 8px rgba(0,0,0,0.09)'
            ],
        }),
        [prefersDarkMode]
    );

    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    const handleToggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [accessToken, setAccessToken] = useLocalStorage('accessToken');

    const [getMe, getMeResult] = useLazyQuery(GET_ME);
    const [logout, logoutResult] = useMutation(LOGOUT);

    const isLoading = getMeResult.loading || logoutResult.loading || isLoggingOut;
    const error = getMeResult.error || logoutResult.error;

    const handleLogout = () => {
        setIsLoggingOut(true);

        logout()
            .then(() => {
                localStorage.removeItem('accessToken');
                location.reload();
            });
    };

    useEffect(() => {
        if (accessToken) {
            getMe();
        }
    }, [accessToken]);

    if (error) return <Error message={error.message} />;

    if (!accessToken) {
        return (
            <ThemeProvider theme={theme}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '100vh',
                        ...(theme.palette.mode == 'dark'
                            ? {
                                backgroundColor: '#59359A',
                                backgroundImage: `url("data:image/svg+xml,%0A%3Csvg id='visual' viewBox='0 0 900 600' width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'%3E%3Cdefs%3E%3Cfilter id='blur1' x='-10%25' y='-10%25' width='120%25' height='120%25'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'%3E%3C/feFlood%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'%3E%3C/feBlend%3E%3CfeGaussianBlur stdDeviation='161' result='effect1_foregroundBlur'%3E%3C/feGaussianBlur%3E%3C/filter%3E%3C/defs%3E%3Crect width='900' height='600' fill='%239c27b0'%3E%3C/rect%3E%3Cg filter='url(%23blur1)'%3E%3Ccircle cx='221' cy='544' fill='%23673ab7' r='357'%3E%3C/circle%3E%3Ccircle cx='418' cy='209' fill='%239c27b0' r='357'%3E%3C/circle%3E%3Ccircle cx='610' cy='356' fill='%23673ab7' r='357'%3E%3C/circle%3E%3Ccircle cx='394' cy='16' fill='%23673ab7' r='357'%3E%3C/circle%3E%3Ccircle cx='424' cy='404' fill='%239c27b0' r='357'%3E%3C/circle%3E%3Ccircle cx='147' cy='330' fill='%23673ab7' r='357'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E");`,
                                backgroundAttachment: 'fixed',
                                backgroundSize: 'cover',
                            }
                            : {
                                backgroundColor: '#59359A',
                                backgroundImage: `url("data:image/svg+xml,%0A%3Csvg id='visual' viewBox='0 0 900 600' width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'%3E%3Cdefs%3E%3Cfilter id='blur1' x='-10%25' y='-10%25' width='120%25' height='120%25'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'%3E%3C/feFlood%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'%3E%3C/feBlend%3E%3CfeGaussianBlur stdDeviation='161' result='effect1_foregroundBlur'%3E%3C/feGaussianBlur%3E%3C/filter%3E%3C/defs%3E%3Crect width='900' height='600' fill='%239c27b0'%3E%3C/rect%3E%3Cg filter='url(%23blur1)'%3E%3Ccircle cx='221' cy='544' fill='%23673ab7' r='357'%3E%3C/circle%3E%3Ccircle cx='418' cy='209' fill='%239c27b0' r='357'%3E%3C/circle%3E%3Ccircle cx='610' cy='356' fill='%23673ab7' r='357'%3E%3C/circle%3E%3Ccircle cx='394' cy='16' fill='%23673ab7' r='357'%3E%3C/circle%3E%3Ccircle cx='424' cy='404' fill='%239c27b0' r='357'%3E%3C/circle%3E%3Ccircle cx='147' cy='330' fill='%23673ab7' r='357'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E");`,
                                backgroundAttachment: 'fixed',
                                backgroundSize: 'cover',
                            })
                    }}
                >
                    <CssBaseline />

                    <Login setAccessToken={setAccessToken} />
                </Box>
            </ThemeProvider >
        );
    }

    return (
        <ThemeProvider theme={theme}>
            {isLoading
                ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100vw',
                            height: '100vh',
                            background: theme.palette.mode == 'dark' ? '#0b0a05' : '#f4f5fa',
                        }}
                    >
                        <CssBaseline />
                        <CircularProgress />
                    </Box>
                )
                : (
                    <Box
                        sx={{
                            display: 'flex',
                            background: theme.palette.mode == 'dark' ? '#0b0a05' : '#f4f5fa',
                        }}
                    >
                        <CssBaseline />

                        <Drawer variant="permanent" open={isDrawerOpen}>
                            <Toolbar sx={{ justifyContent: 'center' }}>
                                <img src="/vendor/cms/img/yago-content.svg" width="70" />
                            </Toolbar>

                            {menuGroups.map((menuGroup, i) => <Box key={i}>
                                <List component="nav">
                                    {menuGroup.map((menu, j) => <MenuItem menu={menu} key={j} />)}
                                </List>

                                {(i + 1 != menuGroups.length) && <Divider />}
                            </Box>
                            )}
                        </Drawer>

                        <Box
                            component="main"
                            sx={{
                                flexGrow: 1,
                                height: '100vh',
                                overflow: 'auto',
                            }}
                        >
                            <AppBar position="static" elevation={0}>
                                <Toolbar sx={{ justifyContent: 'space-between' }}>
                                    <Typography>
                                        {/* {getMeResult.data && getMeResult.data.me.name} */}
                                    </Typography>

                                    <Button color="secondary" onClick={handleLogout}>Log out</Button>
                                </Toolbar>
                            </AppBar>

                            <Routes>
                                {routes.map((route, i) => (
                                    <Route
                                        key={i}
                                        path={route.path}
                                        exact={!!route.exact}
                                        element={route.component}
                                    />
                                ))}
                            </Routes>
                        </Box>
                    </Box>
                )}
        </ThemeProvider>
    );
};