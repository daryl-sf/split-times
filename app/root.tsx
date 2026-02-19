import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { createHead } from "remix-island";

import stylesheet from "~/tailwind.css";

export const Head = createHead(() => (
  <>
    <Meta />
    <Links />
  </>
));

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  return (
    <>
      <Head />
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <>
      <Head />
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-100">
        <h1 className="text-3xl font-bold mb-4">
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : "Unexpected Error"}
        </h1>
        <p className="text-gray-600 mb-6">
          {isRouteErrorResponse(error)
            ? "The page you were looking for could not be found."
            : "Something went wrong. Please try refreshing the page."}
        </p>
        <a href="/" className="px-6 bg-slate-800 text-white p-2 rounded-md">
          Go Home
        </a>
      </main>
      <Scripts />
    </>
  );
}
