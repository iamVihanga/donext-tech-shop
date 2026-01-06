import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export function useSpecificationTableFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(20),
      componentType: parseAsString,
      socketType: parseAsString,
      memoryType: parseAsString,
      formFactor: parseAsString,
    },
    {
      urlKeys: {
        page: "page",
        limit: "limit",
        componentType: "type",
        socketType: "socket",
        memoryType: "memory",
        formFactor: "form",
      },
    }
  );

  return {
    ...filters,
    setFilters,
  };
}
