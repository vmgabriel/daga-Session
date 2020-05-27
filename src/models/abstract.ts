// Develop: vmgabriel

// Libraries
const Joi = require('@hapi/joi');

/** Abstract Model data  */
export abstract class AbstractModel {
  protected deletedAt: any;

  constructor() {
    this.deletedAt = Joi.date();
  }

  /** Schema for Create  */
  public abstract getCreateScheme(): any;

  /** Schema for Update  */
  public abstract getUpdateScheme(): any;

  /** Schema for Delete  */
  public abstract  getIdSchema(): any;

  /** Get Data of AbstractModel  */
  public abstract getData(): any;
}
