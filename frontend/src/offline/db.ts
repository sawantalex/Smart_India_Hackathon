import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface HISDB extends DBSchema {
  offline_queue: {
    key: string;
    value: {
      client_tx_id: string;
      entity_type: string;
      action_type: string;
      payload: any;
      timestamp: number;
    };
  };
  cached_facilities: {
    key: number;
    value: any;
  };
}

const DB_NAME = 'his_rural_offline_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<HISDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<HISDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('offline_queue')) {
          db.createObjectStore('offline_queue', { keyPath: 'client_tx_id' });
        }
        if (!db.objectStoreNames.contains('cached_facilities')) {
          db.createObjectStore('cached_facilities', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function queueOfflineEvent(entity_type: string, action_type: string, payload: any) {
  const db = await getDB();
  const client_tx_id = `TX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const item = {
    client_tx_id,
    entity_type,
    action_type,
    payload,
    timestamp: Date.now(),
  };
  await db.put('offline_queue', item);
  return item;
}

export async function getOfflineQueue() {
  const db = await getDB();
  return await db.getAll('offline_queue');
}

export async function clearOfflineQueue() {
  const db = await getDB();
  await db.clear('offline_queue');
}

export async function cacheFacilities(facilities: any[]) {
  const db = await getDB();
  const tx = db.transaction('cached_facilities', 'readwrite');
  for (const fac of facilities) {
    await tx.store.put(fac);
  }
  await tx.done;
}

export async function getCachedFacilities() {
  const db = await getDB();
  return await db.getAll('cached_facilities');
}
