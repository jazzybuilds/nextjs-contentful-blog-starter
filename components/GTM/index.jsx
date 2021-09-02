import React from "react";
import { useRouter } from "next/router";

import { pageView } from "../../lib/gtm";

const GTM = ({ children }) => {
  const { events } = useRouter();

  React.useEffect(() => {
    events.on("routeChangeComplete", pageView);

    return () => {
      events.off("routeChangeComplete", pageView);
    };
  }, [events]);

  return children;
};

export default GTM;
