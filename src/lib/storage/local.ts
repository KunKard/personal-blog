import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function generateId(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // already exists
  }
}

async function readTable<T>(table: string): Promise<T[]> {
  await ensureDir();
  const file = path.join(DATA_DIR, `${table}.json`);
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeTable<T>(table: string, data: T[]): Promise<void> {
  await ensureDir();
  const file = path.join(DATA_DIR, `${table}.json`);
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

export interface QueryFilter {
  eq?: Row;
  order?: { column: string; ascending: boolean };
  limit?: number;
}

function applyFilters<T extends Row>(rows: T[], filter: QueryFilter): T[] {
  let result = [...rows];

  if (filter.eq) {
    for (const [key, value] of Object.entries(filter.eq)) {
      result = result.filter((row) => row[key] === value);
    }
  }

  if (filter.order) {
    const col = filter.order.column;
    result.sort((a, b) => {
      const va = a[col] ?? "";
      const vb = b[col] ?? "";
      const cmp = String(va).localeCompare(String(vb));
      return filter.order!.ascending ? cmp : -cmp;
    });
  }

  if (filter.limit !== undefined) {
    result = result.slice(0, filter.limit);
  }

  return result;
}

export const localStore = {
  async findMany<T extends Row>(
    table: string,
    filter?: QueryFilter
  ): Promise<T[]> {
    const rows = await readTable<T>(table);
    if (!filter) return rows;
    return applyFilters(rows, filter);
  },

  async findOne<T extends Row>(
    table: string,
    filter: QueryFilter
  ): Promise<T | null> {
    const rows = await readTable<T>(table);
    const filtered = applyFilters(rows, { eq: filter.eq });
    return filtered[0] ?? null;
  },

  async insert<T extends Row>(
    table: string,
    input: Row
  ): Promise<T> {
    const rows = await readTable<T>(table);
    const nowStr = now();
    const record = {
      id: generateId(),
      ...input,
      created_at: nowStr,
      updated_at: nowStr,
    } as unknown as T;
    rows.push(record);
    await writeTable(table, rows);
    return record;
  },

  async update<T extends Row>(
    table: string,
    id: string,
    input: Row
  ): Promise<T | null> {
    const rows = await readTable<T>(table);
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    rows[idx] = {
      ...rows[idx],
      ...input,
      updated_at: now(),
    } as T;
    await writeTable(table, rows);
    return rows[idx];
  },

  async delete(table: string, id: string): Promise<void> {
    const rows = await readTable<Row>(table);
    const filtered = rows.filter((r) => r.id !== id);
    await writeTable(table, filtered);
  },
};
