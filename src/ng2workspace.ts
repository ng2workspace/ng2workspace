import defaultConfig from './ng2workspace.defaults';
import * as _ from 'lodash';
import * as minimist from 'minimist';
import redun from 'redun/dist/redun';
import Logger from './lib/Logger';
import Util from './lib/Util';
import AddonReader from './lib/AddonReader';
import {Gulp} from 'gulp';

import {INg2WorkspaceConfig} from './ng2workspace.defaults';
import {
    INg2WorkspaceAddonLoader,
    INg2WorkspaceAddon
} from './types/Ng2WorkspaceAddon';

export interface IAddonInfo {
  loader:INg2WorkspaceAddonLoader;
  name:string;
  module:INg2WorkspaceAddon;
  options:any;
  taskNameOverrides:{[key:string]:string}|Function;
}

export interface INg2Workspace {
  config:INg2WorkspaceConfig;
  util:typeof Util;

  /**
   * Add an addon to be loaded by ng2workspace when it's bootstrapped.
   * @param addon the name of the addon, determined by its node module name
   * e.g. ng2workspace-addon-webpack -> name: webpack. Or, an addon function,
   * following the same API as the API for creating ng2workspace addons.
   * @param addonOptions any options for the addon. It will be directly passed
   * to the addon's `load` function.
   * @param taskNameOverrides a map of names to remap the names of generated
   * Gulp tasks.
   */
  add(
      addon:string|INg2WorkspaceAddonLoader,
      addonOptions?:any,
      taskNameOverrides?:{[key:string]:string}
  ):void;

  bootstrap(gulp?:Gulp):void;

  /**
   * Take an augmenting config, and applies any missing properties to the
   * ng2workspace config. It will not modify existing configurations.
   * @param augmentingConfig a configuration whose values will be used unless
   * already configured
   * @returns the new ng2workspace configuration
   */
  augmentConfig(augmentingConfig:any):any;

  /**
   * Configure ng2workspace
   * @param config the configuration object
   */
  configure(config:INg2WorkspaceConfig):void;

  /**
   * Get the exposed API of a ng2workspace addon
   * @param addonName the name of the addon, with or without the
   * ng2workspace-addon- prefix.
   */
  get(addonName:string, optional?:boolean):any;
}

class Ng2Workspace implements INg2Workspace {
  private static customAddonCount = 0;

  public get config():INg2WorkspaceConfig {
    return _.cloneDeep(this._config);
  }

  public get util():typeof Util {
    return Util;
  }

  constructor() {
    this.configure({});

    this._addonRegister = [];
  }

  public add(
      addon:string,
      addonOptions:any,
      taskNameOverrides:{[key:string]:string}|Function
  ):void {
    let loader:INg2WorkspaceAddonLoader;

    if(typeof addon === 'string') {
      addon = this._prefixAddonName(addon);
      loader = AddonReader.getLoader(addon, this.config.root);
    } else if(typeof addon === 'function') {
      loader = <INg2WorkspaceAddonLoader><any>addon;
      addon = `ng2workspace-addon-custom:${Ng2Workspace.customAddonCount++}`;
    } else {
      throw new Error('Invalid addon argument: You must pass either an addon' +
          ' name, or an addon loader function');
    }

    this._addonRegister.push({
      name: addon,
      loader: loader,
      module: null,
      options: addonOptions || {},
      taskNameOverrides: taskNameOverrides || {}
    });
  }

  public bootstrap(gulp:Gulp = require('gulp')):void {
    Logger.info('Loading addons...');

    this._addonRegister.forEach(
        (addonInfo:IAddonInfo) => AddonReader.load(addonInfo, this));

    this._addonRegister.forEach((addonInfo:IAddonInfo) => {
      redun.add(
          addonInfo.module.recipes || [],
          addonInfo.taskNameOverrides,
          addonInfo.name.replace(/^ng2workspace-addon-/, '')
      );
    });

    redun.bootstrap(gulp);
  }

  public augmentConfig(augmentingConfig:any):any {
    this._config = _.defaultsDeep(this._config, augmentingConfig);
    return this.config;
  }

  public configure(config:INg2WorkspaceConfig):void {
    this._config = _.defaultsDeep(
        _.omit(minimist(process.argv), '_'),
        config, defaultConfig
    );
  }

  public get(addonName:string, optional:boolean = false):any {
    addonName = this._prefixAddonName(addonName);
    let addon = _.find(this._addonRegister, {name: addonName});
    let error = '', help = '';
    let userOrderError = `If you're a user of ng2workspace, ensure that you
                          add your addons in the correct order.`;

    if(!addon && !optional) {
      error = `No such addon found: ${addonName}`;
      help = `If you're an addon author, make use of the
              optional flag if appropriate\n${userOrderError}`;
    } else if(addon && !addon.module) {
      error = `Addon ${addonName} has not been loaded yet.`;
      help = userOrderError;
    }

    if(error) {
      let errorString = error.replace(/\s\s+/g, ' ');
      Logger.error(errorString);
      Logger.info(help.replace(/\s\s+/g, ' '));
      console.log('\n\n');
      throw new Error(errorString);
    }

    return addon.module.export;
  }

  private _addonRegister:IAddonInfo[];

  private _config:INg2WorkspaceConfig;

  private _prefixAddonName(name:string):string {
    return name.indexOf('ng2workspace-addon-') === 0 ?
        name : 'ng2workspace-addon-' + name;
  }
}

export let ng2workspace:INg2Workspace = new Ng2Workspace();
export default ng2workspace;