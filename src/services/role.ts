// Develop vmgabriel

// Abstract Service
import { AbstractService } from './abstract';

// Models
import { RoleModel } from '../models/role';

// Interfaces
import { foreignRoleModule, IRole } from '../interfaces/role';
import { RoleMongoRepository } from '../libs/mongo/Repositories/mongoRoleRepository';

/** Role Service  */
export class RoleService extends AbstractService<IRole> {
  constructor() {
    super(
      'role',
      new RoleModel(),
      'roleIsValid',
      new RoleMongoRepository()
    );
  }

  /**
   * Create Reference Module
   * @param data data to create
   * @param idRole Id of Role
   */
  public createModuleReference(data: any, idRole: string | number): Promise<any> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        await this.connection.addReference(idRole, foreignRoleModule, data);
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
   * Update references Module
   * @param data Data to update
   * @param idRole Id Role data
   * @param idModule Id Module Data
   */
  public updateModuleReference(
    data: any,
    idRole: string | number,
    idModule: string | number
  ): Promise<any> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        await this.connection.updateReference(
          idRole,
          idModule,
          foreignRoleModule,
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
   * Delete Reference of Role
   * @param idRole Id Role
   * @param idModule Id Module
   */
  public deleteModuleReference(
    idRole: string | number,
    idModule: string | number
  ): Promise<any> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        await this.connection.deleteReference(idRole, idModule, foreignRoleModule);
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
