import { Link } from "@inertiajs/react";
import React from "react";
import "ripplet.js/es/ripplet-declarative";

export default function AuthLayout({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen gap-0">
      <div className="h-full flex items-center justify-center md:py-8 px-8 md:px-20 order-2 md:order-1">
        {children}
      </div>
      <div
        className="h-full bg-cover bg-center bg-no-repeat flex items-center justify-center order-1 md:order-2"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(24, 16, 28, 0.5), rgba(24, 16, 28, 0.75)), url(${asset(
            "assets/media/misc/bg-auth.jpg"
          )})`,
        }}
      >
        <div className="flex flex-col items-center gap-8 md:p-8">
          <Link href={route("dashboard")} className="mb-0 mb-lg-12">
            <img
              alt="Logo"
              src={asset("assets/media/logos/logo.png")}
              className="h-16 lg:h-20"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
