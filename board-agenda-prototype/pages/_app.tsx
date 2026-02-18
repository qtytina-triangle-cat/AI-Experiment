import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import Layout from "@/components/Layout";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function getActivePage(pathname: string): string {
  if (pathname === "/") return "agenda";
  if (pathname === "/invitees") return "invitees";
  if (pathname === "/recording") return "recording";
  if (pathname === "/minutes") return "minutes";
  if (pathname === "/public") return "public";
  if (pathname === "/tasks") return "tasks";
  return "agenda";
}

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pathname = router.pathname;

  if (pathname === "/style-guide") {
    return <Component {...pageProps} />;
  }

  return (
    <Layout activePage={getActivePage(pathname)}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default function App(props: AppProps) {
  return (
    <ConvexProvider client={convex}>
      <AppContent {...props} />
    </ConvexProvider>
  );
}
