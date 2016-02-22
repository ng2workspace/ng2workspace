import {join, relative, isAbsolute} from 'path';
import * as _ from 'lodash';
import {ng2workspace} from '../ng2workspace';

export default class Util {
  public static toAbsolute(...args:string[]):string {
    return join(ng2workspace.config.root, ...args);
  }

  public static toRelative(...args:string[]):string {
    if(isAbsolute(args[0])) {
      return './' + relative(ng2workspace.config.root, args[0]);
    }

    return Util.toRelative(Util.toAbsolute(...args));
  }

  public static defaults(object:any, ...sources:any[]):any {
    return _.defaultsDeep(object, ...sources);
  }

  public static merge(object:any, ...sources:any[]):any {
    return _.isArray(object) ?
        _.union(object, ...sources) :
        _.merge(object, ...sources);
  }

  public static mergeInPlace(object:any, ...sources:any[]):void {
    sources.forEach((source:any) => {
      Object.keys(source || {}).forEach((key:string) => {
        object[key] = _.isObject(source[key]) ?
            this.merge(object[key], source[key]) : source[key];
      });
    });
  }
}