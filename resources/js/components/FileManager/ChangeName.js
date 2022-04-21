import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { GET_FILES, RENAME_FILE } from "../../queries";
import { Input } from "../Form/Input";

export const ChangeNameDrawer = ({ file, isChangeNameActive, setIsChangeNameActive, setErrorMessage }) => {
    const schema = yup.object({
        name: yup.string().required(),
    });

    const methods = useForm({
        resolver: yupResolver(schema),
    });

    const [renameFile] = useMutation(RENAME_FILE, {
        refetchQueries: [
            GET_FILES
        ]
    });

    const handleChangeName = (data) => {
        const { name } = data;

        renameFile({
            variables: {
                input: {
                    path: file.path,
                    name,
                }
            }
        })
            .catch(() => {
                setErrorMessage('Could not rename file. File probably already exists.');
            });

        setIsChangeNameActive(false);
    };

    useEffect(() => {
        methods.reset();
        setErrorMessage(null);
    }, [isChangeNameActive]);

    useEffect(() => {
        if (file) {
            methods.setValue('name', file.name);
        }
    }, [file]);

    if (!file) return null;

    return (
        <Dialog
            open={isChangeNameActive}
            onClose={() => setIsChangeNameActive(false)}
        >
            <DialogTitle>
                Change filename
            </DialogTitle>

            <DialogContent>
                <FormProvider {...methods}>
                    <Input
                        label="Name"
                        name="name"
                    />
                </FormProvider>
            </DialogContent>

            <DialogActions>
                <Button
                    color="secondary"
                    onClick={methods.handleSubmit(handleChangeName)}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};