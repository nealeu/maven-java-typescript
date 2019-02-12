const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./index.ts",
    externals: [
        /^(?!\.\/)/
    ],
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        compilerOptions: {
                            noEmit: false
                        }
                    }
                },
                exclude: /(^|\/)node_modules\//
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ],
    resolve: {
        extensions: [".tsx", ".ts"]
    },
    output: {
        libraryTarget: "umd",
        filename: "app-components.js"
    }
};
