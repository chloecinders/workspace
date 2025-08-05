const { defineConfig } = require("@rspack/cli");
const { rspack } = require("@rspack/core");
const path = require("node:path");

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["last 2 versions", "> 0.2%", "not dead", "Firefox ESR"];

module.exports = defineConfig({
    entry: {
        main: "./src/index.ts",
    },
    resolve: {
        extensions: ["...", ".ts"],
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@assets": path.resolve(__dirname, "assets"),
            "@components": path.resolve(__dirname, "src/components"),
            "@stores": path.resolve(__dirname, "src/stores"),
        },
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                type: "asset",
            },
            {
                test: /\.webp$/,
                type: "asset",
            },
            {
                test: /\.png$/,
                type: "asset",
            },
            {
                test: /\.wasm$/,
                type: "asset",
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "builtin:swc-loader",
                        options: {
                            jsc: {
                                parser: {
                                    syntax: "ecmascript",
                                },
                            },
                            env: { targets },
                        },
                    },
                ],
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "builtin:swc-loader",
                        options: {
                            jsc: {
                                parser: {
                                    syntax: "typescript",
                                    decorators: true,
                                },
                                transform: {
                                    legacyDecorator: true,
                                    decoratorMetadata: true,
                                    useDefineForClassFields: false,
                                },
                                target: "es2022",
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [new rspack.HtmlRspackPlugin({ template: "./index.html" })],
    optimization: {
        minimizer: [
            new rspack.SwcJsMinimizerRspackPlugin(),
            new rspack.LightningCssMinimizerRspackPlugin({
                minimizerOptions: { targets },
            }),
        ],
    },
    experiments: {
        css: true,
    },
});
