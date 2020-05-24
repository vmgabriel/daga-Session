// Develop vmgabriel

// Interfaces
import { IRepo } from './repo';
import { ISession } from '../session';

/** Session Role Data */
export interface SessionRepo extends IRepo<ISession> {
  /**
   * Compare data of session in database
   * @param dataSession DAta of user and Passwod
   */
  compareSession(
    dataSession: Partial<ISession>
  ): Promise<{ data: string, valid: boolean, session: any }>;

  // End Interface SessionRole
}
