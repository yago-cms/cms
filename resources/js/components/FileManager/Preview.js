import { Dialog, DialogContent } from "@mui/material";
import { PreviewFile } from "./File";

export const PreviewDrawer = ({ currentFile, isPreviewActive, setIsPreviewActive }) => {
    return (
        <Dialog
            open={isPreviewActive}
            onClose={() => setIsPreviewActive(false)}
        >
            <DialogContent>
                <PreviewFile file={currentFile} />
            </DialogContent>
        </Dialog>
    );
};