// Develop vmgabriel

// Libraries
import * as mongoose from 'mongoose';
import * as R from 'ramda';
const joigoose = require('joigoose')(mongoose);
const joi = require('@hapi/joi');

// Interfaces

// Models
import { AbstractModel } from '../models/abstract';

// Connection
import dbConnection from '../utils/db/mongo';
import {
  IAttributeChange,
  IAndOrFilter,
  IFilter,
  IFromFilterBase
} from '../interfaces/filter';

export class MongoLib<T> {
  protected connection: any;
  protected model: mongoose.Model<any>;

  constructor(
    protected collection: string,
    protected attributeState: string,
    modelData: AbstractModel,
  ) {
    this.connection = dbConnection.mongoConnect();
    delete mongoose.connection.models[collection];

    let data = new mongoose.Schema(joigoose.convert(joi.object(modelData.getData())));
    data.set('timestamps', true);
    this.model = mongoose.model<T & mongoose.Document>(collection, data);
  }

  /**
   * Get Count of Datas in query
   * @param query query to find count of datas
   */
  public count(query: any): Promise<number> {
    return new Promise(async (resolve, reject: any) => {
      try {
        query.countDocuments((err: any, count: number) => {
          if (err) { reject(err); }
          resolve(count);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Get One Data of Database with Id
   * @param id Id to Get
   */
  public getOne(id: string | number): Promise<T> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const idStr = '' + id;
        const data = await this.model.findOne({ _id: idStr });
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Get All Data In Database
   * @param limit Limit of datas
   * @param offset Skip datas
   */
  public getAll(
    limit: number = 10,
    offset: number = 0
  ): Promise<{ rows: Array<T>, count: number }> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const query = this.model.find();
        const count = this.count(this.model.find());
        query.skip(limit * offset);
        query.limit(limit);
        resolve({ rows: await query, count: await count });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Create a Data into dababase
   * @param data Data to Save
   */
  public create(data: any): Promise<T> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        data[this.attributeState] = true;
        const dataToSave = new this.model(data);
        resolve(await dataToSave.save());
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Update Data into database with id
   * @param id Id to Update
   * @param data Data to update
   */
  public update(id: string | number, data: any): Promise<T> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const idStr = '' + id;

        const updated = this.model.findOneAndUpdate(
          {_id: idStr},
          {$set: data},
          {new: false}
        );

        resolve(await updated);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Delete data With Id defined
   * @param id Id data Defined
   */
  public delete(id: string | number): Promise<T> {
    return new Promise((resolve: any, reject: any) => {
      try {
        const value = {
          [this.attributeState]: false,
          deletedAt: new Date()
        };
        resolve(this.update(id, value));
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Get Value Filter comparator with data op and value
   * @param op data operator to convert into database
   * @param value value to compare into dababase
   */
  protected buildfilter(op: string, value: any): string {
    let data = '';
    switch(op) {
      case '=':
        data += `{ "$eq": "${value}" }`;
        break;
      case '!=':
        data += `{ "$ne": "${value}" }`;
        break;
      case '>':
        data += '{ "$gt": "${value}" }';
        break;
      case '<':
        data += '{ "$lt": "${value}" }';
        break;
      case '>=':
        data += '{ "$gte": "${value}" }';
        break;
      case '<=':
        data += '{ "$lte": "${value}" }';
        break;
      case 'like':
        data += `{ "$regex": "${value}", "$options": "gi"}`;
        break;
    }
    return data;
  }

  /**
   * Get Query Valid to Filter query
   * @param data data to query mongo
   */
  protected getQueryValid(data: Array<IFilter>): string {
    if (data.length == 1) {
      return `{ "${data[0].column}": ${this.buildfilter(data[0].op, data[0].value)} }`;
    }
    const [head, ...rest] = data;
    let output = `{ "${head.column}": ${this.buildfilter(head.op, head.value)} }, `;
    output += this.getQueryValid(rest);
    return output;
  }

  /**
   * Build Filter And Or
   * @param type Build type Filterdata
   * @param data Data and, or
   */
  protected buildFilterAndOr(type: string, data: IAndOrFilter | Array<IFilter>): string {
    let output = `"$${type}": [ `;
    output += (Array.isArray(data))
      ? this.getQueryValid(data)
      : `{ ${this.buildFilters(data)} }`
    ;
    output += ' ]';
    return output;
  }

  /**
   * Build Filter of Mongo with query json
   * @param filter filter to convert
   */
  protected buildFilters(filter: IAndOrFilter) {
    let data = '';
    if (filter.hasOwnProperty('and') && filter.hasOwnProperty('or')) {
      this.buildFilterAndOr('and', filter.and);
      data += ',';
      this.buildFilterAndOr('or', filter.or);
    } else {
      data += (filter.hasOwnProperty('and'))
        ? this.buildFilterAndOr('and', filter.and)
        : this.buildFilterAndOr('or', filter.or)
      ;
    }
    return data;
  }

  /**
   * Filter Data of Db
   * @param attributes attributes to get
   * @param filter Filters of compare data
   * @param joins joins get data
   * @param limit limit of dataes to get
   * @param offset skip dates
   */
  public filter(
    attributes: Array<IAttributeChange>,
    filter: IAndOrFilter,
    joins: Array<IFromFilterBase>,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ rows: Array<T>, count: number }> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const dataFilter = `{ ${this.buildFilters(filter)} }`;
        console.log('Data Filter - ', dataFilter);
        const query = this.model.find(JSON.parse(dataFilter));

        if (attributes && attributes.length > 0) {
          for (let attribute of attributes) {
            query.select(attribute.column);
          }
        }

        const count = this.count(this.model.find(JSON.parse(dataFilter)));
        query.skip(offset * limit);
        query.limit(limit);

        resolve({ rows: await query, count: await count });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Convert to Valid Array
   * @param arr array
   */
  protected toValidArray(arr: Array<any>) {
    let data = '[';
    data += R.map((data) => (typeof data === 'string') ? `"${data}"` : `${data}`, arr);
    return data + ']';
  }

  /**
   * Create Data to insert into array into mongo
   * @param data Data to Create
   */
  protected toDataCreate(data: any) {
    let res = [];
    for (let [key, value] of Object.entries(data)) {
      const elem = (typeof value === 'string')
        ? `"${key}": "${value}"`
        : (Array.isArray(value))
          ? `"${key}": ${this.toValidArray(value)}`
          : `"${key}": ${value}`
      ;
      res.push(elem)
    }
    return res;
  }

  /**
   * Create references into array of data of row
   * @param id if of row
   * @param attributeName aytribute to get
   * @param value value to insert
   */
  public addReference(
    id: string | number,
    attributeName: string,
    value: any
  ): Promise<T> {
    return new Promise(async (resolve: any, reject: any) => {
      console.log('value -', value);
      try {
        const idStr = '' + id;
        const dataQuery = (typeof value === 'string')
          ? JSON.parse(`{ "$push": { "${attributeName}": "${value + ''}" } }`)
          : JSON.parse(`{ "$push": { "${attributeName}": { ${this.toDataCreate(value).join(',')} } } }`)
        ;
        const data = this.model.update(
          { _id: idStr },
          dataQuery
        );

        resolve(await data);
      } catch (err) {
        reject(err);
      }
    });
  }


  /**
   * Convert data to valid update data into mongo
   * @param attributeTable Name of Attributo into table
   * @param data data to convert
   */
  protected toDataUpdate(attributeTable: string, data: any) {
    let res = [];
    for (let [key, value] of Object.entries(data)) {
      const elem = (typeof value === 'string')
        ? `"${attributeTable}.$.${key}": '${value}'`
        : (Array.isArray(value))
        ? `"${attributeTable}.$.${key}": ${this.toValidArray(value)}`
        : `"${attributeTable}.$.${key}": ${value}`
      ;
      res.push(elem)
    }
    return res;
  }

  /**
   * Update Reference into row
   * @param id id of row
   * @param idReference if of Reference
   * @param attributeName Name of Attribute of tabla that generate build
   * @param data data to update
   */
  public updateReference(
    id: string | number,
    idReference: string | number,
    attributeName: string,
    data: any
  ): Promise<T> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const idStr = '' + id;
        const idReferenceStr = '' + idReference;

        const query = this.model.updateOne(
          { _id: idStr, [`${attributeName}._id`]: idReferenceStr },
          JSON.parse(`{ "$set": { ${this.toDataUpdate(attributeName, data).join(',')} } }`)
        );

        resolve(await query);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Delete Reference of row
   * @param id id of row
   * @param idReference if of reference to delete
   * @param attributeName name of attribute table that have to delete
   */
  public deleteReference(
    id: string | number,
    idReference: string | number,
    attributeName: string
  ): Promise<T> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const idStr = '' + id;
        const idReferenceStr = '' + idReference;

        let query = `{ "$pull": { "${attributeName}": { "_id": { "$eq": "${idReferenceStr}"`;
        query += '} } } }';
        console.log(query);

        const data = this.model.update(
          {_id: idStr},
          JSON.parse(query)
        );

        resolve(await data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // End Class
}
