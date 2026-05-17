const toCamelCase = (row) => {
  if (!row) return null;
  const result = {};
  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
};

const toCamelCaseArray = (rows) => rows.map(toCamelCase);

module.exports = { toCamelCase, toCamelCaseArray };