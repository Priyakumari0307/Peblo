const toCamelCase = (row) => {
  if (!row) return null;
  const result = {};
  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  // Map 'id' to '_id' for frontend compatibility (MongoDB style)
  if (result.id !== undefined) {
    result._id = result.id;
  }
  return result;
};

const toCamelCaseArray = (rows) => rows.map(toCamelCase);

module.exports = { toCamelCase, toCamelCaseArray };