const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../jorshor.db');
const schemaPath = path.resolve(__dirname, '../../database/schema_sqlite.sql');
const seedPath = path.resolve(__dirname, '../../database/seed_sqlite.sql');

let db;

const initDb = async () => {
    const dbExists = fs.existsSync(dbPath);
    
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Enable WAL mode for better concurrency
    await db.run('PRAGMA journal_mode=WAL');
    await db.run('PRAGMA foreign_keys=ON');

    if (!dbExists) {
        console.log('📦 Initializing new SQLite database...');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        const seed = fs.readFileSync(seedPath, 'utf8');
        
        await db.exec(schema);
        await db.exec(seed);
        console.log('✅ SQLite schema and seed data loaded.');
    } else {
        console.log('📦 Using existing SQLite database.');
    }
};

const query = async (sql, params) => {
    if (!db) await initDb();
    
    try {
        const trimmedSql = sql.trim().toUpperCase();

        // Handle transaction control statements via exec (no params)
        if (
            trimmedSql === 'BEGIN' ||
            trimmedSql === 'COMMIT' ||
            trimmedSql === 'ROLLBACK'
        ) {
            await db.run(sql);
            return [{ affectedRows: 0, changes: 0, insertId: null }, null];
        }

        if (trimmedSql.startsWith('SELECT') || trimmedSql.startsWith('PRAGMA')) {
            // Normalize params: undefined if empty
            const rows = await db.all(sql, params && params.length > 0 ? params : undefined);
            return [rows, null];
        } else {
            const result = await db.run(sql, params && params.length > 0 ? params : undefined);
            const mockResult = {
                insertLastID: result.lastID,
                insertId: result.lastID,
                affectedRows: result.changes,  // map SQLite 'changes' → 'affectedRows'
                changes: result.changes
            };
            return [mockResult, null];
        }
    } catch (error) {
        console.error('SQL Error:', sql, params, error.message);
        throw error;
    }
};

const execute = query; // Match mysql2 pool.execute API signature

const testConnection = async () => {
    if (!db) await initDb();
    console.log('✅ SQLite connected successfully at:', dbPath);
};

module.exports = {
    query,
    execute,
    testConnection,
    initDb
};
