/// <reference types="bun-types" />
import Database from "bun:sqlite";
import { and, eq, sql } from "drizzle-orm";
import { BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import { mkdirSync } from "fs";
import { join } from "path";
import { dir } from "../../utils/dir";
import { SessionData, SessionStore, SingleSession } from "../type";
import { session } from "./schema";

export const newSessionStore = <T>(site_id?: string) => {
  const db_path = site_id
    ? dir.data(`/code/${site_id}/site/sqlite`)
    : dir.data(`/sqlite`);

  mkdirSync(db_path, { recursive: true });

  const path = { session: join(db_path, "session.db") };
  const db = {
    session: drizzle(new Database(path.session), { schema: { session } }),
    track: {} as Record<string, BunSQLiteDatabase<Record<string, never>>>,
  };

  db.session.run(sql`
CREATE TABLE IF NOT EXISTS session (
	sid text PRIMARY KEY NOT NULL,
	uid text NOT NULL,
	created_at integer NOT NULL DEFAULT current_timestamp,
	active integer,
	data text NOT NULL,
	expired_at integer
);
CREATE INDEX IF NOT EXISTS expired_at_idx ON session (expired_at);
  `);

  //   const track_ddl = sql`
  // CREATE TABLE track (
  // 	id text PRIMARY KEY NOT NULL,
  // 	created_at integer DEFAULT current_timestamp,
  // 	session_id text,
  // 	url text NOT NULL,
  // 	referer text,
  // 	user_ip text,
  // 	data text,
  // 	tstamp integer DEFAULT current_timestamp
  // );
  // CREATE INDEX session_id ON track (session_id);`;

  const createSingleStore = <E extends SessionData<T>>(data: any) => {
    if (!data) return null;

    const row: SingleSession<E> = {
      ...data,
      destroy() {
        try {
          db.session.delete(session).where(eq(session.sid, row.sid)).run();
          return true;
        } catch (e) {
          console.error(e);
          return false;
        }
      },
      track(arg) {},
    };

    return row;
  };

  return {
    create(data) {
      return createSingleStore(
        db.session
          .insert(session)
          .values({
            uid: data.uid,
            data,
            active: true,
            expired_at: data.expired_at
              ? new Date(data.expired_at * 1000)
              : undefined,
          })
          .returning()
          .get()
      );
    },
    findFirst(arg) {
      return createSingleStore(
        db.session
          .select()
          .from(session)
          .where(
            and(
              ...Object.entries(arg || {}).map(([k, v]) => {
                return eq((session as any)[k], v);
              })
            )
          )
          .get()
      );
    },
    findMany(arg) {
      return db.session
        .select()
        .from(session)
        .where(
          and(
            ...Object.entries(arg || {}).map(([k, v]) => {
              return eq((session as any)[k], v);
            })
          )
        )
        .all()
        .map((e) => createSingleStore(e));
    },
  } as SessionStore<T>;
};
