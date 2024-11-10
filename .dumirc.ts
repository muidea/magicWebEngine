import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  extraBabelPlugins: [
    ['babel-plugin-import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }],
  ],
  themeConfig: {
    name: 'WebEngine',
  },
});
