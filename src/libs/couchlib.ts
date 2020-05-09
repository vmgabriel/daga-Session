// Develop vmgabriel

// Libraries
import * as R from 'ramda';
import * as couchbase from 'couchbase';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

// Configuration
// import config from '../config';

// Connection
import connection from '../utils/db/couch';

// Interfaces
import { IResponseFilterDb } from '../interfaces/db-response';
import { IAttributeChange, IAndOrFilter, IFilter } from '../interfaces/filter';

/** Couch Lib for query and connection  */
export class CouchLib {
  private N1q1Query: any;
  private connect: couchbase.Bucket;
  private bucketName: string;

  private attributeBase: string;

  constructor() {
    connection.initialize();

    this.connect = connection.bucket;
    this.bucketName = connection.getNameBucket();
    this.N1q1Query = couchbase.N1qlQuery;

    this.attributeBase = 't.*, META(t).id';
  }

  /**
   * Get Promise of Count datas in DB
   * @param queryData query to verify data count
   */
  public getCount(queryData: string): Promise<number> {
    const query = `SELECT count(d) count FROM (${queryData}) d`;
    console.log(query);
    const n1Query = this.N1q1Query.fromString(query);
    return new Promise((resolve: any,reject: any) => {
      this.connect.query(n1Query, (err: any, data: any) => {
        if (!!err) { reject(err); }
        const [{ count }] = data;
        resolve(count);
      });
    });
  }

  /**
   * Get All data of DB
   * @param collection Collection to get
   * @param attributeState Attribute State to Validate
   * @param limit Limit of data to Get
   * @param offset Page to get
   */
  public getAll(
    collection: string,
    attributeState: string,
    limit: number,
    offset: number): Promise<IResponseFilterDb> {
    const query =
      `SELECT ${this.attributeBase}
       FROM ${this.bucketName} t
       WHERE type='${collection}' AND t.${attributeState} = true`;
    const n1Query = this.N1q1Query.fromString(
       query + ` LIMIT ${limit} OFFSET ${offset}`
    );
    return new Promise((resolve: any, reject: any) => {
      this.connect.query(n1Query, (err: any, rows: Array<any>) => {
        if (!!err) { reject(err); }
        resolve({ query: rows, count: this.getCount(query), status: 'sucess' });
      });
    });
  }

  /**
   * Convert to attribute valid for specific db
   * @param attributes All of attributes
   */
  private toAttributeValid(attributes: Array<IAttributeChange>): string {
    const getAttribute = (attrib: IAttributeChange): string =>
      `t.${attrib.column} ${attrib.as.split(' ').join('_').split('-').join('_')}`;
    return R.map(getAttribute, attributes).join(',');
  }

  /**
   * Convert to Validation Valid
   * @param validation Data of Validation
   */
  private toValidateValid(validation: IFilter): string {
    const toValueValid = (value: any, type: string, initial: string = '') => {
      const formatDate = 'YYYY-MM-DD HH:mm:ss';
      if (type.toLowerCase() == 'between') {
        if (typeof value == 'number') {
          return `${value[0]} AND ${value[1]}`
        } else {
          return `'${moment(value).format(formatDate)}'
                     AND
                 '${moment(value).format(formatDate)}'`;
        }
      }
      switch(typeof value) {
        case 'string':
          if (type == 'date') {
            return `'${moment(value).format(formatDate)}'`;
          } else {
            return `'${initial}${value}${initial}'`;
          }
        case 'object':
          if (Array.isArray(value)) {
            return `[${value.toString()}]`
          } else {
            return JSON.stringify(value);
          }
        case 'number':
        default:
          return `${value}`;
      }
    };

    const toConditionValid = (condition: string, value: any, type: string) => {
      switch(condition.toLowerCase()) {
        case 'like':
          return `${condition.toUpperCase()} ${toValueValid(value, type, `%`)}`;
        case '=':
        default:
          return `${condition} ${toValueValid(value, type)}`;
      }
    };

    let data = `t.${validation.column}  `;
    data += toConditionValid(validation.op, validation.value, validation.type);
    return data;
  }

  /**
   * Get Data of query is valid
   * @param datas current value of query
   * @param separator sseparator of current query
   */
  private toDataValid(datas: Array<IFilter>, separator: string): string {
    return `( ${R.map(this.toValidateValid, datas).join(' ' + separator + ' ')} )`;
  }

  /**
   * Comparation to data valid
   * @param data dta valid
   * @param separator separator to data valid
   */
  private toCompareValid(data: Array<IFilter> | IAndOrFilter, separator: string): string {
    let st = '';
    if (Array.isArray(data)) {
      st += this.toDataValid(data, separator);
    } else {
      data.condition = separator;
      return `( ${this.toFilterValid(data)} )`;
    }
    return st;
  }

