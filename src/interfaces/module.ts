// Develop vmgabriel

// interfaces
import { IAbstract } from './abtract';

export const nameTable = 'module';
export const stateName = 'moduleIsValid';

/** Module Interface  */
export interface IModule extends IAbstract {
  moduleName: string;
  moduleDescription: string;
  moduleIsValid: boolean;
}
