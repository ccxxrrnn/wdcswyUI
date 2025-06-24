const path = require('path');
const webpack = require('webpack');

module.exports = function override(config, env) {
  // 添加路径别名 @ -> src
  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, 'src'),
    '@/assets': path.resolve(__dirname, 'src/assets')
  };

    // 移除 source-map-loader 对 @antv/util 的处理
    const rules = config.module.rules;
    const sourceMapLoaderIndex = rules.findIndex(
      (rule) =>
        rule.loader &&
        typeof rule.loader === 'string' &&
        rule.loader.includes('source-map-loader')
    );

    if (sourceMapLoaderIndex !== -1) {
      const sourceMapRule = rules[sourceMapLoaderIndex];
      sourceMapRule.exclude = [/\.js$/, /@antv\/util/]; // 排除 antv/util
    }
  return config;
};