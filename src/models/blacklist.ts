// Develop vmgabriel

// Libraries
const joi = require('@hapi/joi');

// Models
import { AbstractModel } from './abstract';

/** BlackList Model Base  */
export class BlackListModel extends AbstractModel {
  private blackListId: any;
  private blackListTokenSchema: any;
  private blackListIpSchema: any;

  constructor() {
    super();

    this.blackListId = joi.string();
    this.blackListTokenSchema = joi.string().max(100);
    this.blackListIpSchema = joi.string().max(50);
  }

  /** get Scheme Created  */
  public getCreateScheme(): any {
    return {
      blackListToken: this.blackListTokenSchema.required(),
      blackListIp: this.blackListIpSchema.required()
    };
  }

  /** get Scheme Updated  */
  public getUpdateScheme() {
    return {
      blackListToken: this.blackListTokenSchema,
      blackListIp: this.blackListIpSchema
    };
  }

  /** get Id Scheme  */
  public getIdSchema() {
    return this.blackListId;
  }

  // End Class
}
