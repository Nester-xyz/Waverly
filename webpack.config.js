const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const webpack = require("webpack")

module.exports = {
    mode: "development",
    devtool: 'cheap-module-source-map',
    entry: {
        popup: path.resolve('./src/popup/popup.jsx'),
        background: path.resolve('./src/background/background.jsx'),
        welcome: path.resolve('/src/welcome/welcome.jsx')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                use: ['style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            ident: 'postcss',
                            plugins: [tailwindcss, autoprefixer],
                        }
                    }
                }],
                test: /\.css$/i,
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve('src/static'),
                    to: path.resolve('dist')
                }
            ]
        }),
        new HtmlPlugin({
            title: "WaverlyApp",
            filename: "popup.html",
            chunks: ['popup']
        }
        )
    ],
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx'],
    },
    output: {
        filename: '[name].js',
    }
};
