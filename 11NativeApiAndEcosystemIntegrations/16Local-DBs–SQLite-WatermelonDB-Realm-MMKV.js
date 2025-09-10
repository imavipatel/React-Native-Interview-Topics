// 📂 local-dbs-notes.js
// Notes on Local Databases in React Native (New Architecture Ready)

///////////////////////////////////////////
// 1. Why Local DBs in Mobile Apps?
///////////////////////////////////////////
/**
 * - Store data offline (user sessions, cache, large datasets).
 * - Sync with server when online (offline-first).
 * - Optimize read/write speed compared to AsyncStorage.
 * - Some support advanced queries & relationships.
 * - Common use cases:
 *   - Chat apps
 *   - Offline forms
 *   - Caching API responses
 *   - Local analytics
 */

///////////////////////////////////////////
// 2. SQLite (react-native-sqlite-storage / Expo SQLite)
///////////////////////////////////////////
/**
 * - Lightweight SQL database (tables, rows, queries).
 * - Works across Android & iOS.
 * - Good for structured relational data.
 * - Downsides:
 *   - Verbose API
 *   - Manual schema management
 */

import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("mydb.db");

db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT);"
  );
  tx.executeSql("INSERT INTO users (name) values (?)", ["Avi"]);
  tx.executeSql("SELECT * FROM users", [], (_, { rows }) => {
    console.log("Users:", rows._array);
  });
});

///////////////////////////////////////////
// 3. WatermelonDB
///////////////////////////////////////////
/**
 * - Offline-first DB built on top of SQLite.
 * - Optimized for React Native (high performance with lazy loading).
 * - Syncs with remote backend (great for offline-first apps).
 * - JSI bridge → much faster than old RN bridge.
 * - Uses schema + Models + Observables.
 */

import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { appSchema, tableSchema } from "@nozbe/watermelondb";

const adapter = new SQLiteAdapter({
  schema: appSchema({
    version: 1,
    tables: [
      tableSchema({
        name: "users",
        columns: [{ name: "name", type: "string" }],
      }),
    ],
  }),
});

const database = new Database({
  adapter,
  modelClasses: [],
  actionsEnabled: true,
});

///////////////////////////////////////////
// 4. Realm (MongoDB Realm)
///////////////////////////////////////////
/**
 * - Object-oriented DB (no SQL).
 * - Supports relationships, live queries, sync with MongoDB Atlas.
 * - Cross-platform (iOS, Android, RN).
 * - Built on JSI (New Arch compatible).
 * - Best for real-time apps.
 */

import Realm from "realm";

class User extends Realm.Object {}
User.schema = {
  name: "User",
  properties: {
    _id: "int",
    name: "string",
  },
  primaryKey: "_id",
};

const realm = await Realm.open({ schema: [User] });

realm.write(() => {
  realm.create("User", { _id: 1, name: "Avi" });
});

const users = realm.objects("User");
console.log(
  "Users:",
  users.map((u) => u.name)
);

///////////////////////////////////////////
// 5. MMKV (react-native-mmkv)
///////////////////////////////////////////
/**
 * - Ultra-fast key-value storage (based on Tencent's MMKV).
 * - Built on JSI → No Bridge overhead.
 * - Replacement for AsyncStorage.
 * - Best for small data (tokens, flags, settings).
 * - Not relational, no queries.
 */

import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

// Write
storage.set("token", "abcd1234");

// Read
const token = storage.getString("token");
console.log("Stored token:", token);

// Delete
storage.delete("token");

///////////////////////////////////////////
// 6. Choosing the Right DB
///////////////////////////////////////////
/**
 * ✅ SQLite → Lightweight relational DB (structured, SQL queries).
 * ✅ WatermelonDB → Offline-first sync + SQLite under the hood.
 * ✅ Realm → Rich object DB, real-time, sync with MongoDB Atlas.
 * ✅ MMKV → Ultra-fast key-value storage (best replacement for AsyncStorage).
 *
 * ⚠️ Best practice: Use combination
 *   - MMKV → small data (tokens, flags, prefs)
 *   - Realm / WatermelonDB → large, structured data
 */

///////////////////////////////////////////
// 7. Best Practices (New Architecture)
///////////////////////////////////////////
/**
 * 1. Prefer JSI-based DBs (Realm, MMKV, WatermelonDB) for perf.
 * 2. Keep schemas versioned (SQLite, WatermelonDB, Realm).
 * 3. Use migration strategies when schema changes.
 * 4. Secure sensitive data:
 *    - Encrypt DB (SQLite cipher / Realm encryption).
 *    - Store keys in Keystore/Keychain.
 * 5. Batch writes instead of multiple single writes.
 * 6. On Android 11+, store DBs in app-specific storage (scoped storage).
 */

export { db, database, realm, storage };

///////////////////////////////////////////
// 8. Comparison Table (SQLite vs WatermelonDB vs Realm vs MMKV)
///////////////////////////////////////////
/**
 * | Feature             | SQLite                           | WatermelonDB                      | Realm (MongoDB)                  | MMKV                         |
 * |---------------------|----------------------------------|-----------------------------------|----------------------------------|------------------------------|
 * | Type                | Relational (SQL)                | ORM on top of SQLite              | Object-oriented DB               | Key-Value storage            |
 * | Bridge              | Legacy Bridge (slow)            | JSI (fast)                        | JSI (fast)                       | JSI (ultra-fast)             |
 * | Schema              | Manual                          | Schema + Models                   | Automatic with schema            | No schema (KV only)          |
 * | Queries             | SQL                             | JS API + Observables              | Live Objects & Queries           | Key-based get/set            |
 * | Offline Sync        | Manual                          | Built-in support (sync adapters)  | MongoDB Realm Sync               | ❌                          |
 * | Best Use Case       | Structured relational data       | Offline-first apps, sync-heavy    | Real-time apps, rich relations   | Tokens, settings, small data |
 * | Perf (RN New Arch)  | ❌ (Bridge overhead)             | ✅ JSI optimized                   | ✅ JSI optimized                  | 🚀 Blazing fast (JSI)        |
 */
