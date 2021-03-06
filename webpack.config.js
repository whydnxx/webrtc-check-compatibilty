"use strict";

const path = require("path");

module.exports = {
  target: "web",
  entry: "./src/index.js",
  devtool: "source-map",
  mode: process.env.MINIMIZE ? "production" : "development",
  optimization: {
    minimize: !!process.env.MINIMIZE,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: process.env.MINIMIZE
      ? "check-compatibilty.min.js"
      : "check-compatibilty.js",
    library: "CheckCompatibilty",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: ["env"],
        },
      },
    ],
  },
};
