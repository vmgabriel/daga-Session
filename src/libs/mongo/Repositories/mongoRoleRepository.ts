// Develop vmgabriel

// Connection
import { MongoLib } from '../../mongolib';

// Models
import { RoleModel } from '../../../models/role';

// interfaces
import { IRole, nameTable, stateName } from '../../../interfaces/role';
import { IAttributeChange, IAndOrFilter, IFromFilterBase } from 'src/interfaces/filter';

// - Repositories
import { RoleRepo } from '../../../interfaces/repositories/roleRepo';

export class RoleMongoRepository extends MongoLib<IRole> implements RoleRepo {
  constructor() {
    super(nameTable,
          stateName,
          new RoleModel()
         );
  }

  public count(query: any): Promise<number> { return super.count(query); }

  public create(data: any): Promise<IRole> { return super.create(data); }

  public update(
    id: string | number,
    data: any
  ): Promise<IRole> { return super.update(id, data) }

  public delete(id: string | number): Promise<IRole> { return super.delete(id); }

  public getOne(id: string | number): Promise<IRole> { return super.getOne(id); }

  public getAll(
    limit: number,
    offset: number
  ): Promise<{ rows: Array<IRole>, count: number }> {
    return super.getAll(limit, offset);
  }

  public filter(
    attributes: Array<IAttributeChange>,
    filters: IAndOrFilter,
    joins: Array<IFromFilterBase>,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ rows: Array<IRole>, count: number }> {
    return super.filter(attributes, filters, joins, limit, offset);
  }

  public addNewItemToArray(
    id: string | number,
    attributeName: string,
    value: any
  ): Promise<IRole> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const data = super.reportNewAuth(id, attributeName, value);
        resolve(await data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // End Class
}
