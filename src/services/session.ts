// Develop vmgabriel

// Libraries
import * as R from 'ramda';

// Abstract Service
import { AbstractService } from './abstract';

// Interfaces
import { ISession, attributesWithoutPass } from '../interfaces/session';

// Model Service
import { SessionModel } from '../models/session';

import { SessionMongoRepository } from '../libs/mongo/Repositories/mongoSesssionRepository';

/** Session Service  */
export class SessionService extends AbstractService {

  constructor() {
    super(
      'session',
      new SessionModel(),
      'sessionIsValid',
      new SessionMongoRepository()
    );
  }

  /**
   * Get One Session
   * @param id id of Session
   */
  // public getSessionComplete(
  //   id: string,
  //   limit: number = 1,
  //   offset: number = 0
  // ): Promise<{ code: number, row: Array<any>, message?: string }> {
  //   return new Promise(async (resolve: any, reject: any) => {
  //     try {
  //       const attributeWithName = R.map((data: any) => {
  //           return {...data, name: 'data'}; },
  //           attributesWithoutPass
  //       );
  //       const attributes = [
  //         ...attributeWithName,
  //         {
  //           column: 'permissions',
  //           as: '',
  //           name: ''
  //         },
  //         {
  //           column: 'rol',
  //           as: '',
  //           name: ''
  //         },
  //         {
  //           column: '',
  //           as: 'blacklists',
  //           name: '',
  //           isArray: true,
  //           inContent: 'blacklist',
  //           comparation: 'item.blackListIsValid = true'
  //         }
  //       ];

  //       const from = [
  //         {
  //           name: 'data',
  //           default: true
  //         },
  //         {
  //           name: 'rol',
  //           joinType: 'LEFT',
  //           unionType: 'JOIN',
  //           onType: 'KEYS',
  //           onValue: 'data.sessionRole',
  //           default: false
  //         },
  //         {
  //           name: 'blacklist',
  //           joinType: 'LEFT',
  //           unionType: 'NEST',
  //           onType: 'KEYS',
  //           onValue: 'data.sessionBlackList',
  //           default: false
  //         },
  //         {
  //           name: 'rolePermission',
  //           joinType: 'LEFT',
  //           unionType: 'NEST',
  //           onType: 'KEYS',
  //           onValue: 'rol.rolePermission[*].roleModuleId',
  //           default: false
  //         }
  //       ];

  //       const otherContent = `LET permissions = ARRAY {
  //         "roleModulePermission": perm.roleModulePermission,
  //         "roleModuleId": perm.roleModuleId,
  //         "module": IFNULL(
  //           FIRST rm FOR rm IN rolePermission
  //           WHEN META(rm).id = perm.roleModuleId END, MISSING
  //         )
  //        } FOR perm IN rol.rolePermission END`;

  //       const filter = {
  //         and: [
  //           {
  //             column: 'META(data).id',
  //             op: '=',
  //             value: id,
  //             type: 'string'
  //           }
  //         ]
  //       };

  //       const { query, status, reason } = await this.connection.advancedFilter(
  //         this.collection,
  //         this.attributeState,
  //         attributes,
  //         { from },
  //         otherContent,
  //         filter,
  //         limit,
  //         offset
  //       );

  //       let message = {
  //         code: 400,
  //         row: query,
  //         message: reason
  //       };

  //       if (status === 'sucess') {
  //         message.code = 200;
  //         delete message.message;
  //       }

  //       resolve(message);
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // }

  /**
   * Compare Session
   * @param data data to Compare
   */
  // public compareSession(dataSession: Partial<ISession>): Promise<{
  //   data: string,
  //   valid: boolean,
  //   sessionId?: string
  // }> {
  //   return new Promise(async (resolve: any, reject: any) => {
  //     try {
  //       const attributes = [
  //         {
  //           column: 'sessionUserName',
  //           as: ''
  //         },
  //         {
  //           column: 'sessionPassword',
  //           as: ''
  //         }
  //       ];

  //       const filter = {
  //         and: [
  //           {
  //             column: 'sessionUserName',
  //             op: '=',
  //             value: dataSession.sessionUserName,
  //             type: 'string'
  //           }
  //         ]
  //       };

  //       // get data of user with certain
  //       const session = await this.connection.filter(
  //         this.collection,
  //         this.attributeState,
  //         attributes,
  //         filter,
  //         1,
  //         0
  //       );

  //       const message = (session.status === 'sucess')
  //         ? (await compare(dataSession.sessionPassword, session.query[0].sessionPassword))
  //         ? { data: 'User and Password is Correct', valid: true, sessionId: session.query[0].id }
  //         : { data: 'Password Error', valid: false }
  //         : { data: 'User not found.', valid: false }
  //       ;
  //       // compare data
  //       resolve(message);
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // }

  /**
   * Report a new Auth data
   * @param id id to add data
   * @param blackItemId if of session
   */
  // public reportNewAuth(
  //   id: string,
  //   blackItemId: string
  // ): Promise<T> {
  //   return new Promise(async (resolve: any, reject: any) => {
  //     try {
  //       // Save BlackList Id to Session
  //       const data = await this.connection.addNewItemToArray(id, 'sessionBlackList', blackItemId);
  //       resolve(data);
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // }

  // End Class
}

