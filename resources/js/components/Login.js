import { useMutation } from "@apollo/client";
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Alert, Container, IconButton, InputAdornment, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { LOGIN } from "../queries";
import { Input } from "./Form/Input";

const schema = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
});

export const Login = ({ setAccessToken }) => {
    const [isShowingPassword, setIsShowingPassword] = useState(false);

    const methods = useForm({
        resolver: yupResolver(schema),
    });

    const [login, { loading: isLoading, error }] = useMutation(LOGIN);

    const handleLogin = (data) => {
        login({
            variables: {
                input: {
                    email: data.email,
                    password: data.password,
                }
            }
        }).then(response => {
            const { token } = response.data.login;

            setAccessToken(token);
        }).catch(error => { });
    };

    const handleClickShowPassword = () => {
        setIsShowingPassword(!isShowingPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        // make sure there is no token before making requests
        localStorage.removeItem('accessToken');
    }, []);

    return (
        <FormProvider {...methods}>
            <Container maxWidth="sm">
                <Paper
                    elevation={8}
                    sx={{ p: 4 }}
                >
                    {error && <Alert severity="error">
                        Could not login. Wrong e-mail and/or password.
                    </Alert>}

                    <h1>Login</h1>

                    <Input
                        label="E-mail"
                        name="email"
                        sx={{ mb: 4 }}
                    />

                    <Input
                        label="Password"
                        type={isShowingPassword ? 'text' : 'password'}
                        name="password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {isShowingPassword
                                            ? <FontAwesomeIcon icon={faEyeSlash} fixedWidth />
                                            : <FontAwesomeIcon icon={faEye} fixedWidth />
                                        }
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        sx={{ mb: 4 }}
                    />

                    <LoadingButton
                        loading={isLoading}
                        color="secondary"
                        onClick={methods.handleSubmit(handleLogin)}
                    >
                        Login
                    </LoadingButton>
                </Paper>
            </Container>
        </FormProvider>
    );
};