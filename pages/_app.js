// 1. import `NextUIProvider` component
import {createTheme, NextUIProvider} from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import Layout from "../components/layout";
import NavBar from "../components/navbar";
import {CourseContext} from "../libs/sl";
import Head from "next/head";

const lightTheme = createTheme({
    type: 'light',
})

const darkTheme = createTheme({
    type: 'dark',
})

function MyApp({ Component, pageProps }) {
  return (
      // 2. Use at the root of your app
      <>
          <Head>
              <link rel="manifest" href="manifest.json" />
          </Head>
      <NextThemesProvider
          defaultTheme="system"
          attribute="class"
          value={{
              light: lightTheme.className,
              dark: darkTheme.className
          }}
      >
        <NextUIProvider>
            <NavBar/>
            <Layout >
                <Component {...pageProps} />
            </Layout>
        </NextUIProvider>
      </NextThemesProvider>
      </>
  );
}

export default MyApp;
