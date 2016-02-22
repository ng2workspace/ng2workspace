import Logger from './Logger';
import {existsSync} from 'fs';
import {resolve, isAbsolute} from 'path';
import {INg2Workspace, IAddonInfo} from '../ng2workspace';
import {INg2WorkspaceAddonLoader} from '../types/Ng2WorkspaceAddon';

export default class AddonReader {
  public static getLoader(
      addon:string,
      workspaceRoot:string
  ):INg2WorkspaceAddonLoader {
    let found:INg2WorkspaceAddonLoader;

    let localPath = resolve(workspaceRoot, 'ng2workspace_addons', addon);
    let nodeModulePath = resolve(workspaceRoot, 'node_modules', addon);

    let localExists = existsSync(localPath);
    let nodeModuleExists = existsSync(nodeModulePath);

    if(localExists) {
      found = require(localPath);
      this.paths[addon] = localPath;
    } else if(nodeModuleExists) {
      found = require(nodeModulePath);
      this.paths[addon] = nodeModulePath;
    }

    if(!found) {
      let error = `Addon '${addon}' not found! Have you installed it?`;
      let info = `Searched locations:
           ${localPath}
           ${nodeModulePath}
      `;

      Logger.error(error);
      Logger.info(info);

      process.exit();
    }

    return found;
  }

  public static load(addonInfo:IAddonInfo, workspace:INg2Workspace):any {
    if(addonInfo.module) {
      Logger.warn(`WARN: Tried to load ${addonInfo.name} more than once!`);
      return addonInfo.module;
    }

    addonInfo.module = addonInfo.loader(addonInfo.options, workspace) || {};

    addonInfo.module.recipes = (addonInfo.module.recipes || []).map(
        (recipePath:string) => isAbsolute(recipePath) ? recipePath :
            resolve(this.paths[addonInfo.name], recipePath));

    addonInfo.module.export = addonInfo.module.export || {};

    return addonInfo.module.export;
  }

  private static paths:{[key:string]:string} = {};
}