// Develop vmgabriel

// Libraries
import * as mongoose from 'mongoose';
import * as R from 'ramda';
const joigoose = require('joigoose')(mongoose);
const joi = require('@hapi/joi');

// Interfaces
import { IRepo } from '../interfaces/repositories/repo';
import { IAbstract } from '../interfaces/abtract';

// Models
import { AbstractModel } from '../models/abstract';

// Connection
import dbConnection from '../utils/db/mongo';
import {
  IAttributeChange,
  IAndOrFilter,
  IFilter,
  IFromFilterBase
} from 'src/interfaces/filter';

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

  public update(id: string | number, data: any): Promise<T> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const idStr = '' + id;

        console.log('data - ', data);
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

  public delete(id: string | number): Promise<T> {
    return new Promise((resolve: any, reject: any) => {
      try {
        const value = {
          [this.attributeState]: false,
          deletedAt: new Date()
        };
        console.log('value - ', value);
        resolve(this.update(id, value));
      } catch (err) {
        reject(err);
      }
    });
  }

  private buildfilter(op: string, value: any): string {
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

  private getQueryValid(data: Array<IFilter>): string {
    if (data.length == 1) {
      return `{ ${data[0].column}: ${this.buildfilter(data[0].op, data[0].value)} }`;
    }
    const [head, ...rest] = data;
    let output = `{ ${head.column}: ${this.buildfilter(head.op, head.value)} }, `;
    output += this.getQueryValid(rest);
    return output;
  }

  private buildFilterAndOr(type: string, data: IAndOrFilter | Array<IFilter>): string {
    let output = `"$${type}": [ `;
    output += (Array.isArray(data))
      ? this.getQueryValid(data)
      : `{ ${this.buildFilters(data)} }`
    ;
    output += ' ]';
    return output;
  }

  private buildFilters(filter: IAndOrFilter) {
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
            query.select(attribute);
          }
        }

        const count = this.count(query);
        query.skip(offset * limit);
        query.limit(limit);

        resolve({ rows: await query, count: await count });
      } catch (err) {
        reject(err);
      }
    });
  }

  public reportNewAuth(
    id: string | number,
    attributeName: string,
    value: any
  ): Promise<T> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const idStr = '' + id;
        const data = this.model.update(
          { _id: idStr },
          JSON.parse(`{ "$push": { ${attributeName}: ${value + ''} } }`)
        );

        resolve(await data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // End Class
}
