const path = require('path')
const resolve = (dir) => path.resolve(__dirname, dir)
module.exports = {
  webpack: {
    alias: {
      '@': resolve('src')
    },
    configure: (webpackConfig) => {
      // 遍历 rules，找到 source-map-loader 并排除 @antv/util
      webpackConfig.module.rules.forEach((rule) => {
        if (
          rule.use &&
          rule.use.find &&
          rule.use.find((u) =>
            typeof u === 'string'
              ? u.includes('source-map-loader')
              : u.loader && u.loader.includes('source-map-loader')
          )
        ) {
          rule.exclude = [
            ...(rule.exclude || []),
            /@antv[\\/]util/
          ];
        }
      });
      return webpackConfig;
    },
  },
};
