import * as React from "react";

import { fuzzySearch } from "@lib/fuzzySearch";

export default function FuzzySearch({ onChange, posts }) {
  // Memoize the search function so it is not recreated on every re-render of
  // <FuzzySearch />. The second argument of an empty array tells React there
  // are no dependencies that should cause the re-memoization of the function.
  const onSearch = React.useCallback(async ({ currentTarget: { value } }) => {
    // Prevent a call to the fuzzy search service if the search value
    // ever evaluates to "undefined".
    if (typeof value === "undefined") {
      return;
    }
    // Preform the fuzzy search and return the data to the parent through
    // the onChange callback.
    onChange(await fuzzySearch(posts, value));
  }, []);
  return <input onChange={onSearch} placeholder="Search" type="text" />;
}
