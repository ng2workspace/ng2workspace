// todo(mm): move this, and other definitions to a ng2workspace.d.ts file

import {INg2Workspace} from '../ng2workspace';

export interface INg2WorkspaceAddonLoader {
  (options:any, workspace:INg2Workspace):INg2WorkspaceAddon;
}

export interface INg2WorkspaceAddon {
  recipes?:string[];
  export?:any;
}