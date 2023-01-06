// 1. import `NextUIProvider` component
import {createTheme, NextUIProvider} from '@nextui-org/react';
import Layout from "../components/layout";

const darkTheme = createTheme({
    type: 'dark',
})

function MyApp({ Component, pageProps }) {
  return (
      // 2. Use at the root of your app
        <NextUIProvider theme={darkTheme}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </NextUIProvider>
  );
}

export default MyApp;
