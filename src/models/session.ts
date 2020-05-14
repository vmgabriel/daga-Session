// Develop vmgabriel

// Libraries
const joi = require('@hapi/joi');

// Models
import { AbstractModel } from './abstract';

/** Session Model Base  */
export class SessionModel extends AbstractModel {
  private sessionIdSchema: any;
  private sessionUserNameSchema: any;
  private sessionPasswordSchema: any;

  constructor() {
    super();

    this.sessionIdSchema = joi.string();
    this.sessionUserNameSchema = joi.string().max(100);
    this.sessionPasswordSchema = joi.string().max(100);
  }

  /** get Scheme Created  */
  public getCreateScheme(): any {
    return {
      username: this.sessionUserNameSchema.required(),
      password: this.sessionPasswordSchema.required()
    };
  }

  /** get Scheme Updated  */
  public getUpdateScheme() {
    return {
      username: this.sessionUserNameSchema.required(),
      password: this.sessionPasswordSchema.required()
    };
  }

  /** get Id Scheme  */
  public getIdSchema() {
    return this.sessionIdSchema;
  }

  // End Class
}
