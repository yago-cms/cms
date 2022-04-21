const path = require('path');
const { DllReferencePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: path.join(__dirname, 'resources', 'js', 'index.js'),
    },
    mode: 'production',
    devtool: 'source-map',
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
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'resources', 'dist', 'js'),
    },
    plugins: [
        new DllReferencePlugin({
            context: __dirname,
            manifest: require('./resources/dist/js/vendor-manifest.json')
        }),
        new CopyPlugin({
            patterns: [
                { from: '../../node_modules/tinymce', to: './tinymce' },
            ],
        }),
    ]
};