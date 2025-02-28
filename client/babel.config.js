module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // plugins: [[require.resolve('expo-router/babel')], 'inline-dotenv'],
     
  };
};
 