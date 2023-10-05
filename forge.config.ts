import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    name: 'oslo',
    executableName: 'oslo',
    asar: false,
    icon: './src/img/favicon'
  },
  rebuildConfig: {},
  makers: [
      new MakerSquirrel({
        setupIcon: './src/img/favicon.ico'
      }, ['win32']),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({
      options: {
        icon: './src/img/favicon.png'
      }
    }, ['linux']),
    /*new MakerDeb({
      options: {
        icon: './src/img/favicon.png'
      }
    }, ['linux'])*/
  ],
  plugins: [
    //new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
