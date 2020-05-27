// Develop vmgabriel

// Libraries
const joi = require('@hapi/joi');

// Models
import { AbstractModel } from './abstract';

import { nameTable as roleTable } from '../interfaces/role';
import { nameTable as blackListTable } from '../interfaces/blacklist';

/** Session Model Base  */
export class SessionModel extends AbstractModel {
  private sessionIdSchema: any;
  private sessionUserNameSchema: any;
  private sessionPasswordSchema: any;
  private sessionRoleSchema: any;
  private sessionIsVerifyEmailSchema: any;
  private sessionIsValidSchema: any;
  private sessionBlackListSchema: any;

  constructor() {
    super();

    this.sessionIdSchema = joi.string();
    this.sessionUserNameSchema = joi.string().max(100);
    this.sessionPasswordSchema = joi.string().max(100);
    this.sessionRoleSchema = joi.string().meta({
      _mongoose: { type: 'ObjectId', ref: roleTable }
    });
    this.sessionIsVerifyEmailSchema = joi.boolean();
    this.sessionIsValidSchema = joi.boolean();
    this.sessionBlackListSchema = joi.array()
      .items(joi.string().meta({ _mongoose: { type: 'ObjectId', ref: blackListTable } }))
      .unique();
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

  /** Get data of Session  */
  public getData() {
    return {
      sessionUserName: this.sessionUserNameSchema.required(),
      sessionPassword: this.sessionPasswordSchema.required(),
      sessionRole: this.sessionRoleSchema.required(),
      sessionIsVerifyEmailSchema: this.sessionIsVerifyEmailSchema.required(),
      sessionIsValid: this.sessionIsValidSchema.required(),
      sessionBlackList: this.sessionBlackListSchema,
      deletedAt: this.deletedAt
    };
  }
  /** get Id Scheme  */
  public getIdSchema() {
    return this.sessionIdSchema;
  }

  // End Class
}
