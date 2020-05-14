// Develop vmgabriel

// Interfaces
import { IRole } from './role';
import { IBlackList } from './blacklist';

/** Session Interface  */
export interface ISession {
  sessionId: string;
  sessionUserName: string;
  sessionPassword: string;
  sessionRole: IRole; // Roles
  sessionIsVerifyEmail: boolean;
  sessionIsValid: boolean;
  sessionBlackList: Array<IBlackList>; //BlackList
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
