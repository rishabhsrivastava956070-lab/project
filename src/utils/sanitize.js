function sanitizeString(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;
}

function sanitizeObject(input) {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, sanitizeString(value)])
  );
}

module.exports = { sanitizeObject };
