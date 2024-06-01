const path = require('path');
const {
  override, fixBabelImports, addLessLoader, addWebpackAlias,
} = require('customize-cra');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const addMyPlugin = (config) => {
  const plugins = [
    new ProgressBarPlugin({
      format: 'Build [:bar] :percent (:elapsed seconds)',
      clear: false,
    }),
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new StyleLintPlugin({
      files: ['**/*.{html,vue,css,sass,scss}'],
      fix: false,
      cache: true,
      emitErrors: true,
      failOnError: false,
    }),
  ];

  config.plugins = [...config.plugins, ...plugins];

  return config;
};

process.env.GENERATE_SOURCEMAP = 'false';

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),

  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#00A5E4',
    },
  }),

  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
    components: path.resolve(__dirname, 'src/components'),
    api: path.resolve(__dirname, 'src/api'),
    config: path.resolve(__dirname, 'src/config'),
  }),

  addMyPlugin,
);
