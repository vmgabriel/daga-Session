// Develop: vmgabriel

/** Response data Filter  */
export interface IResponseFilterDb {
  query: Array<any> | any,
  count?: Promise<number>;
  status?: string;
  reason?: string;
}
