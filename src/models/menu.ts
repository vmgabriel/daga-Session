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
      name: this.moduleNameSchema.required(),
      description: this.moduleDescriptionSchema.required(),
      link: this.moduleLinkSchema.required(),
      permission: this.modulePermissionSchema.required()
    };
  }

  /** get Scheme Updated  */
  public getUpdateScheme() {
    return {
      name: this.moduleNameSchema,
      description: this.moduleDescriptionSchema,
      link: this.moduleLinkSchema,
      permission: this.modulePermissionSchema
    };
  }

  /** get Id Scheme  */
  public getIdSchema() {
    return this.moduleIdSchema;
  }

  // End Class
}
