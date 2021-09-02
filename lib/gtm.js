export const pageView = (url) => {
  if (typeof window === "undefined") return;
  window.dataLayer.push({
    event: "pageview",
    page: url,
  });
};
