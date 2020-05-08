// Develop vmgabriel

// Libraries
const joi = require('@hapi/joi');

export class FilterModel {

  private attributesSchema: object;
  private filterItemSchema: object;
  private filterAttributesSchema: any;
  private filterSchema: any;

  constructor() {
    this.filterItemSchema = {
      column: joi.string().min(2).max(40).required(),
      op: joi.string().min(1).max(20).required(),
      value: joi.any().empty().required(),
      type: joi.string()
    };

    this.attributesSchema = {
      column: joi.string().min(2).max(40).required(),
      as: joi.string().min(1).max(49)
    };

    this.filterAttributesSchema = joi.array().items(joi.object(this.attributesSchema));

    this.filterSchema = joi.object({
      and: joi.any(),
      or: joi.any(),
      condition: joi.string()
    });
  }

  public getFilterAttributesScheme(): any {
    return {
      attribute: this.filterAttributesSchema
    };
  }

  public getFilterScheme(): any {
    return this.filterSchema;
  }
}
