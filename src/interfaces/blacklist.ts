// Develop vmgabriel

/** BlackList Interface  */
export interface IBlackList {
  blackListId: string;
  blackListToken: string;
  blackListIp: string;
  blackListDateUse: Date;
  blackListIsValid: boolean;
  blackListBrowser: string;
}
