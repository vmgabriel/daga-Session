// Develop vmgabriel

// Connection
import { MongoLib } from '../../mongolib';

// Models
import { SessionModel } from '../../../models/session';

// interfaces
import { ISession, nameTable, stateName } from '../../../interfaces/session';
import { IAttributeChange, IAndOrFilter, IFromFilterBase } from 'src/interfaces/filter';

// - Repositories
import { SessionRepo } from '../../../interfaces/repositories/sessionRepo';

// Compare Password
import { encrypt, compare } from '../../../utils/auth/passwordAuth';

export class SessionMongoRepository extends MongoLib<ISession> implements SessionRepo{
  constructor() {
    super(nameTable, stateName, new SessionModel());
  }

  public count(query: any): Promise<number> { return super.count(query); }

  public async create(data: any): Promise<ISession> {
    try {
      data.sessionPassword = await encrypt(data.sessionPassword);
      return super.create(data);
    } catch (err) {
      throw err;
    }
  }

  public update(
    id: string | number,
    data: any
  ): Promise<ISession> { return super.update(id, data) }

  public delete(id: string | number): Promise<ISession> { return super.delete(id); }

  public getOne(id: string | number): Promise<ISession> { return super.getOne(id); }

  public getAll(
    limit: number,
    offset: number
  ): Promise<{ rows: Array<ISession>, count: number }> {
    return super.getAll(limit, offset);
  }

  public filter(
    attributes: Array<IAttributeChange>,
    filters: IAndOrFilter,
    joins: Array<IFromFilterBase>,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ rows: Array<ISession>, count: number }> {
    return super.filter(attributes, filters, joins, limit, offset);
  }

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

  public addNewItemToArray(
    id: string | number,
    attributeName: string,
    value: any
  ): Promise<ISession> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const data = super.reportNewAuth(id, attributeName, value);
        resolve(await data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Export Class
}
