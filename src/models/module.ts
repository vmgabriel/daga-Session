// Develop vmgabriel

// Libraries
const joi = require('@hapi/joi');

// Models
import { AbstractModel } from './abstract';

/** Module Model Base  */
export class ModuleModel extends AbstractModel {
  private moduleId: any;
  private moduleNameSchema: any;
  private moduleDescriptionSchema: any;

  constructor() {
    super();

    this.moduleId = joi.string();
    this.moduleNameSchema = joi.string().max(80);
    this.moduleDescriptionSchema = joi.string().max(200);
  }

  /** get Scheme Created  */
  public getCreateScheme(): any {
    return {
      moduleName: this.moduleNameSchema.required(),
      moduleDescription: this.moduleDescriptionSchema.required()
    };
  }

  /** get Scheme Updated  */
  public getUpdateScheme() {
    return {
      moduleName: this.moduleNameSchema,
      moduleDescription: this.moduleDescriptionSchema
    };
  }

  /** get Id Scheme  */
  public getIdSchema() {
    return this.moduleId;
  }

  // End Class
}
