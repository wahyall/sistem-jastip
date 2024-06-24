import React, { memo, useMemo, useState } from "react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useProvince, useCity, useDistrict } from "@/services";
import FileUpload from "../../components/FileUpload";

function Form({ close, selected }) {
  const queryClient = useQueryClient();
  const { data: user } = useQuery(
    [`/user/${selected}/edit`],
    () => {
      KTApp.block("#form-user");
      return axios.get(`/user/${selected}/edit`).then((res) => res.data);
    },
    {
      onSettled: () => KTApp.unblock("#form-user"),
      enabled: !!selected,
      cacheTime: 0,
    }
  );

  const [file, setFile] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
    watch,
    setValue,
  } = useForm({
    values: { ...user, role: "cabang" },
  });
  const { mutate: submit } = useMutation(
    (data) =>
      axios.post(selected ? `/user/${selected}/update` : "/user/store", data),
    {
      onSettled: () => KTApp.unblock("#form-user"),
      onError: (error) => {
        for (const key in error.response.data.errors) {
          if (Object.hasOwnProperty.call(error.response.data.errors, key)) {
            setError(key, { message: error.response.data.errors[key][0] });
          }
        }
      },
      onSuccess: ({ data }) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["/user/paginate"]);
        close();
      },
    }
  );

  const onSubmit = (data) => {
    KTApp.block("#form-user");

    const formData = new FormData(document.querySelector("#form-user"));
    formData.append("role", data.role);
    if (file[0]?.file) {
      formData.append("photo", file[0]?.file);
    }

    submit(formData);
  };

  const [openPw, setOpenPw] = useState(false);
  const [openPwConfirm, setOpenPwConfirm] = useState(false);

  return (
    <form
      className="card mb-12"
      id="form-user"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="card-header">
        <div className="card-title w-100">
          <h3>
            {user?.id ? `Edit Cabang: ${user?.nama || ""}` : "Tambah Cabang"}
          </h3>
          <button
            type="button"
            className="btn btn-light-danger btn-sm ms-auto"
            onClick={close}
          >
            <i className="las la-times-circle"></i>
            Batal
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="row">
            <div className="col-md-3">
              <label className="form-label">Foto :</label>
              <FileUpload
                files={selected && user?.photo ? `${user?.photo_url}` : file}
                onupdatefiles={setFile}
                allowMultiple={false}
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                acceptedFileTypes={["image/*"]}
              />
            </div>
            <div className="col-md-9">
              <div className="row">
                <div className="col-12">
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label">
                      Cabang :
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Cabang"
                      className="form-control required"
                      autoComplete="off"
                      {...register("name", {
                        required: "Cabang harus diisi",
                      })}
                    />
                    {errors?.name && (
                      <label className="label-error">
                        {errors.name.message}
                      </label>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label">
                      Email :
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      placeholder="Email"
                      className="form-control required"
                      autoComplete="off"
                      {...register("email", {
                        required: "Email harus diisi",
                      })}
                    />
                    {errors?.email && (
                      <label className="label-error">
                        {errors.email.message}
                      </label>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-4">
                    <label htmlFor="phone" className="form-label">
                      No. Telepon :
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="No. Telepon"
                      className="form-control required"
                      autoComplete="off"
                      {...register("phone", {
                        required: "No. Telepon harus diisi",
                      })}
                    />
                    {errors?.phone && (
                      <label className="label-error">
                        {errors.phone.message}
                      </label>
                    )}
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-4">
                    <label htmlFor="address" className="form-label">
                      Alamat :
                    </label>
                    <textarea
                      name="address"
                      id="address"
                      placeholder="Alamat"
                      className="form-control required"
                      autoComplete="off"
                      {...register("address", {
                        required: "Alamat harus diisi",
                      })}
                      rows="3"
                    ></textarea>
                    {errors?.address && (
                      <label className="label-error">
                        {errors.address.message}
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="separator my-10"></div>

          {Boolean(user?.uuid) && (
            <div className="text-muted mb-5">
              *) Kosongkan password jika tidak ingin diubah.
            </div>
          )}
          <div className="col-md-6">
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password :
              </label>
              <div className="position-relative">
                <input
                  type={openPw ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="form-control required"
                  autoComplete="off"
                  {...register("password", {
                    required: Boolean(user?.uuid)
                      ? false
                      : "Password harus diisi",
                  })}
                />
                <i
                  className={`la ${
                    openPw ? "la-eye" : "la-eye-slash"
                  } position-absolute fs-4 cursor-pointer`}
                  style={{ right: "1rem", top: "35%" }}
                  onClick={() => setOpenPw(!openPw)}
                ></i>
              </div>
              {errors?.password && (
                <label className="label-error">{errors.password.message}</label>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label htmlFor="password_confirmation" className="form-label">
                Konfirmasi Password :
              </label>
              <div className="position-relative">
                <input
                  type={openPwConfirm ? "text" : "password"}
                  name="password_confirmation"
                  id="password_confirmation"
                  placeholder="Konfirmasi Password"
                  className="form-control required"
                  autoComplete="off"
                  {...register("password_confirmation", {
                    required: Boolean(user?.uuid)
                      ? false
                      : "Konfirmasi Password harus diisi",
                    validate: (value) =>
                      value === watch("password") ||
                      "Konfirmasi Password tidak cocok",
                  })}
                />
                <i
                  className={`la ${
                    openPwConfirm ? "la-eye" : "la-eye-slash"
                  } position-absolute fs-4 cursor-pointer`}
                  style={{ right: "1rem", top: "35%" }}
                  onClick={() => setOpenPwConfirm(!openPwConfirm)}
                ></i>
              </div>
              {errors?.password_confirmation && (
                <label className="label-error">
                  {errors.password_confirmation.message}
                </label>
              )}
            </div>
          </div>
          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary btn-sm ms-auto mt-8 d-block"
            >
              <i className="las la-save"></i>
              Simpan
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default memo(Form);
