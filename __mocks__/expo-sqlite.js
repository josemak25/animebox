/* global jest */
export const openDatabase = jest.fn((_name = "default.db") => {
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
    exec: jest.fn().mockResolvedValue(undefined),

    closeAsync: jest.fn().mockResolvedValue(undefined),

    transaction: jest.fn((callback) => callback(mockTx)),

    readTransaction: jest.fn((callback) => callback(mockTx)),
  };
});
