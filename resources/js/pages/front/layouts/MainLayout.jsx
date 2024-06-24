import React, { memo, useState, useRef } from "react";

import { Link, router } from "@inertiajs/react";
import { If, Show } from "react-haiku";
import { ToastContainer } from "react-toastify";

import { extractRouteParams } from "@/libs/utils";

import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";

const MainLayout = ({ children, auth: { user } }) => {
  const params = useRef(extractRouteParams(window.location.search));
  const [focus, setFocus] = useState(false);
  const [search, setSearch] = useState(params.current.search);

  return (
    <main>
      <div className="navbar bg-white w-full fixed top-0 border-b-2 lg:px-12 border-b-slate-300 z-[90]">
        <div className="navbar-start w-full lg:w-auto">
          <div className="aspect-square h-12"></div>
          <Link
            href={route("front.cek-resi")}
            className="btn btn-ghost px-2 mx-auto"
          >
            <img
              src={asset("assets/media/logos/logo.png")}
              alt="Logo Ardata"
              className="w-20"
            />
          </Link>
        </div>
        <div className="navbar-end ml-auto w-auto gap-10">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost px-2" data-ripplet>
              <span className="font-medium normal-case hidden lg:inline-block mr-4 text-base">
                Halo, {user?.name?.split(" ")[0]}
              </span>
              <div className="avatar rounded-full">
                <If isTrue={user?.photo}>
                  <img
                    src={user?.photo_url}
                    alt="Photo Profile"
                    className="rounded-full aspect-square object-cover !w-10"
                  />
                </If>
                <If isTrue={!user?.photo}>
                  <i className="las la-user-circle text-4xl"></i>
                </If>
              </div>
              <i className="fas fa-caret-down text-xl hidden lg:inline-block ml-1"></i>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-slate-50 w-52 rounded-md"
            >
              <li>
                <Link
                  href={route("front.cek-resi")}
                  className={`text-base ${
                    route().current() === "front.cek-resi" &&
                    "bg-primary text-white"
                  }`}
                >
                  <i className="fa fa-truck"></i>
                  Cek Resi
                </Link>
              </li>
              <li>
                <Link
                  href={route("front.klaim")}
                  className={`text-base ${
                    route().current() === "front.klaim" &&
                    "bg-primary text-white"
                  }`}
                >
                  <i className="fa fa-clipboard"></i>
                  Ajukan Klaim
                </Link>
              </li>
              <div className="divider my-1"></div>
              <li>
                <a
                  href={route("dashboard")}
                  className={`text-base ${
                    route().current() === "dashboard" && "bg-primary text-white"
                  }`}
                >
                  <i className="fa fa-th-large"></i>
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-16 md:mt-18">{children}</div>
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
