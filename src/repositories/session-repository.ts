import { Session } from "../domain/types";

export interface SessionRepository {
  /**
   * Retrieves all saved sessions from storage.
   */
  list(): Promise<Session[]>;

  /**
   * Retrieves a single session by its unique ID.
   */
  get(id: string): Promise<Session | null>;

  /**
   * Saves or updates a session.
   */
  save(session: Session): Promise<void>;

  /**
   * Deletes a session by ID.
   */
  delete(id: string): Promise<void>;
}
