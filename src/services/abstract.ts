// Develop vmgabriel

// Model Abstract
import { AbstractModel } from '../models/abstract';

// Interfaces
import { IAttributeChange, IAndOrFilter } from '../interfaces/filter';
import { IAbstract } from 'src/interfaces/abtract';

// Repository
import { MongoLib } from '../libs/mongolib';

/** Abstract Class  */
export abstract class AbstractService {
  /**
   * Get Abstract Service for common methods
   * @param collection Get name of Collection
   */
  constructor(
    public collection: string,
    public schema: AbstractModel,
    protected attributeState: string,
    protected connection: MongoLib<IAbstract>
  ) {}

  /**
   * Get All data
   * @param limit limit of datas
   * @param offset page of data
   */
  public getAll(
    limit: number = 10,
    offset: number = 0
  ): Promise<{ code: number, count: number, rows: Array<IAbstract> }> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const { rows, count } = await this.connection.getAll(
          limit,
          offset
        );

        const message = {
          code: 200,
          count,
          rows
        };

        resolve(message);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Get One Data
   * @param id id of Data
   */
  public getOne(id: string | string): Promise<{ code: number, rows: Array<IAbstract> }> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const rows = await this.connection.getOne(id);

        let message = {
          code: 400,
          rows
        };

        if (!!rows) {
          message.code = 200;
        }

        resolve(message);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Get data filtered
   * @param attributes attributes to get
   * @param filter filter of data
   * @param limit limit of page
   * @param offset page
   */
  public filter(
    attributes: Array<IAttributeChange>,
    filter: IAndOrFilter,
    limit: number = 10,
    offset: number = 0) {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const { rows, count } = await this.connection.filter(
          attributes,
          filter,
          [],
          limit,
          offset
        );

        const message = {
          code: 200,
          count,
          rows
        };

        resolve(message);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Create data
   * @param data data to create
   */
  public create(data: any) {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const rows = await this.connection.create(
          data
        );
        const message = {
          code: 201,
          rows,
          message: 'Create Correctly'
        };

        resolve(message);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Update data with id selected
   * @param id id of document to update
   * @param data data to update
   */
  public update(id: string | number, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const rows = await this.connection.update(
          id,
          data
        );

        if (!!rows) {
          const message = {
            code: 200,
            rows,
            message: 'Update Correctly'
          };

          resolve(message);
        } else {
          resolve({ code: 400, message: 'Data not Updated' });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Delete data of database
   * @param id id of documento to delete
   */
  public delete(id: string) {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const rows = await this.connection.delete(
          id
        );

        console.log('rows - ', rows);
        resolve({ code: 200, message: 'Delete Correctly', rows });
      } catch (err) {
        reject(err);
      }
    });
  }

  // End Class
}
