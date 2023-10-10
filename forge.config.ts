import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
import MakerDeb from "@electron-forge/maker-deb";

const iconPath = process.platform === 'win32' ? './src/img/favicon.ico' : './src/img/favicon.png';

const config: ForgeConfig = {
  packagerConfig: {
    name: 'oslo',
    executableName: 'oslo',
    asar: false,
    icon: iconPath
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      setupIcon: iconPath,
      iconUrl: 'file:///' + __dirname + '/src/img/favicon.ico',
      description: "Oslo is a personal finance app for keeping track of your savings. You can set up standing orders, manage multiple accounts and view your expenses over different time spans.",
      name: "oslo",
      version: "3.0.0"
    }, ['win32']),
    new MakerRpm({
      options: {
        icon: iconPath,
        categories: ["Office"],
        description: "Oslo is a personal finance app for keeping track of your savings. You can set up standing orders, manage multiple accounts and view your expenses over different time spans.",
        genericName: "Personal Finance App",
        homepage: "https://github.com/konstantin-lukas/oslo",
        license: "MIT",
        name: "oslo",
        productName: "Oslo",
        version: "3.0.0"
      }
    }, ['linux']),
    new MakerDeb({
      options: {
        icon: iconPath,
        categories: ["Office"],
        description: "Oslo is a personal finance app for keeping track of your savings. You can set up standing orders, manage multiple accounts and view your expenses over different time spans.",
        genericName: "Personal Finance App",
        homepage: "https://github.com/konstantin-lukas/oslo",
        name: "oslo",
        productName: "Oslo",
        version: "3.0.0"
      }
    }, ['linux'])
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
