// Develop vmgabriel

// Libraries
const joi = require('@hapi/joi');

// Models
import { AbstractModel } from './abstract';

/** Module Model Base  */
export class ModuleModel extends AbstractModel {
  private permissions: Array<string>;

  private moduleIdSchema: any;
  private moduleNameSchema: any;
  private moduleDescriptionSchema: any;
  private moduleLinkSchema: any;
  private modulePermissionSchema: any;

  constructor() {
    super();
    this.permissions = [
      'show',
      'edit',
      'create',
      'delete'
    ];

    this.moduleIdSchema = joi.string();
    this.moduleNameSchema = joi.string().max(80);
    this.moduleDescriptionSchema = joi.string().max(200);
    this.moduleLinkSchema = joi.string().max(50);
    this.modulePermissionSchema = joi.array().items(
      joi.string().valid(...this.permissions)
    ).unique();
  }

  /** get Scheme Created  */
  public getCreateScheme(): any {
    return {
      moduleName: this.moduleNameSchema.required(),
      moduleDescription: this.moduleDescriptionSchema.required(),
      moduleLink: this.moduleLinkSchema.required(),
      modulePermission: this.modulePermissionSchema.required()
    };
  }

  /** get Scheme Updated  */
  public getUpdateScheme() {
    return {
      moduleName: this.moduleNameSchema,
      moduleDescription: this.moduleDescriptionSchema,
      moduleLink: this.moduleLinkSchema,
      modulePermission: this.modulePermissionSchema
    };
  }

  /** get Id Scheme  */
  public getIdSchema() {
    return this.moduleIdSchema;
  }

  // End Class
}
