// Develop vmgabriel

// Libraries
const joi = require('@hapi/joi');

// Models
import { AbstractModel } from './abstract';

/** Role Model Base  */
export class RoleModel extends AbstractModel {
  private permissions: Array<string>;

  private roleId: any;
  private roleNameSchema: any;
  private roleDescriptionSchema: any;
  private rolePermissionSchema: any;

  constructor() {
    super();

    this.permissions = [
      'show',
      'edit',
      'create',
      'delete'
    ];

    this.roleId = joi.string();
    this.roleNameSchema = joi.string().max(80);
    this.roleDescriptionSchema = joi.string().max(200);
    this.rolePermissionSchema = joi.array().items(joi.object({
      roleModuleId: joi.string(),
      roleModulePermission: joi.array().items(joi.string().valid(...this.permissions)).unique()
    }));
  }

  /** get Scheme Created  */
  public getCreateScheme(): any {
    return {
      roleName: this.roleNameSchema.required(),
      roleDescription: this.roleDescriptionSchema.required()
    };
  }

  /** get Scheme Updated  */
  public getUpdateScheme() {
    return {
      roleName: this.roleNameSchema,
      roleDescription: this.roleDescriptionSchema
    };
  }

  /** get Id Scheme  */
  public getIdSchema() {
    return this.roleId;
  }

  // End Class
}
