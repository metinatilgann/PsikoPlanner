import React, { createContext, useContext, useEffect, useState } from 'react';
import type { SQLiteDatabase } from 'expo-sqlite';
import { initDatabase } from '../config/database';

interface DatabaseContextType {
  db: SQLiteDatabase | null;
  isReady: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
  db: null,
  isReady: false,
  error: null,
});

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initDatabase()
      .then((database) => {
        setDb(database);
        setIsReady(true);
      })
      .catch((err) => {
        setError(err);
        setIsReady(true);
      });
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isReady, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const { db, isReady, error } = useContext(DatabaseContext);
  if (!db && isReady && !error) {
    throw new Error('Database not initialized');
  }
  return { db: db!, isReady, error };
}
