var path = require('path');
var EncodingPlugin = require('webpack-encoding-plugin');

module.exports = {
    entry: './app/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [new EncodingPlugin({
        encoding: 'utf8'
    })]
};
