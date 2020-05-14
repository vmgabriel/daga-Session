// Develop vmgabriel

/** Module Interface  */
export interface IModule {
  moduleId: string;
  moduleName: string;
  moduleDescription: string;
  moduleLink: string;
  modulePermission: Array<string>;
  moduleIsValid: boolean;
}
