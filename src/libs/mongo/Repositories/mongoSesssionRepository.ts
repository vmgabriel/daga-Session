// Develop vmgabriel

// Libraries
import * as R from 'ramda';

// Connection
import { MongoLib } from '../../mongolib';

// Models
import { SessionModel } from '../../../models/session';

// interfaces
import {
  ISession,
  nameTable,
  stateName,
  foreignNameBlackList,
  foreignNameRole,
  attributesWithoutPass
} from '../../../interfaces/session';
import { IAttributeChange, IAndOrFilter, IFromFilterBase } from '../../../interfaces/filter';
import { foreignRoleModule, foreignRoleModuleId } from '../../../interfaces/role';

// - Repositories
import { SessionRepo } from '../../../interfaces/repositories/sessionRepo';

// Compare Password
import { compare } from '../../../utils/auth/passwordAuth';

/** Repository Session  */
export class SessionMongoRepository extends MongoLib<ISession> implements SessionRepo {
  constructor() {
    super(nameTable, stateName, new SessionModel());
  }

  /**
   * Get All Data
   * @param limit Limit of datas
   * @param offset Skip datas
   */
  public getAll(
    limit: number,
    offset: number
  ): Promise<{ rows: Array<ISession>, count: number }> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        let query = this.model.find();
        query.populate(foreignNameBlackList);
        query.populate({
          path: foreignNameRole,
          populate: { path: foreignRoleModule + '.' + foreignRoleModuleId }
        });

        R.forEach((data: any) => query.select(data.column), attributesWithoutPass);

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
   * Get data filtered
   * @param attributes attributes to get
   * @param filters filters to put into query
   * @param joins joins data
   * @param limit limit of datas
   * @param offset skip data
   */
  public filter(
    attributes: Array<IAttributeChange>,
    filters: IAndOrFilter,
    joins: Array<IFromFilterBase>,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ rows: Array<ISession>, count: number }> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const dataFilter = `{ ${this.buildFilters(filters)} }`;
        const query = this.model.find(JSON.parse(dataFilter));
        query.populate(foreignNameBlackList);
        query.populate({
            path: foreignNameRole,
            populate: { path: foreignRoleModule + '.' + foreignRoleModuleId }
        });

        if (attributes.length > 0) {
          R.forEach((data: any) => query.select(data.column), attributes);
        } else {
          R.forEach((data: any) => query.select(data.column), attributesWithoutPass);
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
   * get One data of database
   * @param id Id of Rows
   */
  public getOne(id: string | number): Promise<ISession> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const idStr = '' + id;
        const query = this.model.findOne({ _id: idStr })
          .populate(foreignNameBlackList)
          .populate({
            path: foreignNameRole,
            populate: { path: foreignRoleModule + '.' + foreignRoleModuleId }
          })
        ;

        R.forEach((d: any) => query.select(d.column), attributesWithoutPass);

        resolve(await query);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Compare Session with data
   * @param dataSession Session to compare
   */
  public compareSession(
    dataSession: Partial<ISession>
  ): Promise<{ data: string, valid: boolean, session: any }> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const attributes = [
          {
            column: 'sessionUserName',
            as: ''
          },
          {
            column: 'sessionPassword',
            as: ''
          }
        ];

        const filter = {
          and: [
            {
              column: 'sessionUserName',
              op: '=',
              value: dataSession.sessionUserName,
              type: 'string'
            }
          ]
        };

        const session = await super.filter(
          attributes,
          filter,
          [],
          1,
          0
        );

        const message = (session.rows.length > 0)
          ? (await compare(dataSession.sessionPassword, session.rows[0].sessionPassword))
          ? { data: 'User and Password is Correct', valid: true, sessionId: session.rows[0].id }
          : { data: 'Password Error', valid: false }
        : { data: 'User not found.', valid: false }
        ;

        resolve(message);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Export Class
}
