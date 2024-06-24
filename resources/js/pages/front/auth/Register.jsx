import React, { useEffect } from "react";
import AuthLayout from "@/pages/front/layouts/AuthLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "@/libs/axios";

const schema = yup
  .object({
    name: yup.string().required("Isian nama lengkap wajib diisi"),
    email: yup
      .string()
      .email("Masukkan Email yang valid")
      .required("Isian email wajib diisi"),
    password: yup
      .string()
      .required("Isian password wajib diisi")
      .min(8, "Password Harus Berisi Minimal 8 Karakter"),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password")], "Konfirmasi password tidak sesuai"),
  })
  .required();

const Register = ({ redirect }) => {
  const {
    register: form,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate: register, isLoading } = useMutation(
    (data) => axios.post(route("register"), data),
    {
      onError: (error) => {
        for (const key in error.response.data.errors) {
          if (Object.hasOwnProperty.call(error.response.data.errors, key)) {
            setError(key, { message: error.response.data.errors[key][0] });
          }
        }
      },
      onSuccess: ({ data }) => router.visit(data.redirect),
    }
  );

  const onSubmit = (data) => {
    register(data);
  };

  return (
    <>
      <Head title="Daftar" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate="novalidate"
        id="form-login"
        className="w-full"
      >
        <div className="mb-16">
          <h1 className="text-slate-800 text-3xl md:text-4xl font-bold">
            Buat Akun Baru
          </h1>
        </div>
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Nama Lengkap :</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="input input-bordered w-full"
            autoComplete="off"
            {...form("name")}
          />
          {errors.name && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.name.message}
              </span>
            </label>
          )}
        </div>
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Email :</span>
          </label>
          <input
            type="text"
            name="email"
            id="email"
            className="input input-bordered w-full"
            autoComplete="off"
            {...form("email")}
          />
          {errors.email && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.email.message}
              </span>
            </label>
          )}
        </div>
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Password :</span>
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="input input-bordered w-full"
            autoComplete="off"
            {...form("password")}
          />
          {errors.password && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.password.message}
              </span>
            </label>
          )}
        </div>
        <div className="form-control w-full mb-8">
          <label className="label">
            <span className="label-text">Konfirmasi Password :</span>
          </label>
          <input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            className="input input-bordered w-full"
            autoComplete="off"
            {...form("password_confirmation")}
          />
          {errors.password_confirmation && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.password_confirmation.message}
              </span>
            </label>
          )}
        </div>
        <button
          type="submit"
          className={`btn btn-primary w-full ${isLoading && "loading"}`}
          disabled={isLoading}
          data-ripplet
        >
          Daftar
        </button>
        <div className="mt-8">
          Sudah memiliki akun?{" "}
          <Link
            href={route("login")}
            data={{ redirect }}
            className="link-primary ms-2"
          >
            Masuk
          </Link>
        </div>
      </form>
    </>
  );
};

Register.layout = (page) => <AuthLayout children={page} />;

export default Register;
