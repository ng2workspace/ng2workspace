import {log, colors} from 'gulp-util';

export default class Logger {
  public static log(...args:any[]):void {
    log(colors.cyan('[ng2workspace]'), ...args);
  }

  public static info(...args:any[]):void {
    return this.log(colors.blue(...args));
  }

  public static error(...args:any[]):void {
    return this.log(colors.red(...args));
  }

  public static warn(...args:any[]):void {
    return this.log(colors.yellow(...args));
  }
}