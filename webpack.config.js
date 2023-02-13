const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

module.exports = {
    mode: "development",
    devtool: 'cheap-module-source-map',
    entry: {
        popup: path.resolve('./src/popup/popup.jsx'),
        background: path.resolve('./src/background/background.jsx')
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
                    }
                }
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
        ]
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
        extensions: ['.jsx', 'js']
    },
    output: {
        filename: '[name].js'
    }
}