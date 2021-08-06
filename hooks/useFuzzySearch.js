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

  React.useEffect(async () => {
    // If Next says the page is ready and a querystring is present
    // Then use the querystring as the search value for the fuzzy search.
    if (isReady && query && Object.keys(query).length > 0) {
      setResults(await fuzzySearch(posts, query.value));
      return;
    } else if (isReady) {
      // If the page is ready and no querystring then populate
      // the page with all the Contentful posts.
      setResults(posts);
      return;
    }
    // This is the only dependency that we need to look at.
  }, [isReady]);

  // Used to reset the page to all the Contentful posts
  // and remove any querystring from the URL.
  const onReset = React.useCallback(() => {
    setResults(posts);
    replace(pathname, undefined, { shallow: true }); // /blog/search
  });

  const onSearch = React.useCallback(async ({ currentTarget: { value } }) => {
    // When user clears the <input /> reset the page.
    if (value.length === 0) {
      setResults(posts);
      replace(pathname, undefined, { shallow: true }); // /blog/search
      return;
    }
    // Use the search value with the fuzzy search.
    setResults(await fuzzySearch(posts, value));
    // Put the current search value back into the URL as a querystring
    replace(`${pathname}?value=${encodeURIComponent(value)}`, undefined, {
      shallow: true,
    });
  });

  return {
    onReset,
    onSearch,
    results,
    searchValue: query.value ?? "",
  };
};
