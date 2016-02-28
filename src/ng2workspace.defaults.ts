let defaultConfig:INg2WorkspaceConfig = {
  dir_src: 'src',
  dir_bin: 'bin',
  env: {mode: 'development'},
  host_dev: 'localhost',
  host_prod: 'localhost',
  hot_reload: true,
  html_title: 'ng2workspace',
  html_baseUrl: '/',
  port_dev: 9999,
  port_prod: 8080,
  root: process.cwd(),
  spec_entry: 'spec-bundle.js'
};

export interface INg2WorkspaceConfig {
  dir_src?:string;
  dir_bin?:string;
  env?:any;
  host_dev?:string;
  host_prod?:string;
  html_title?:string;
  hot_reload?:boolean;
  html_baseUrl?:string;
  port_dev?:number;
  port_prod?:number;
  root?:string;
  spec_entry?:string;
}

export default defaultConfig;