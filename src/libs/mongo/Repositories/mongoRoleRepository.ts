// Develop vmgabriel

// Connection
import { MongoLib } from '../../mongolib';

// Models
import { RoleModel } from '../../../models/role';

// interfaces
import {
  IRole,
  nameTable,
  stateName,
  foreignRoleModuleId,
  foreignRoleModule  } from '../../../interfaces/role';

// - Repositories
import { RoleRepo } from '../../../interfaces/repositories/roleRepo';

/** Repository of Role  */
export class RoleMongoRepository extends MongoLib<IRole> implements RoleRepo {
  constructor() {
    super(
      nameTable,
      stateName,
      new RoleModel()
    );
  }

  /**
   * Get One Data
   * @param id Id of row to get
   */
  public getOne(id: string | number): Promise<IRole> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const idStr = '' + id;
        const data = await this.model
          .findOne({ _id: idStr })
          .populate(foreignRoleModule + '.' + foreignRoleModuleId);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Get All data
   * @param limit Limit of datas
   * @param offset skip datas
   */
  public getAll(
    limit: number,
    offset: number
  ): Promise<{ rows: Array<IRole>, count: number }> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const query = this.model.find()
        query.populate(foreignRoleModule + '.' + foreignRoleModuleId);
        const count = this.count(this.model.find());
        query.skip(limit * offset);
        query.limit(limit);
        resolve({ rows: await query, count: await count });
      } catch (err) {
        reject(err);
      }
    });
  }

  // End Class
}
