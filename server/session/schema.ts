import { createId } from "@paralleldrive/cuid2";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { select } from "lib/preset/login/utils/select";

export const session = sqliteTable(
  "session",
  {
    session_id: text("session_id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    created_at: integer("created_at", { mode: "timestamp_ms" }).default(
      new Date()
    ),
    active: integer("active", { mode: "boolean" }),
    data: text("data", { mode: "json" }),
    expired_at: integer("expired_at", { mode: "timestamp_ms" }),
  },
  (table) => {
    return {
      expired_at_idx: index("expired_at_idx").on(table.expired_at),
    };
  }
);

export const track = sqliteTable(
  "track",
  {
    track_id: text("track_id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    created_at: integer("created_at", { mode: "timestamp_ms" }).default(
      new Date()
    ),
    session_id: text("session_id"),
    url: text("url").notNull(),
    referer: text("referer"),
    user_ip: text("user_ip"),
    data: text("data", { mode: "json" }),
    tstamp: integer("tstamp", { mode: "timestamp_ms" }).default(new Date()),
  },
  (table) => {
    return {
      session_id: index("session_id").on(table.session_id),
    };
  }
);
