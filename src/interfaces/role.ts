// Develop vmgabriel

// Interfaces
import { IAbstract } from './abtract';
import { IModule } from './module';

export const nameTable = 'rol';
export const stateName = 'roleIsValid';
export const foreignRoleModule = 'roleModules';
export const foreignRoleModuleId = 'roleModuleId';

/** Module Role Data  */
export interface IRoleModule {
  roleModuleId: IModule | string,
  roleModulePermission: Array<string>
}

/** Role Interface  */
export interface IRole extends IAbstract {
  roleName: string;
  roleDescription: string;
  roleModules?: Array<IRoleModule>;
  roleIsValid: boolean;
}
