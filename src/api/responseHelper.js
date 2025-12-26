export const normalizeList = (resp) => {
  // resp may be: Array, { data: Array, pagination: {...} }, { results: Array, meta: {...} }
  if (!resp) return { data: [], pagination: {} };
  if (Array.isArray(resp)) return { data: resp, pagination: {} };
  if (Array.isArray(resp.data)) return { data: resp.data, pagination: resp.pagination || resp.meta || {} };
  if (Array.isArray(resp.results)) return { data: resp.results, pagination: resp.meta || {} };
  // Fallback: try to extract nested arrays
  for (const key of ["items", "results", "data"]) {
    if (resp[key] && Array.isArray(resp[key])) return { data: resp[key], pagination: resp.pagination || resp.meta || {} };
  }
  return { data: [], pagination: {} };
};
