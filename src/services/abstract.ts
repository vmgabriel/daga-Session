// Develop vmgabriel

// Model Abstract
import { AbstractModel } from '../models/abstract';

// Librarie of Connection
import { CouchLib } from '../libs/couchlib';

// Interfaces
import { IResponseFilterDb } from '../interfaces/db-response';
import { IAttributeChange, IAndOrFilter } from '../interfaces/filter';

/** Abstract Class  */
export abstract class AbstractService {
  protected connection: CouchLib;

  /**
   * Get Abstract Service for common methods
   * @param collection Get name of Collection
   */
  constructor(
    public collection: string,
    public schema: AbstractModel,
    protected attributeState: string
  ) {
    this.connection = new CouchLib();
  }

  /**
   * Get All data
   * @param limit limit of datas
   * @param offset page of data
   */
  public getAll(limit: number = 10, offset: number = 0): Promise<any> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const { query, count }: IResponseFilterDb = await this.connection.getAll(
          this.collection,
          this.attributeState,
          limit,
          offset
        );
        const length = await count;

        const message = {
          code: 200,
          count: length,
          rows: query
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
  public getOne(id: string) {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const { query, status, reason } = await this.connection.getOne(
          this.collection,
          this.attributeState,
          id
        );

        let message = {
          code: 400,
          row: query,
          message: reason
        };

        if (status === 'sucess') {
          message.code = 200;
          delete message.message;
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
        const { query, count }: IResponseFilterDb = await this.connection.filter(
          this.collection,
          this.attributeState,
          attributes,
          filter,
          limit,
          offset
        );
        const length = await count;

        const message = {
          code: 200,
          count: length,
          rows: query
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
        const { query } = await this.connection.insertOne(
          this.collection,
          this.attributeState,
          data
        );
        const message = {
          code: 201,
          rows: query,
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
  public update(id: string, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const { query, status, reason } = await this.connection.updateOne(
          this.collection,
          this.attributeState,
          data,
          id
        );

        if (status === 'sucess') {
          const message = {
            code: 200,
            rows: query,
            message: 'Update Correctly'
          };

          resolve(message);
        } else {
          resolve({ code: 400, message: reason });
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
        const { query, status, reason } = await this.connection.deleteOne(
          this.collection,
          id,
          this.attributeState
        );

        if (status === 'failed') {
          resolve({ code: 400, message: reason });
        } else {
          resolve({ code: 200, message: 'Delete Correctly', rows: query });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  // End Class
}
