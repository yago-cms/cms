import { Dialog, DialogContent } from "@mui/material";
import { DialogTitle } from "../DialogTitle";
import { PreviewFile } from "./File";

export const PreviewDrawer = ({ currentFile, isPreviewActive, setIsPreviewActive }) => {
    return (
        <Dialog
            open={isPreviewActive}
            onClose={() => setIsPreviewActive(false)}
        >
            <DialogTitle onClose={() => setIsPreviewActive(false)}>Preview</DialogTitle>
            <DialogContent dividers>
                <PreviewFile file={currentFile} />
            </DialogContent>
        </Dialog>
    );
};