  /**
   * Convert to filter valid
   * @param filters Data to convert
   */
  private toFilterValid(filters: IAndOrFilter): string {
    let data = '';
    if (!!filters.and && !!filters.or) {
      data += this.toCompareValid(filters.and, 'AND');
      data += ' ' + filters.condition + ' ';
      data += this.toCompareValid(filters.or, 'OR');
    } else if(!!filters.and) {
      data += this.toCompareValid(filters.and, 'AND');
    } else if(!!filters.or) {
      data += this.toCompareValid(filters.or, 'OR');
    }
    return data;
  }

  /**
   * Get Data with filter Valid
   * @param collection Collection to filter
   * @param attributeState State of collection for get data not deleted
   * @param attributes All attributes to get
   * @param filter Filter to get data
   * @param limit limit of data to get
   * @param offset page of get data
   */
  public filter(
    collection: string,
    attributeState: string,
    attributes: Array<IAttributeChange>,
    filter: IAndOrFilter,
    limit: number,
    offset: number): Promise<IResponseFilterDb> {
    let query =
      `SELECT META(t).id, ${this.toAttributeValid(attributes)}
       FROM ${this.bucketName} t
       WHERE type='${collection}' AND t.${attributeState} = true`
    ;
    const filt = this.toFilterValid(filter);
    if (filt != '') {
      query += ` AND ${filt}`;
    }

    const n1Query = this.N1q1Query.fromString(
      query + ` LIMIT ${limit} OFFSET ${offset}`
    );
    return new Promise((resolve: any, reject: any) => {
      this.connect.query(n1Query, (err: any, rows: Array<any>) => {
        if (!!err) { reject(err); }
        resolve({ query: rows, count: this.getCount(query), status: 'sucess' });
      });
    });
  }

  /**
   * Get One date by Id
   * @param collection Collection to get Data
   * @param attributeState attribute to filter if exist data
   * @param id id to get
   */
  public getOne(collection: string, attributeState: string, id: string): Promise<IResponseFilterDb> {
    const query =
      `SELECT ${this.attributeBase}
       FROM ${this.bucketName} t
       WHERE type='${collection}' AND META(t).id='${id}' AND t.${attributeState} = true`;
    const n1Query = this.N1q1Query.fromString(query);

    return new Promise((resolve: any, reject: any) => {
      this.connect.query(n1Query, (err: any, rows: Array<any>) => {
        if (!!err) { reject(err); }

        if (rows.length == 0) {
          resolve({ query: [], status: 'failed', reason: 'data not exist' });
        } else {
          resolve({ query: (rows.length == 1) ? rows[0] : [], status: 'sucess' });
        }
      });
    });
  }

  /**
   * Save data in DB
   * @param collection collection where to keep
   * @param data data to keep
   * @param id id to keep
   */
  public async insertOne(
    collection: string,
    attributeState: string,
    data: any): Promise<IResponseFilterDb> {
    let id = uuidv4();
    data.createdAt = data.updatedAt = new Date();
    data[attributeState] = true;
    return new Promise(async (resolve: any, reject: any) => {
        this.connect.upsert(id, { ...data, type: collection }, (err: any, res: any) => {
        if (!!err) { reject(err); }
          resolve({ query: { ...data, id }, status: 'sucess' });
      });
    });
  }

  /**
   * Update data in Database
   * @param collection collection to alter
   * @param data data to update
   * @param id id of data to update data
   */
  public updateOne(collection: string, attributeState: string, data: any, id: string): Promise<IResponseFilterDb> {
    data.updatedAt = new Date();
    return new Promise(async (resolve: any, reject: any) => {
      let { query, status } = await this.getOne(collection, attributeState, id);

      if (status == 'sucess') {
        delete query.id;
        this.connect.replace(id, { ...query, ...data }, (err: any, res: any) => {
          if (!!err) { reject(err); }

          resolve({ query: { ...query, ...data, id }, status: 'sucess' });
        });
      } else {
        resolve({ status: 'failed', reason: 'id not valid' });
      }
    });
  }

  /**
   * Update state to delete in database
   * @param collection collection to alter
   * @param id id to alter
   * @param attributeState state attribute of verify if
   */
  public deleteOne(
    collection: string,
    id: string,
    attributeState: string
  ): Promise<IResponseFilterDb> {
    const dataToUpdate = {
      deleteAt: new Date(),
      [attributeState]: false
    };
    return this.updateOne(collection, attributeState, dataToUpdate, id);
  }

  // public deleteOne(id: string): Promise<any> {
  //   return new Promise((resolve: any, reject: any) => {
  //     this.connect.remove(id, (err, res: any) => {
  //       if (!!err) { reject(err); }
  //       resolve(res);
  //     });
  //   });
  // }

  // End Class CouchLib
}
