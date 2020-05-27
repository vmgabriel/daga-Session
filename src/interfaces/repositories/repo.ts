// Develop vmgabriel

// Interfaces
import {
  IAttributeChange,
  IAndOrFilter,
  IFromFilterBase
} from '../filter';

/** Abstract Role */
export interface IRepo<T> {

  /**
   * Count of data in a query
   * @param query query to find data
   */
  count(query: any): Promise<number>;

  /**
   * Create new value
   * @param data Data to save
   */
  create(data: any): Promise<T>;

  /**
   * Update data
   * @param id id to update
   * @param data data to save
   */
  update(id: string | number, data: any): Promise<T>;

  /**
   * Delete data by id
   * @param id Id of data
   */
  delete(id: string | number): Promise<T>;

  /**
   * Get one data
   * @param id Id to get
   */
  getOne(id: string | number): Promise<T>;

  /**
   * Get all data
   * @param limit limit of data to get
   * @param offset skip data
   */
  getAll(limit: number, offset: number): Promise<{ rows: Array<T>, count: number }>;

  /**
   * Filter Data
   * @param attributes Attribute to save
   * @param filters Filter to Save
   * @param joins joins to get
   * @param limit limit of data to get
   * @param offset skip data
   */
  filter(
    attributes: Array<IAttributeChange>,
    filters: IAndOrFilter,
    joins: Array<IFromFilterBase>,
    limit: number,
    offset: number
  ): Promise<{ rows: Array<T>, count: number }>;

  /**
   * Add New Item into Array of Data Id
   * @param id Id of Data to add into attribute
   * @param attributeName Name of attribute to add
   * @param item Item to Add
   */
  addReference(id: string | number, attributeName: string, item: any): Promise<T>;

  /**
   * Update References of Data into Array By Id of Data Id
   * @param id Id of reference of Context super
   * @param idReferece Id Of reference
   * @param attributeName Name of attribute for Context References
   * @param item Data to Delete
   */
  updateReference(
    id: string | number,
    idReference: string | number,
    attributeName: string,
    data: any
  ): Promise<T>;

  /**
   * Delete Reference of id with id IdReference into attributeName
   * @param id Id of Super context data
   * @param idReferences Id of Reference
   * @param attributeName Name of Attribute to delete
   */
  deleteReference(
    id: string | number,
    idReference: string | number,
    attributeName: string
  ): Promise<T>;

  // End Interface Repo
};
