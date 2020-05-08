// Develop vmgabriel

/** Filter Structure */
export interface IFilter {
  column: string;
  op: string;
  value: any;
  type?: string;
}

/** And or Data  */
export interface IAndOrFilter {
  and?: Array<IFilter> | IAndOrFilter;
  or?: Array<IFilter> | IAndOrFilter;
  condition?: string;
}

/** Change attribute  */
export interface IAttributeChange {
  column: string;
  as: string;
}
