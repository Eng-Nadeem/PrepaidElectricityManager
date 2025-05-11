module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@assets': './src/assets',
          '@styles': './src/styles',
          '@hooks': './src/hooks',
          '@lib': './src/lib',
          '@shared': '../shared',
        },
      },
    ],
  ],
};