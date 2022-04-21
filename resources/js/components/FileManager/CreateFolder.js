import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { CREATE_FOLDER, GET_FILES } from "../../queries";
import { Input } from "../Form/Input";

export const CreateFolderDrawer = ({ path, setErrorMessage, isCreateFolderActive, setIsCreateFolderActive }) => {
    const schema = yup.object({
        name: yup.string().matches(/^[A-Za-z0-9\-_]+$/).required(),
    });

    const methods = useForm({
        resolver: yupResolver(schema),
    });

    const [createFolder] = useMutation(CREATE_FOLDER, {
        refetchQueries: [
            GET_FILES
        ]
    });

    const handleCreateFolder = (data) => {
        const { name } = data;

        createFolder({
            variables: {
                input: {
                    path,
                    name,
                }
            }
        })
            .catch(() => {
                setErrorMessage('Could not create folder. Folder probably already exists.');
            });

        setIsCreateFolderActive(false);
    };

    useEffect(() => {
        methods.reset();
        setErrorMessage(null);
    }, [isCreateFolderActive])

    return (
        <Dialog
            open={isCreateFolderActive}
            onClose={() => setIsCreateFolderActive(false)}
        >
            <DialogTitle>Create folder</DialogTitle>

            <DialogContent>
                <FormProvider {...methods}>
                    <Input
                        label="Name"
                        name="name"
                        sx={{ mt: 2 }}

                    />
                </FormProvider>
            </DialogContent>

            <DialogActions>
                <Button
                    color="secondary"
                    onClick={methods.handleSubmit(handleCreateFolder)}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};