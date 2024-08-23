const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  webpack: function (config, env) {
    config.output.filename = "static/js/[name].[hash:8].js";
    config.output.chunkFilename = "static/js/[name].[hash:8].chunk.js";

    // Find MiniCssExtractPlugin and update its options
    config.plugins = config.plugins.map(plugin => {
      if (plugin instanceof MiniCssExtractPlugin) {
        return new MiniCssExtractPlugin({
          filename: "static/css/[name].[hash:8].css",
          chunkFilename: "static/css/[name].[hash:8].chunk.css",
        });
      }
      return plugin;
    });

    // Update loader options for image files
    config.module.rules = config.module.rules.map(rule => {
      if (!rule.oneOf) return rule;

      rule.oneOf = rule.oneOf.map(oneOfRule => {
        if (oneOfRule.loader && oneOfRule.loader.includes("file-loader")) {
          oneOfRule.options = {
            ...oneOfRule.options,
            name: "static/media/[name].[hash:8].[ext]",
          };
        }
        return oneOfRule;
      });

      return rule;
    });

    return config;
  },
};
