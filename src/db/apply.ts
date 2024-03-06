import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db, sqlite } from "./client";
import kleur from "kleur";

async function applyMigrations() {
  await migrate(db, { migrationsFolder: "drizzle" });
  await sqlite.close();
}

applyMigrations()
  .then(() => {
    console.log(kleur.green("Migrations applied successfully"));
  })
  .catch((error) => {
    console.log(kleur.yellow(" ======= ERROR APPLYING MIGRATIONS ======= "));
    console.log(kleur.yellow(" ======= MESSAGE ======= "));
    console.log(error.message);
    console.log(kleur.yellow(" ======= CAUSE ======= "));
    console.log(error.cause);
    console.log(kleur.yellow(" ======= ERROR APPLYING MIGRATIONS ======= "));
  });
