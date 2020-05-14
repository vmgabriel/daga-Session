// Develop vmgabriel

// Interfaces
import { IModule } from './module';

/** Role Interface  */
export interface IRole {
  roleId: string;
  roleName: string;
  roleDescription: string;
  roleModules: Array<IModule>;
  roleIsValid: boolean;
}
