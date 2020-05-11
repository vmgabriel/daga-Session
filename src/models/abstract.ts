// Develop: vmgabriel

/** Abstract Model data  */
export abstract class AbstractModel {

  /** Schema for Create  */
  public abstract getCreateScheme(): any;

  /** Schema for Update  */
  public abstract getUpdateScheme(): any;

  /** Schema for Delete  */
  public abstract  getIdSchema(): any;
}
