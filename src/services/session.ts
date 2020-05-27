// Develop vmgabriel


// Abstract Service
import { AbstractService } from './abstract';

// Interfaces
import { ISession, foreignNameBlackList } from '../interfaces/session';

// Model Service
import { SessionModel } from '../models/session';

// Repositories
import { SessionMongoRepository } from '../libs/mongo/Repositories/mongoSesssionRepository';

/** Session Service  */
export class SessionService extends AbstractService<ISession> {
  private sessionRepository: SessionMongoRepository;

  constructor() {
    super(
      'session',
      new SessionModel(),
      'sessionIsValid',
      new SessionMongoRepository()
    );
    this.sessionRepository = new SessionMongoRepository();
  }

  /**
   * Compare Session
   * @param data data to Compare
   */
  public compareSession(dataSession: Partial<ISession>): Promise<{
    data: string,
    valid: boolean,
    sessionId?: string
  }> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const message = await this.sessionRepository.compareSession(dataSession);
        resolve(message);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Create References Role
   * @param data Data to create
   * @param idRole Id of Role
   */
  public createBlackListReference(data: any, idRole: string | number): Promise<any> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        await this.connection.addReference(idRole, foreignNameBlackList, data);
        const message = {
          code: 201,
          message: 'Reference Create Correctly'
        };
        resolve(message);
      } catch(err) {
        reject(err);
      }
    });
  }

  /**
   * Update Reference with id Role and Id of Module
   * @param data Data to Update
   * @param idRole Id of Role
   * @param idModule Id of Module
   */
  public updateBlackListReference(
    data: any,
    idRole: string | number,
    idModule: string | number
  ): Promise<any> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        await this.connection.updateReference(
          idRole,
          idModule,
          foreignNameBlackList,
          data
        );
        const message = {
          code: 200,
          message: 'Reference Update Correctly'
        };
        resolve(message);
      } catch(err) {
        reject(err);
      }
    });
  }

  /**
   * Delete Reference of BlackList
   * @param idRole Id Role
   * @param idModule id Module
   */
  public deleteBlackListReference(
    idRole: string | number,
    idModule: string | number
  ): Promise<any> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        await this.connection.deleteReference(idRole, idModule, foreignNameBlackList);
        const message = {
          code: 200,
          message: 'Reference Deleted Correctly'
        };
        resolve(message);
      } catch(err) {
        reject(err);
      }
    });
  }

  // End Class
}

