import React, { memo, useState, useRef } from "react";

import { Link, router } from "@inertiajs/react";
import { If, Show } from "react-haiku";
import { ToastContainer } from "react-toastify";

import { extractRouteParams } from "@/libs/utils";

import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";

const MainLayout = ({ children, auth: { user } }) => {
  return (
    <main className="bg-slate-100">
      <div className="mx-auto max-w-[460px] bg-white min-h-screen overflow-x-hidden overflow-y-auto">
        {children}
      </div>
      <ToastContainer
        newestOnTop={false}
        position="bottom-right"
        theme="dark"
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
    </main>
  );
};

export default memo(MainLayout);
