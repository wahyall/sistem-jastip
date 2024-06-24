import { useEffect, memo, useMemo, useRef } from "react";
import { Link } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { For, Show } from "react-haiku";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "@/libs/axios";
import { usePage } from "@inertiajs/react";

function MenuItem({ name, icon, url, route: routeName, heading = false }) {
  return (
    <div className="menu-item">
      <Show>
        <Show.When isTrue={heading}>
          <div className="menu-content mt-8">
            <span
              className="menu-heading fw-bold text-uppercase fs-7"
              style={{ color: "#646477" }}
            >
              {name}
            </span>
          </div>
        </Show.When>
        <Show.Else>
          <Link
            className={`menu-link ${
              route().current() === routeName && "active"
            }`}
            href={route(routeName)}
          >
            <span className="menu-icon menu-bullet w-25px">
              <i className={icon}></i>
            </span>
            <span className="menu-title">{name}</span>
          </Link>
        </Show.Else>
      </Show>
    </div>
  );
}

function MenuAccordion({ name, icon, children }) {
  const accordion = useRef(null);

  useEffect(() => {
    if (accordion.current.querySelector(".menu-link.active")) {
      accordion.current.classList.add("show");
    }
  }, []);

  return (
    <div
      ref={accordion}
      data-kt-menu-trigger="click"
      className="menu-item menu-accordion"
    >
      <span className="menu-link">
        <span className="menu-icon">
          <i className={icon}></i>
        </span>
        <span className="menu-title">{name}</span>
        <span className="menu-arrow"></span>
      </span>
      <div className="menu-sub menu-sub-accordion menu-active-bg">
        <For
          each={children}
          render={(menu) =>
            menu.children.length ? (
              <MenuAccordion {...menu} />
            ) : (
              <MenuItem {...menu} />
            )
          }
        />
      </div>
    </div>
  );
}

