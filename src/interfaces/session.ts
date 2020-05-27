// Develop vmgabriel

// Interfaces
import { IAbstract } from './abtract';
import { IBlackList } from './blacklist';
import { IRole } from './role';

export const nameTable = 'session';
export const stateName = 'sessionIsValid';
export const foreignNameBlackList = 'sessionBlackList';
export const foreignNameRole = 'sessionRole';

/** Session Interface  */
export interface ISession extends IAbstract {
  sessionUserName: string;
  sessionPassword: string;
  sessionRole: IRole | string; // Roles
  sessionIsVerifyEmail: boolean;
  sessionIsValid: boolean;
  sessionBlackList: Array<string | IBlackList>; //BlackList
  _id: string | number;
}

/** Data without Password  */
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
