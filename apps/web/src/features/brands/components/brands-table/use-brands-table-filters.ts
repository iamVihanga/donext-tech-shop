import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export const useBrandsTableFilters = () => {
  const [searchParams, setSearchParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
      sort: parseAsString.withDefault("desc"),
      search: parseAsString.withDefault("")
    },
    {
      clearOnDefault: true
    }
  );

  const { page, limit, sort, search: searchQuery } = searchParams;

  const setPage = (page: number) => {
    setSearchParams({ page });
  };

  const setSort = (sort: "asc" | "desc") => {
    setSearchParams({ sort });
  };

  const setSearchQuery = (search: string) => {
    setSearchParams({ search });
  };

  const resetFilters = () => {
    setSearchParams({
      page: 1,
      limit: 10,
      sort: "desc",
      search: ""
    });
  };

  const isAnyFilterActive = searchQuery !== "";

  return {
    page: page.toString(),
    limit: limit.toString(),
    sort,
    searchQuery,
    setPage,
    setSort,
    setSearchQuery,
    resetFilters,
    isAnyFilterActive
  };
};
