// Develop vmgabriel

// Libraries
const joi = require('@hapi/joi');

// Models
import { AbstractModel } from './abstract';

// Interfaces
import { nameTable as moduleTable } from '../interfaces/module';

/** Role Model Base  */
export class RoleModel extends AbstractModel {
  private permissions: Array<string>;

  private roleId: any;
  private roleNameSchema: any;
  private roleDescriptionSchema: any;
  private rolePermissionSchema: any;
  private roleisValid: any;
  private roleModuleSchema: any;

  constructor() {
    super();

    this.permissions = [
      'show',
      'edit',
      'create',
      'delete',
      'show me',
      'edit me',
      'create me',
      'delete me'
    ];

    this.roleModuleSchema = {
      roleModuleId: joi.string().meta({ _mongoose: { type: 'ObjectId', ref: moduleTable } }),
      roleModulePermission: joi.array().items(joi.string().valid(...this.permissions)).unique()
    };
    this.roleId = joi.string();
    this.roleNameSchema = joi.string().max(80);
    this.roleDescriptionSchema = joi.string().max(200);
    this.rolePermissionSchema = joi.array().items(joi.object(this.roleModuleSchema)).default([]);
    this.roleisValid = joi.boolean();
  }

  /** get Scheme Created  */
  public getCreateScheme(): any {
    return {
      roleName: this.roleNameSchema.required(),
      roleDescription: this.roleDescriptionSchema.required(),
      roleModules: this.rolePermissionSchema
    };
  }

  /** get Scheme Updated  */
  public getUpdateScheme() {
    return {
      roleName: this.roleNameSchema,
      roleDescription: this.roleDescriptionSchema,
      roleModules: this.rolePermissionSchema
    };
  }

  /** Get Data for sabe into database  */
  public getData() {
    return {
      roleName: this.roleNameSchema.required(),
      roleDescription: this.roleDescriptionSchema.required(),
      roleIsValid: this.roleisValid.required(),
      roleModules: this.rolePermissionSchema,
      deletedAt: this.deletedAt
    };
  }

  /** get Role Module for Role */
  public getRoleModule() {
    return this.roleModuleSchema;
  }

  /** get Id Scheme  */
  public getIdSchema() {
    return this.roleId;
  }

  // End Class
}
