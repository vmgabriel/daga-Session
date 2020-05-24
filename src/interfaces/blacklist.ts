// Develop vmgabriel

// Interfaces
import { IAbstract } from './abtract';

export const nameTable = 'blacklist';
export const stateName = 'blackListIsValid';

/** BlackList Interface  */
export interface IBlackList extends IAbstract {
  blackListToken: string;
  blackListIp: string;
  blackListDateUse: Date;
  blackListIsValid: boolean;
  blackListBrowser: string;
}
