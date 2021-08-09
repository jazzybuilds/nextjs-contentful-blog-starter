/**
 * @name fuzzySearch
 * @description Fuzzy Search API
 * @param {Array<Post>} data
 * @param {string} searchValue
 * @returns {Fuse.FuseResult<Post>}
 */
export async function fuzzySearch(data, searchValue) {
  // Performance Hack: Dynamically import the dependency when the function is used.
  const Fuse = await (await import("fuse.js")).default;

  // Instantiate Fuse with the statically generated post data and define the options
  // that Fuse should use.
  // Note: "keys" can be extended to include any key that is present on the Post Model.
  const fuse = new Fuse(data, {
    isCaseSensitive: false,
    shouldSort: true,
    includeMatches: true,
    findAllMatches: true,
    minMatchCharLength: 1,
    threshold: 0.1,
    keys: ["title"],
  });

  // We must parse the return value from Fuse to match the data structure
  // our application is expecting. Fuse returns [{ item: Post }, ...]
  // The .map() call reverts back to the expected data structure.
  return fuse.search(searchValue).map(({ item }) => item);
}
