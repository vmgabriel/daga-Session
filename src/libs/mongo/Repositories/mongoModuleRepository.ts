// Develop vmgabriel

// Connection
import { MongoLib } from '../../mongolib';

// Models
import { ModuleModel } from '../../../models/module';

// interfaces
import { IModule, nameTable, stateName } from '../../../interfaces/module';
import { IAttributeChange, IAndOrFilter, IFromFilterBase } from 'src/interfaces/filter';

// - Repositories
import { ModuleRepo } from '../../../interfaces/repositories/moduleRepo';

/** Module Mongo  */
export class ModuleMongoRepository extends MongoLib<IModule> implements ModuleRepo {
  constructor() {
    super(nameTable, stateName, new ModuleModel());
  }

  public count(query: any): Promise<number> { return super.count(query); }

  public create(data: any): Promise<IModule> { return super.create(data); }

  public update(id: string | number, data: any): Promise<IModule> { return super.update(id, data) }

  public delete(id: string | number): Promise<IModule> { return super.delete(id); }

  public getOne(id: string | number): Promise<IModule> { return super.getOne(id); }

  public getAll(limit: number, offset: number): Promise<{ rows: Array<IModule>, count: number }> {
    return super.getAll(limit, offset);
  }

  public filter(
    attributes: Array<IAttributeChange>,
    filters: IAndOrFilter,
    joins: Array<IFromFilterBase>,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ rows: Array<IModule>, count: number }> {
    return super.filter(attributes, filters, joins, limit, offset);
  }

  public addNewItemToArray(
    id: string | number,
    attributeName: string,
    value: any
  ): Promise<IModule> {
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
