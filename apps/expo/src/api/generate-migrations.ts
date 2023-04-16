import crypto from "crypto";
import fs from "fs";

interface MigrationMeta {
  sql: string[];
  folderMillis: number;
  hash: string;
  bps: boolean;
}

export function readMigrationFiles() {
  const migrationFolderTo = "./src/api/migrations";

  const migrationQueries: MigrationMeta[] = [];

  const journalPath = `${migrationFolderTo}/meta/_journal.json`;
  if (!fs.existsSync(journalPath)) {
    throw Error(`Can't find meta/_journal.json file`);
  }

  const journalAsString = fs.readFileSync(`${migrationFolderTo}/meta/_journal.json`).toString();

  const journal = JSON.parse(journalAsString) as {
    entries: { idx: number; when: number; tag: string; breakpoints: boolean }[];
  };

  for (const journalEntry of journal.entries) {
    const migrationPath = `${migrationFolderTo}/${journalEntry.tag}.sql`;

    try {
      const query = fs.readFileSync(`${migrationFolderTo}/${journalEntry.tag}.sql`).toString();

      const result = query.split("--> statement-breakpoint").map((it) => {
        return it;
      });

      migrationQueries.push({
        sql: result,
        bps: journalEntry.breakpoints,
        folderMillis: journalEntry.when,
        hash: crypto.createHash("sha256").update(query).digest("hex"),
      });
    } catch (e) {
      throw Error(`No file ${migrationPath} found in ${migrationFolderTo} folder`);
    }
  }

  fs.writeFile("./src/api/migrations.json", JSON.stringify({ entries: migrationQueries }), function (err) {
    if (err) throw err;
    console.log("[Drizzle-ORM] Successfully generated migrations.json");
  });
}

readMigrationFiles();
