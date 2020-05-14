// Develop vmgabriel

// Libraries
const joi = require('@hapi/joi');

/** Class for Filter Model  */
export class FilterModel {
  private attributesSchema: object;
  // private filterItemSchema: object;
  private filterAttributesSchema: any;
  private filterSchema: any;

  constructor() {
    // this.filterItemSchema = {
    //   column: joi.string().min(2).max(40).required(),
    //   op: joi.string().min(1).max(20).required(),
    //   value: joi.any().empty().required(),
    //   type: joi.string()
    // };

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

  /** Get Schema for filter Attributes  */
  public getFilterAttributesScheme(): any {
    return {
      attributes: this.filterAttributesSchema
    };
  }

  /** Get Filter Schema  */
  public getFilterScheme(): any {
    return {
      filters: this.filterSchema
    };
  }

  /** get Attributes and filter data  */
  public getAttributeAndFilter(): any {
    return {
      attributes: this.filterAttributesSchema,
      filters: this.filterSchema.required()
    };
  }

  // End Class
}
