import * as React from "react";
import { useRouter } from "next/router";

import { fuzzySearch } from "@lib/fuzzySearch";

/**
 * @name useFuzzySearch
 * @description Hook for fuzzy search feature (manual/url populated).
 * @param {Array<Post>} posts
 * @returns {onReset,onSearch,results,searchValue}
 */
export const useFuzzySearch = (posts) => {
  // Get context of router for querystring related search.
  const { isReady, pathname, query, replace } = useRouter();
  // Internal state for tracking the search of Contentful posts.
  const [results, setResults] = React.useState([]);
  // Internal state for tracking the current search value.
  const [searchValue, setSearchValue] = React.useState("");

  // This useEffect is the bulk of the logic of this hook.
  // Please read through carefully before editing!!!
  React.useEffect(async () => {
    // NextJS gives us access to "isReady" which determines when
    // the page has loaded completely as well as a "query" (query params)
    // object. It will be empty if there is no "?" in the url.
    if (isReady && query && Object.keys(query).length > 0) {
      // If the page has loaded and query params are present.
      // 1. Execute the fuzzy search on the Contentful posts.
      setResults(await fuzzySearch(posts, query.value));
      // 2. Update the search value state.
      setSearchValue(query.value);
      // 3. Remove the querystring from the url.
      // Url will be cleaned and left to be /blog/search.
      replace(pathname);
      return;
    } else if (isReady) {
      // If there is no querystring but the page has loaded
      // then populated all the Contentful posts.
      setResults(posts);
      return;
    }
    // The only dependency we care about is when "isReady" changes.
    // This will trigger the useEffect to run again.
  }, [isReady]);

  const onReset = React.useCallback(() => {
    // 1. Clear the searchValue.
    setSearchValue("");
    // 2. Updated state so all posts are loaded into the UI.
    setResults(posts);
    // 3. Clean the url of the querystring.
    replace(pathname);
  });

  const onSearch = React.useCallback(async ({ currentTarget: { value } }) => {
    if (value.length === 0) {
      // Reset the list to all posts if search value is cleared.
      setResults(posts);
      // Set the search value to the empty string.
      setSearchValue(value);
      return;
    }
    // Execute the fuzzy search with the manual search value.
    setResults(await fuzzySearch(posts, value));
    // Set the search value in state.
    setSearchValue(value);
  });

  // These functions and data will be what the hook
  // emits into it's parent.
  return {
    onReset,
    onSearch,
    results,
    searchValue,
  };
};
