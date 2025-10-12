/* global jest */

/**
 * This is a custom mock for expo-sqlite to be used in tests.
 * It provides mock implementations for common database methods.
 * You can extend this mock with more methods or custom behavior as needed.
 */
export const openDatabaseSync = jest.fn((_name = "default.db") => {
  const mockTx = {
    executeSql: jest.fn((sql, _params = [], success, _error) => {
      // Basic SELECT mock
      const isSelect = sql.trim().toLowerCase().startsWith("select");

      const mockResultSet = {
        insertId: 1,
        rowsAffected: isSelect ? 0 : 1,
        rows: {
          length: isSelect ? 1 : 0,
          _array: isSelect ? [{ id: 1, name: "Test User" }] : [],
          item: (_index) => (isSelect ? { id: 1, name: "Test User" } : null),
        },
      };

      success?.(mockTx, mockResultSet);
    }),
  };

  return {
    /**
     * Mock implementation for exec method.
     */
    exec: jest.fn().mockResolvedValue(undefined),

    /**
     * Mock implementation for closeAsync method.
     */
    closeAsync: jest.fn().mockResolvedValue(undefined),

    /**
     * Mock implementation for transaction method.
     */
    transaction: jest.fn((callback) => callback(mockTx)),

    /**
     * Mock implementation for readTransaction method.
     */
    readTransaction: jest.fn((callback) => callback(mockTx)),
  };
});

/**
 * Mock implementation for addDatabaseChangeListener method.
 * You can customize the behavior of this mock as needed for your tests.
 */
export const addDatabaseChangeListener = jest.fn();
