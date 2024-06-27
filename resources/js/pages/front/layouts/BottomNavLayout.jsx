import { router, usePage } from "@inertiajs/react";
import { memo } from "react";

export default memo(function Index({
  children,
  title = "",
  bottomNav = true,
  back = false,
}) {
  let { urlPrev } = usePage().props;
  function goBack() {
    router.visit(urlPrev);
  }

  return (
    <div
      className={`grid ${
        bottomNav ? "grid-rows-[64px_1fr_64px]" : "grid-rows-[64px_1fr]"
      } h-screen grid-t`}
    >
      <nav className="navbar bg-base-100 border-b-2">
        <div className="navbar-start">
          {back ? (
            <button onClick={goBack} className="btn btn-ghost btn-circle">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="200"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="1.5"
                >
                  <path stroke-miterlimit="10" d="M4 12h16" />
                  <path
                    stroke-linejoin="round"
                    d="M11.033 4.34L4.46 10.911a1.53 1.53 0 0 0 0 2.176l6.573 6.573"
                  />
                </g>
              </svg>
            </button>
          ) : (
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a>Beranda</a>
                </li>
                <li>
                  <a>Pesanan Saya</a>
                </li>
                <li>
                  <a>Profile</a>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl">{title}</a>
        </div>
        <div className="navbar-end">
          <a href="#" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                width="200"
                height="200"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M9 6h6a3 3 0 1 0-6 0M7 6a5 5 0 0 1 10 0h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM5 8v12h14V8zm4 2a3 3 0 1 0 6 0h2a5 5 0 0 1-10 0z"
                />
              </svg>
              <span className="badge badge-xs badge-error indicator-item"></span>
            </div>
          </a>
        </div>
      </nav>
      <section className="p-2 overflow-y-auto">{children}</section>
      {bottomNav && (
        <nav className="btm-nav bg-base-100 relative border-t-2">
          <button className="text-primary active">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
          <button className="">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="200"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              >
                <path d="M21.25 9.944a3.083 3.083 0 0 1-2.056 2.899a2.847 2.847 0 0 1-1.027.185a3.084 3.084 0 0 1-2.899-2.056a2.848 2.848 0 0 1-.185-1.028c.003.351-.06.7-.185 1.028A3.083 3.083 0 0 1 12 13.028a3.083 3.083 0 0 1-2.898-2.056a2.846 2.846 0 0 1-.185-1.028c.002.351-.06.7-.185 1.028a3.083 3.083 0 0 1-2.899 2.056c-.35.002-.7-.06-1.027-.185A3.084 3.084 0 0 1 2.75 9.944l.462-1.623l1.11-3.166a2.056 2.056 0 0 1 1.943-1.377h11.47a2.056 2.056 0 0 1 1.942 1.377l1.11 3.166z" />
                <path d="M19.194 12.843v5.324a2.056 2.056 0 0 1-2.055 2.055H6.86a2.055 2.055 0 0 1-2.056-2.055v-5.324m4.113 4.296h6.166" />
              </g>
            </svg>
          </button>
          <button className="">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="200"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </g>
            </svg>
          </button>
        </nav>
      )}
    </div>
  );
});
