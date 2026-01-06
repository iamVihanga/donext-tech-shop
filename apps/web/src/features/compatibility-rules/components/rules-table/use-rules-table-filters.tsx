import { parseAsInteger, useQueryStates } from "nuqs";

export function useRulesTableFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(20),
    },
    {
      urlKeys: {
        page: "page",
        limit: "limit",
      },
    }
  );

  return {
    ...filters,
    setFilters,
  };
}
