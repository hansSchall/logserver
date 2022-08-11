const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/ts/frontend.tsx',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(sa|sc|c)ss$/i,
                use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
            },
        ],
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.js', ".css"],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'STP Client',
            // Load a custom template (lodash by default)
            template: 'src/frontend.html'
        })
    ],

    output: {
        filename: '[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
};