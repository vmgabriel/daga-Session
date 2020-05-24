// Develop vmgabriel

// Interfaces
import { IAbstract } from './abtract';

export const nameTable = 'rol';
export const stateName = 'roleIsValid';

/** Role Interface  */
export interface IRole extends IAbstract {
  roleName: string;
  roleDescription: string;
  roleModules?: Array<{ rolemoduleId: string, roleModulePermission: Array<string> }>;
  roleIsValid: boolean;
}
