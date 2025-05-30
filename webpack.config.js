const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
 
module.exports = {
  mode: 'production', // 或者 'development' 用于开发环境
  entry: './src/index.js', // 你的入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js', // 输出文件名
    publicPath: '/', // 新增这一行
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // 使用babel-loader来处理js和jsx文件
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
          },
        },
      },
      {
        test: /\.css$/, // 使用style-loader和css-loader来处理CSS文件
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/, // 新增
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // 新增图片处理
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ // 自动生成index.html文件并引入打包后的JS文件
      template: './public/index.html' // 使用指定的HTML模板文件作为模板生成新的HTML文件
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'], // 自动解析扩展名
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
};