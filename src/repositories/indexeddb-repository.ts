import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Session } from "../domain/types";
import { SessionRepository } from "./session-repository";

interface SplitifyDB extends DBSchema {
  sessions: {
    key: string;
    value: Session;
    indexes: { "by-updatedAt": string };
  };
}

const DB_NAME = "splitify-db";
const DB_VERSION = 1;

export class IndexedDBSessionRepository implements SessionRepository {
  private dbPromise: Promise<IDBPDatabase<SplitifyDB>> | null = null;

  private getDB(): Promise<IDBPDatabase<SplitifyDB>> {
    if (!this.dbPromise) {
      this.dbPromise = openDB<SplitifyDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("sessions")) {
            const store = db.createObjectStore("sessions", { keyPath: "id" });
            store.createIndex("by-updatedAt", "updatedAt");
          }
        },
      });
    }
    return this.dbPromise;
  }

  async list(): Promise<Session[]> {
    const db = await this.getDB();
    const sessions = await db.getAllFromIndex("sessions", "by-updatedAt");
    return sessions.reverse(); // Return newest first
  }

  async get(id: string): Promise<Session | null> {
    const db = await this.getDB();
    const session = await db.get("sessions", id);
    return session || null;
  }

  async save(session: Session): Promise<void> {
    const db = await this.getDB();
    const updatedSession: Session = {
      ...session,
      updatedAt: new Date().toISOString(),
    };
    await db.put("sessions", updatedSession);
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete("sessions", id);
  }
}

// In-Memory Repository Fallback for testing environments
export class InMemorySessionRepository implements SessionRepository {
  private sessions = new Map<string, Session>();

  async list(): Promise<Session[]> {
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async get(id: string): Promise<Session | null> {
    return this.sessions.get(id) || null;
  }

  async save(session: Session): Promise<void> {
    const updated = { ...session, updatedAt: new Date().toISOString() };
    this.sessions.set(session.id, updated);
  }

  async delete(id: string): Promise<void> {
    this.sessions.delete(id);
  }
}