function DashboardLayout({ children, auth: { user } }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = asset("assets/js/loader.bundle.js");
    script.async = true;

    document.body.appendChild(script);
  }, []);

  const { data: menus } = useQuery(
    ["dashboard", "menu"],
    () => axios.get("/dashboard/menu").then((res) => res.data),
    {
      placeholderData: [],
    }
  );

  const { breadcrumb = [] } = usePage().props;

  return (
    <main
      id="kt_main"
      className="header-fixed header-tablet-and-mobile-fixed toolbar-enabled toolbar-fixed aside-enabled aside-fixed"
      style={useMemo(
        () => ({
          "--kt-toolbar-height": "0px",
          "--kt-toolbar-height-tablet-and-mobile": "0px",
        }),
        []
      )}
    >
      <div className="d-flex flex-column flex-root">
        <div className="page d-flex flex-row flex-column-fluid">
          {/* begin::Aside menu */}
          <aside
            id="kt_aside"
            className="aside aside-hoverable"
            data-kt-drawer="true"
            data-kt-drawer-name="aside"
            data-kt-drawer-activate="{default: true, lg: false}"
            data-kt-drawer-overlay="true"
            data-kt-drawer-width="{default:'200px', '300px': '250px'}"
            data-kt-drawer-direction="start"
            data-kt-drawer-toggle="#kt_aside_mobile_toggle"
          >
            <div className="aside-logo flex-column-auto" id="kt_aside_logo">
              <Link href={route(`dashboard`)}>
                <img
                  alt="Logo"
                  src={asset("assets/media/logos/logo.png")}
                  className="h-25px logo"
                />
              </Link>
              <div
                id="kt_aside_toggle"
                className="btn btn-icon w-auto px-0 btn-active-color-primary aside-toggle"
                data-kt-toggle="true"
                data-kt-toggle-state="active"
                data-kt-toggle-target="body"
                data-kt-toggle-name="aside-minimize"
              >
                <span className="svg-icon svg-icon-1 rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      opacity="0.5"
                      d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z"
                      fill="black"
                    ></path>
                    <path
                      d="M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z"
                      fill="black"
                    ></path>
                  </svg>
                </span>
              </div>
            </div>
            <div className="aside-menu flex-column-fluid">
              <div
                className="hover-scroll-overlay-y my-5 my-lg-5"
                id="kt_aside_menu_wrapper"
                data-kt-scroll="true"
                data-kt-scroll-activate="{default: false, lg: true}"
                data-kt-scroll-height="auto"
                data-kt-scroll-dependencies="#kt_aside_logo, #kt_aside_footer"
                data-kt-scroll-wrappers="#kt_aside_menu"
                data-kt-scroll-offset="0"
                style={{ height: "216px" }}
              >
                <div
                  className="menu menu-column menu-title-gray-800 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500"
                  id="#kt_aside_menu"
                  data-kt-menu="true"
                  data-kt-menu-expand="false"
                >
                  <For
                    each={menus}
                    render={(menu) =>
                      menu.children.length ? (
                        <MenuAccordion {...menu} />
                      ) : (
                        <MenuItem {...menu} />
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </aside>
          {/* end::Aside menu */}

          {/* begin::Wrapper */}
          <div
            className="wrapper d-flex flex-column flex-row-fluid"
            id="kt_wrapper"
          >
            {/* begin::Header */}
            <header className="header align-items-stretch" id="kt_header">
              <div className="container-fluid d-flex align-items-stretch">
                {/* begin::Aside mobile toggle */}
                <div
                  className="d-flex align-items-center d-lg-none ms-n2 me-2"
                  title="Show aside menu"
                >
                  <div
                    className="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
                    id="kt_aside_mobile_toggle"
                  >
                    <i className="las la-bars" style={{ fontSize: "2rem" }}></i>
                  </div>
                </div>
                {/* end::Aside mobile toggle */}

                {/* begin::Mobile logo */}
                <div className="d-flex align-items-center flex-grow-0 ms-4">
                  <Link href={route(`dashboard`)} className="d-lg-none">
                    <img
                      alt="Logo"
                      src={asset("assets/media/logos/logo.png")}
                      className="h-30px"
                    />
                  </Link>
                </div>
                {/* end::Mobile logo */}

                {/* begin::Wrapper */}
                <div className="d-flex align-items-stretch justify-content-between flex-grow-1">
                  {/* begin::Navbar */}
                  <div
                    className="d-flex align-items-stretch px-4 px-lg-0 ms-4 ms-lg-0"
                    id="kt_header_nav"
                  >
                    <ol className="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold">
                      <For
                        each={breadcrumb}
                        render={(item) => (
                          <li className="breadcrumb-item pe-3">
                            <a href="#" className="pe-3 text-dark fw-bold">
                              {item}
                            </a>
                          </li>
                        )}
                      />
                    </ol>
                  </div>
                  {/* end::Navbar */}

                  {/* begin::Toolbar */}
                  <div className="d-flex align-items-stretch flex-shrink-0">
                    {/* begin::User menu */}
                    <div
                      className="d-flex align-items-center ms-1 ms-lg-3"
                      id="kt_header_user_menu_toggle"
                    >
                      <div
                        className="cursor-pointer symbol symbol-30px symbol-md-40px show menu-dropdown"
                        data-kt-menu-trigger="click"
                        data-kt-menu-attach="parent"
                        data-kt-menu-placement="bottom-end"
                      >
                        <img src={user?.photo_url} alt="user" />
                      </div>
                      <div
                        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px"
                        data-kt-menu="true"
                        data-popper-placement="bottom-end"
                        style={useMemo(
                          () => ({
                            position: "fixed",
                            margin: "0px",
                            transform: "translate(-30px, 65px)",
                          }),
                          []
                        )}
                      >
                        <div className="menu-item px-3">
                          <div className="menu-content d-flex align-items-center px-3">
                            <div className="symbol symbol-50px me-5">
                              <img alt="Logo" src={user?.photo_url} />
                            </div>
                            <div className="d-flex flex-column">
                              <div className="fw-bolder d-flex align-items-center fs-5">
                                {user?.name}
                                <span className="badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2">
                                  {user?.role}
                                </span>
                              </div>
                              <span className="fw-bold text-muted text-hover-primary fs-7">
                                {user?.email}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="separator my-2"></div>
                        {/* <div className="menu-item px-5">
                          <a
                            // href={route("front.me")}
                            className="menu-link px-5"
                          >
                            Akun Saya
                          </a>
                        </div> */}
                        <div className="menu-item px-5">
                          <a
                            href={route("logout")}
                            className="menu-link px-5 text-danger"
                          >
                            Logout
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* end::User menu */}
                  </div>
                  {/* end::Toolbar */}
                </div>
                {/* end::Wrapper */}
              </div>
            </header>
            {/* end::Header */}

            {/* begin::Content */}
            <div
              className="content d-flex flex-column flex-column-fluid"
              id="kt_content"
            >
              <div
                className="post d-flex flex-column-fluid"
                id="kt_post mt-6 mt-lg-0"
              >
                <div id="kt_content_container" className="container-xxl">
                  {children}
                </div>
              </div>
            </div>
            {/* end::Content */}
          </div>
          {/* end::Wrapper */}
        </div>
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
}

export default memo(DashboardLayout);
