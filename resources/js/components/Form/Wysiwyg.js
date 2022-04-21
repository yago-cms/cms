import { useMediaQuery } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { useController } from 'react-hook-form';

export const defaultConfig = {
    plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | ' +
        'bold italic forecolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
};

export const Wysiwyg = ({ name, ...props }) => {
    // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const prefersDarkMode = false;

    const {
        field: { onChange, value },
    } = useController({
        name,
        defaultValue: '',
    });


    return (
        <Editor
            init={{
                ...defaultConfig,
                skin: prefersDarkMode ? 'oxide-dark' : 'oxide',
                content_css: prefersDarkMode ? 'dark' : '',
                height: '100%',
            }}
            tinymceScriptSrc="/vendor/cms/js/tinymce/tinymce.min.js"
            value={value}
            onEditorChange={onChange}
            {...props}
        />
    );
};
