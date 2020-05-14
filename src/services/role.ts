// Develop vmgabriel

// Libraries
import * as R from 'ramda';

// Abstract Service
import { AbstractService } from './abstract';

// Models
import { RoleModel } from '../models/role';

// Interfaces
import { IResponseFilterDb } from '../interfaces/db-response';
import {
  IAttributeChange,
  IAndOrFilter,
  IFromFilter,
} from '../interfaces/filter';

/** Role Service  */
export class RoleService extends AbstractService {
  constructor() {
    super('role', new RoleModel(), 'roleIsValid');
  }

  /**
   * Get Role And Permission Data
   * @param attributes Attributes to get
   * @param filter filter to put
   * @param limit limit of data
   * @param offset offset of data
   */
  public getRoleAndPermissionData(
    attributes: Array<IAttributeChange>,
    filter: IAndOrFilter,
    limit: number = 10,
    offset: number = 0
  ) {
    if (attributes.length > 0) {
      attributes = R.map((d: IAttributeChange) => { return {
        name: 'rol',
        as: d.as,
        column: d.column
      }; }, attributes);
    } else {
      attributes.push({
        as: '',
        name: 'rol',
        column: '*'
      });
    }

    attributes.push({
      as: '',
      name: '',
      column: 'permissions'
    });

    const joins: IFromFilter = {
      from: [
        {
          name: 'rol',
          default: true
        },
        {
          name: 'rolePermission',
          joinType: 'LEFT',
          unionType: 'NEST',
          onType: 'KEYS',
          onValue: 'rol.rolePermission[*].roleModuleId',
          default: false
        }
      ]
    };

    let otherContent = `LET permissions = ARRAY {
        "roleModulePermission": perm.roleModulePermission,
        "roleModuleId": perm.roleModuleId,
        "module": IFNULL(
          FIRST rm FOR rm IN rolePermission
          WHEN META(rm).id = perm.roleModuleId END, MISSING
        )
      } FOR perm IN rol.rolePermission END`;

    return new Promise(async (resolve: any, reject: any) => {
      try {
        const { query, count }: IResponseFilterDb = await this.connection.advancedFilter(
          this.collection,
          this.attributeState,
          attributes,
          joins,
          otherContent,
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

  // End Class
}
