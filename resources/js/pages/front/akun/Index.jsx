import { memo } from "react";
import BottomNavLayout from "../layouts/BottomNavLayout";
import { Link } from "@inertiajs/react";

export default memo(function Index({ auth: { user } }) {
  return (
    <BottomNavLayout>
      <div className="flex flex-col h-full">
        <div className="card bg-primary card-compact shadow mb-5">
          <div className="card-body flex-row gap-4">
            <div className="avatar">
              <div className="w-24 rounded-full">
                <img src={user.photo_url} />
              </div>
            </div>
            <div>
              <div className="badge badge-white mb-2">{user.role}</div>
              <h4 className="card-title text-base-100">{user.name}</h4>
              <p className="text-blue-300">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <Link
            href="/akun/edit"
            className="py-5 px-4 border-b border-b-slate-100 flex gap-4 hover:bg-slate-100"
          >
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
            <div>Edit Profile</div>
            <svg
              className="h-6 w-6 ml-auto"
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="200"
              viewBox="0 0 56 56"
            >
              <path
                fill="currentColor"
                d="M18.695 48.367c.586 0 1.102-.234 1.524-.633L38.78 29.57c.446-.445.68-.984.68-1.57c0-.61-.234-1.172-.68-1.57L20.22 8.289a2.073 2.073 0 0 0-1.524-.656a2.122 2.122 0 0 0-2.156 2.156c0 .563.258 1.125.633 1.524L34.21 28L17.17 44.688c-.374.398-.632.937-.632 1.523c0 1.219.938 2.156 2.156 2.156"
              />
              <script xmlns="" />
            </svg>
          </Link>
          <Link
            href="/pesanan"
            className="py-5 px-4 border-b border-b-slate-100 flex gap-4 hover:bg-slate-100"
          >
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
            <div>Pesanan Saya</div>
            <svg
              className="h-6 w-6 ml-auto"
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="200"
              viewBox="0 0 56 56"
            >
              <path
                fill="currentColor"
                d="M18.695 48.367c.586 0 1.102-.234 1.524-.633L38.78 29.57c.446-.445.68-.984.68-1.57c0-.61-.234-1.172-.68-1.57L20.22 8.289a2.073 2.073 0 0 0-1.524-.656a2.122 2.122 0 0 0-2.156 2.156c0 .563.258 1.125.633 1.524L34.21 28L17.17 44.688c-.374.398-.632.937-.632 1.523c0 1.219.938 2.156 2.156 2.156"
              />
              <script xmlns="" />
            </svg>
          </Link>
          <a
            href="/logout"
            className="py-5 px-4 border-b border-b-slate-100 flex gap-4 hover:bg-slate-100 mt-auto text-error -mb-5"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="200"
              viewBox="0 0 14 14"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.5 10.5v2a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v2M6.5 7h7m-2-2l2 2l-2 2"
              />
              <script xmlns="" />
            </svg>
            <div>Keluar</div>
            <svg
              className="h-6 w-6 ml-auto"
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="200"
              viewBox="0 0 56 56"
            >
              <path
                fill="currentColor"
                d="M18.695 48.367c.586 0 1.102-.234 1.524-.633L38.78 29.57c.446-.445.68-.984.68-1.57c0-.61-.234-1.172-.68-1.57L20.22 8.289a2.073 2.073 0 0 0-1.524-.656a2.122 2.122 0 0 0-2.156 2.156c0 .563.258 1.125.633 1.524L34.21 28L17.17 44.688c-.374.398-.632.937-.632 1.523c0 1.219.938 2.156 2.156 2.156"
              />
              <script xmlns="" />
            </svg>
          </a>
        </div>
      </div>
    </BottomNavLayout>
  );
});
