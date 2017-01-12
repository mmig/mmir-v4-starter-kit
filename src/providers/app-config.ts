import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Config } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
 * HELPER for making config-changes (ionic-angular's Config) persistent
 */
@Injectable()
export class AppConfig {

  constructor(public storage: Storage, public config: Config) {

  }

  /**
   * Get the value assocated with the given key.
   * @return Promise that resolves with the value
   */
  get(key: string): Promise<any>{

    return this.storage.get(key).then(value => {

      //if no value in storage: use default from config
      if(typeof value === 'undefined' || value === null){
        return this.config.get(key);
      }
      return value;

    });
  }

  /**
   * Set the value for the given key.
   * @param key the key to identify this value
   * @param value the value for this key
   * @return Promise that resolves when the value is set
   */
  set(key: string, value: any): Promise<any> {
    return this.storage.set(key, value);
  }
  /**
   * Remove any value associated with this key.
   * @param key the key to identify this value
   * @return Promise that resolves when the value is removed
   */
  remove(key: string): any{
    return this.storage.remove(key);
  }
  /**
   * Clear the entire key value store. WARNING: HOT!
   * @return Promise that resolves when the kv store is cleared
   */
  clear(): any {
    return this.storage.clear();
  }
  /**
   * @return the number of keys stored.
   */
  length(): any {
    return this.storage.length;
  }
  /**
   * @return the keys in the store.
   */
  keys(): any {
    return this.storage.keys();
  }
  /**
   * Iterate through each key,value pair.
   * @param iteratorCallback a callback of the form (value, key, iterationNumber)
   */
  forEach(iteratorCallback: (value: any, key: string, iterationNumber: Number) => any): any {
    return this.storage.forEach(iteratorCallback);
  }

}
