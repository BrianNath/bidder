import "@/styles/globals.css";
import Layout from "@/components/Layout";

function App({ Component, pageProps, router }) {
  const path = router.asPath;

  const excludePathsRegex = /^\/(authentication)$/;
  const excludeLayoutRoutes = ["/404"];

  if (excludeLayoutRoutes.includes(router.pathname)) {
    return <Component {...pageProps} />;
  } else if (path.match(excludePathsRegex)) {
    return <Component {...pageProps} />;
  } else {
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default App;
