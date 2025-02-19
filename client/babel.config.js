const { run } = require("jest");

module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        ["babel-preset-expo", { jsxImportSource: "nativewind", jsxRuntime: "automatic" }],
        "@react-native/babel-preset",
      ],
      plugins: [
        "module:react-native-dotenv",
        [
          "module-resolver",
          {
            root: ["./"],
            alias: {
              "@": "./",
              "tailwind.config": "./tailwind.config.js",
            },
          },
        ],
      ],
    };
  };
  