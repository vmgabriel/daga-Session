// Develop vmgabriel

// Interfaces
import { IAbstract } from './abtract';

export const nameTable = 'session';
export const stateName = 'sessionIsValid';

/** Session Interface  */
export interface ISession extends IAbstract {
  sessionUserName: string;
  sessionPassword: string;
  sessionRole: string; // Roles
  sessionIsVerifyEmail: boolean;
  sessionIsValid: boolean;
  sessionBlackList: Array<string>; //BlackList
}

export const attributesWithoutPass = [
  {
    column: 'sessionUserName',
    as: ''
  },
  {
    column: 'sessionRole',
    as: ''
  },
  {
    column: 'sessionIsVerifyEmail',
    as: ''
  },
  {
    column: 'sessionIsValid',
    as: ''
  },
  {
    column: 'sessionBlackList',
    as: ''
  },
];
