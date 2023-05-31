module.exports = {
  module: 'es5',
  reactStrictMode: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(md|markdown)$/,
      type: 'javascript/esm',
    })
    config.module.rules.push({
      test: /\.(png|jpeg|jpg|gif|svg)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          fallback: {
            loader: 'file-loader',
            options: { publicPath: '/_next/static/images', outputPath: 'static/images' }
          }
        }
      }
    })
    // ailias
    config.resolve.alias['@'] = __dirname

    return config;
  },
};
