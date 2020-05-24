// Develop: vmgabriel

/** Response data Filter  */
export interface IResponseFilterDb {
  query: Array<any> | any; // datos
  count?: Promise<number>;
  status?: string; // sucess - failed
  reason?: string; // fdsfadfafdsfafa
}
