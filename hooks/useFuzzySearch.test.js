import { renderHook, act } from "@testing-library/react-hooks";
import router, { useRouter } from "next/router";

import { useFuzzySearch } from "./useFuzzySearch";

jest.mock("next/router", () => require("next-router-mock"));

const posts = [
  { title: "5 Brilliant Ways To Teach Your Audience About DOGS" },
  { title: "Never Suffer From DOGS Again" },
  { title: "How To Win Buyers And Influence Sales with DOGS" },
  { title: "How We Improved Our DOGS In One Week(Month, Day)" },
  { title: "5 Actionable Tips on DOGS And Twitter." },
];

describe("[Hooks]: useFuzzySearch", () => {
  beforeEach(() => {
    router.push("/blog/search");
  });
  test("should render list of all posts if no querystring found.", () => {
    router.isReady = true;
    const { result } = renderHook(() => useFuzzySearch(posts));
    expect(result.current.results).toHaveLength(5);
  });
  test("should render list for querystring value.", async () => {
    router.isReady = true;

    const { result } = renderHook(() => useFuzzySearch(posts));

    await act(async () => {
      await result.current.onSearch({ currentTarget: { value: "Twitter" } });
    });

    expect(result.current.searchValue).toBe("Twitter");
    expect(result.current.results).toHaveLength(1);
  });
  test("should render empty list for querystring value that does not exist.", async () => {
    router.isReady = true;

    const { result } = renderHook(() => useFuzzySearch(posts));

    await act(async () => {
      await result.current.onSearch({ currentTarget: { value: "z" } });
    });

    expect(result.current.searchValue).toBe("z");
    expect(result.current.results).toHaveLength(0);
  });
});
