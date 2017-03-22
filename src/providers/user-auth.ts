import {AppConfig} from './app-config';
import { Injectable } from '@angular/core';

export type UserAuth = {name: string, password: string};

/**
 * Pseudo user management: check if authentifaction for a user exists / create one.
 * 
 */
@Injectable()
export class UserAuthProvider {

  constructor(private appConfig: AppConfig) {}

  getUserAuth(name: string): Promise<UserAuth>{

    if(!name){
      return Promise.reject(`User ${name} is not registered`);
    }

    return new Promise<UserAuth>((resolve, reject) => {

      this.appConfig.get('user.'+name).then(password => {

      	if(password){
      		return resolve({name: name, password: password});
      	}

        reject(`User ${name} has invalid password.`);
      });

    });

  }

  /**
   * adds or updates the user authentification information
   * @param  {string} name the user name (must not be FALSY, otherwise the returned Promise will get rejected)
   * @param  {string} pw the password, if the user is already registered with a
   *                      different password, it will be updated with this one
   * @return Promise<UserAuth> the resolved UserAuth Promise
   */
  addUserAuth(name: string, pw: string): Promise<UserAuth> {

    if(!name || !pw){
      return Promise.reject(`Inavlid name or password`);
    }

    return new Promise<UserAuth>((resolve, reject) => {

      this.appConfig.get('user.'+name).then(password => {
        if(password === pw){
          resolve({name: name, password: pw});
        } else {
          this.appConfig.set('user.'+name, pw).then(() => {
          	resolve({name: name, password: pw});
          });
        }
      });

    });

  }

}
