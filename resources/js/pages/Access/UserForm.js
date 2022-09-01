import { useMutation, useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { Error } from "../../components/Error";
import { Input } from "../../components/Form/Input";
import { Loading } from "../../components/Loading";
import { Page, PageContent } from "../../components/Page";
import { GET_USER, GET_USERS, UPSERT_USER } from "../../queries";

export const UserForm = () => {
    const { id } = useParams();
    const isNew = id === undefined;
    let schema;

    if (isNew) {
        schema = yup.object({
            name: yup.string().required(),
            email: yup.string().email().required(),
            password: yup.string().required(),
            passwordRepeat: yup.string().required()
                .test('passwords-match', 'Passwords must match', (value, context) => context.parent.password === value)
        });
    } else {
        schema = yup.object({
            name: yup.string().required(),
            email: yup.string().email().required(),
            password: yup.string(),
            passwordRepeat: yup.string()
                .test('passwords-match', 'Passwords must match', (value, context) => context.parent.password === value)
        });
    }

    const methods = useForm({
        resolver: yupResolver(schema),
    });

    const navigate = useNavigate();

    const getUserResult = useQuery(GET_USER, {
        variables: {
            id
        },
        skip: isNew,
    });

    const [upsertUser, upsertUserResult] = useMutation(UPSERT_USER, {
        onCompleted: (data) => {
            navigate(`/access/users/${data.upsertUser.id}`);
        },
        refetchQueries: () => [{
            query: GET_USERS,
        }]
    });

    const handleSave = (data) => {
        const user = {
            id: !isNew ? id : null,

            name: data.name,
            email: data.email,
        };

        if (isNew || data.password) {
            user.password = data.password;
        }

        upsertUser({
            variables: {
                input: user
            }
        });
    };

    const Footer = () => (
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button color="secondary" onClick={methods.handleSubmit(handleSave)}>Save</Button>
        </Box>
    );

    const heading = isNew ? 'Add user' : 'Edit user';

    const isLoading = getUserResult.loading || upsertUserResult.loading;
    const error = getUserResult.error || upsertUserResult.error;

    useEffect(() => {
        if (getUserResult.loading === false && getUserResult.data) {
            const user = getUserResult.data.user;

            methods.setValue('name', user.name);
            methods.setValue('email', user.email);
        }
    }, [getUserResult.loading, getUserResult.data]);

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <FormProvider {...methods}>
            <Page
                heading={heading}
                footer={<Footer />}
            >
                <PageContent>
                    <Input
                        label="Name"
                        name="name"
                    />

                    <Input
                        label="E-mail"
                        name="email"
                    />

                    <Input
                        label={isNew ? 'Password' : 'New password'}
                        name="password"
                        type="password"
                    />

                    <Input
                        label={isNew ? 'Repeat password' : 'Repeat new password'}
                        name="passwordRepeat"
                        type="password"
                    />
                </PageContent>
            </Page>
        </FormProvider>
    );
};