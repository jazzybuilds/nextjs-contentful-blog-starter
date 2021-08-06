import { fuzzySearch } from "./fuzzySearch";

const data = [
  { title: "5 Brilliant Ways To Teach Your Audience About DOGS" },
  { title: "Never Suffer From DOGS Again" },
  { title: "How To Win Buyers And Influence Sales with DOGS" },
  { title: "How We Improved Our DOGS In One Week(Month, Day)" },
  { title: "5 Actionable Tips on DOGS And Twitter." },
];

describe("/lib/fuzzySearch.js", () => {
  test("should return correct results for searchValue of '5'", async () => {
    const result = await fuzzySearch(data, "5");

    expect(data.length).toBe(5);
    expect(result.length).toBe(2);
    expect(result[0].title).toBe("5 Actionable Tips on DOGS And Twitter.");
    expect(result[1].title).toBe(
      "5 Brilliant Ways To Teach Your Audience About DOGS",
    );
  });
  test("should return correct results for searchValue of 'How'", async () => {
    const result = await fuzzySearch(data, "How");

    expect(data.length).toBe(5);
    expect(result.length).toBe(2);
    expect(result[0].title).toBe(
      "How To Win Buyers And Influence Sales with DOGS",
    );
    expect(result[1].title).toBe(
      "How We Improved Our DOGS In One Week(Month, Day)",
    );
  });
  test("should return correct results for searchValue of 'z'", async () => {
    const result = await fuzzySearch(data, "z");

    expect(data.length).toBe(5);
    expect(result.length).toBe(0);
  });
});
