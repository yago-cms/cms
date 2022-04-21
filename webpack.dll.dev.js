const path = require('path');
const { DllPlugin } = require('webpack');
// const glob = require('glob');

// glob('../..//node_modules/@mui/base/**/*.js', {}, (err, files)=>{
//   console.log(files)
// });

module.exports = {
    mode: 'development',
    devtool: 'eval',
    entry: {
        vendor: [
            path.join(__dirname, 'resources', 'js', 'module.js'),
            '@apollo/client',
            '@emotion/cache',
            '@emotion/react',
            '@emotion/styled',
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/pro-duotone-svg-icons',
            '@fortawesome/react-fontawesome',
            '@googlemaps/react-wrapper',
            '@hookform/resolvers',
            '@hookform/resolvers/yup',
            '@mui/base',
            '@mui/base/className/ClassNameGenerator',
            '@mui/base/composeClasses/composeClasses',
            '@mui/base/generateUtilityClass/generateUtilityClass',
            '@mui/base/generateUtilityClasses/generateUtilityClasses',
            '@mui/base/PopperUnstyled',
            '@mui/base/Portal',
            '@mui/base/TrapFocus',
            '@mui/lab',
            '@mui/material',
            '@mui/system',
            '@mui/x-data-grid',
            '@mui/x-date-pickers',
            '@tinymce/tinymce-react',
            'date-fns/format',
            'date-fns/parseISO',
            'fast-equals',
            'graphql',
            'object-assign',
            'prop-types',
            'react-dom',
            'react-hook-form',
            'react-router-dom',
            'react',
            'yup',
        ],
    },
    module: {
        rules: [
            {
                test: /\.?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            [
                                '@babel/preset-react',
                                { runtime: 'automatic' }
                            ]
                        ]
                    }
                }
            },
        ]
    },
    output: {
        path: path.join(__dirname, 'resources', 'dev', 'js'),
        filename: '[name].js',
        library: '[name]'
    },
    plugins: [
        new DllPlugin({
            context: __dirname,
            path: path.join(__dirname, 'resources', 'dev', 'js', '[name]-manifest.json'),
            name: '[name]',
            format: true,
        })
    ]
};