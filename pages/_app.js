import { ChakraProvider } from "@chakra-ui/react";

// TODO: Add custom theme configuration to "theme" prop.
// https://chakra-ui.com/docs/getting-started#add-custom-theme-optional

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
