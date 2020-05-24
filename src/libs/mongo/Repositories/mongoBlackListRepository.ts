// Develop vmgabriel

// Connection
import { MongoLib } from '../../mongolib';

// Models
import { BlackListModel } from '../../../models/blacklist';

// interfaces
import { IBlackList, nameTable, stateName } from '../../../interfaces/blacklist';
import { IAttributeChange, IAndOrFilter, IFromFilterBase } from 'src/interfaces/filter';

// - Repositories
import { BlackListRepo } from '../../../interfaces/repositories/blacklistRepo';

export class BlackListMongoRepository extends MongoLib<IBlackList> implements BlackListRepo{
  constructor() {
    super(nameTable, stateName, new BlackListModel());
  }

  public count(query: any): Promise<number> { return super.count(query); }

  public create(data: any): Promise<IBlackList> { return super.create(data); }

  public update(
    id: string | number,
    data: any
  ): Promise<IBlackList> { return super.update(id, data) }

  public delete(id: string | number): Promise<IBlackList> { return super.delete(id); }

  public getOne(id: string | number): Promise<IBlackList> { return super.getOne(id); }

  public getAll(
    limit: number,
    offset: number
  ): Promise<{ rows: Array<IBlackList>, count: number }> {
    return super.getAll(limit, offset);
  }

  public filter(
    attributes: Array<IAttributeChange>,
    filters: IAndOrFilter,
    joins: Array<IFromFilterBase>,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ rows: Array<IBlackList>, count: number }> {
    return super.filter(attributes, filters, joins, limit, offset);
  }

  public addNewItemToArray(
    id: string | number,
    attributeName: string,
    value: any
  ): Promise<IBlackList> {
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
