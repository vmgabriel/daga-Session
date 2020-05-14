// Develop vmgabriel

/** Filter Structure */
export interface IFilter {
  column: string;
  op: string;
  value: any;
  type?: string;
  isId?: true;
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
  name?: string;
  isArray?: boolean;
  inContent?: string;
  comparation?: string;
}

/** Filter from  */
export interface IFromFilterBase {
  name: string;
  joinType?: string;
  unionType?: string;
  onType?: string;
  onValue?: string;
  othersOnValue?: IAndOrFilter;
  default: boolean;
}

/** Frm Filter  */
export interface IFromFilter {
  from: Array<IFromFilterBase>;
}
