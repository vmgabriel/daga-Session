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
  private moduleMetaInfo: any
  private moduleIsValid: any;

  constructor() {
    super();

    this.moduleId = joi.string();
    this.moduleNameSchema = joi.string().max(80);
    this.moduleDescriptionSchema = joi.string().max(200);
    this.moduleIsValid = joi.boolean();
    this.moduleMetaInfo = joi.any();
  }

  /** get Scheme Created  */
  public getCreateScheme(): any {
    return {
      moduleName: this.moduleNameSchema.required(),
      moduleDescription: this.moduleDescriptionSchema.required(),
      moduleMetaInfo: this.moduleMetaInfo
    };
  }

  /** get Scheme Updated  */
  public getUpdateScheme() {
    return {
      moduleName: this.moduleNameSchema,
      moduleDescription: this.moduleDescriptionSchema,
      moduleMetaInfo: this.moduleMetaInfo
    };
  }

  public getData() {
    return {
      moduleName: this.moduleNameSchema.required(),
      moduleDescription: this.moduleDescriptionSchema.required(),
      moduleMetaInfo: this.moduleMetaInfo,
      moduleIsValid: this.moduleIsValid.required(),
      deletedAt: this.deletedAt
    };
  }

  /** get Id Scheme  */
  public getIdSchema() {
    return this.moduleId;
  }

  // End Class
}
