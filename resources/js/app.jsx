import "./bootstrap";

const frontRoutes = ["front", "login", "register"];
if (frontRoutes.includes(route().current()?.split(".")[0])) {
  import("../css/app.css");
  import("ripplet.js/es/ripplet-declarative");
}

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { InertiaProgress } from "@inertiajs/progress";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

// React-Query
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import DashboardLayout from "./pages/dashboard/layouts/DashboardLayout";
import MainLayout from "./pages/front/layouts/MainLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      retry: false,
      staleTime: 1000 * 60 * 60 * 1,
      networkMode: "always",
    },
    mutations: {
      networkMode: "always",
    },
  },
});

const appName =
  window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

window.asset = function (path) {
  return (
    import.meta.env.VITE_URL + "/" + path?.split("/").filter(Boolean).join("/")
  );
};

String.prototype.toCapital = function () {
  return `${this.split(" ")
    .map((str) => `${str.substring(0, 1).toUpperCase()}${str.substring(1)}`)
    .join(" ")}`;
};

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => {
    const page = resolvePageComponent(
      `./pages/${name}.jsx`,
      import.meta.glob("./pages/**/*.jsx")
    );
    page.then((module) => {
      // module.default.layout = (page) => (
      //   <DashboardLayout children={page} {...page.props} />
      // );

      if (!module.default.layout) {
        if (name.startsWith("dashboard")) {
          module.default.layout = (page) => (
            <DashboardLayout children={page} {...page.props} />
          );
        } else {
          if (!name.includes("Login") && !name.includes("Register")) {
            module.default.layout = (page) => (
              <MainLayout children={page} {...page.props} />
            );
          }
        }
      }
    });
    return page;
  },
  setup({ el, App, props }) {
    return createRoot(el).render(
      <QueryClientProvider client={queryClient}>
        <App {...props} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  },
});

InertiaProgress.init({ color: "#2563eb" });
