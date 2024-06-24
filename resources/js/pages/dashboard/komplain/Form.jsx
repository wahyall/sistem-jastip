import React, { memo, useMemo, useState } from "react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const statusOptions = [
  {
    label: "On Progress",
    value: "On Progress",
  },
  {
    label: "Done",
    value: "Done",
  },
];

function Form({ close, selected }) {
  const queryClient = useQueryClient();
  const { data: klaim } = useQuery(
    [`/komplain/${selected}/edit`],
    () => {
      KTApp.block("#form-komplain");
      return axios.get(`/komplain/${selected}/edit`).then((res) => res.data);
    },
    {
      onSettled: () => KTApp.unblock("#form-komplain"),
      enabled: !!selected,
      cacheTime: 0,
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
    watch,
    setValue,
  } = useForm({
    values: { ...klaim },
  });
  const { mutate: submit } = useMutation(
    (data) => axios.post(`/komplain/${selected}/update`, data),
    {
      onSettled: () => KTApp.unblock("#form-komplain"),
      onError: (error) => {
        for (const key in error.response.data.errors) {
          if (Object.hasOwnProperty.call(error.response.data.errors, key)) {
            setError(key, { message: error.response.data.errors[key][0] });
          }
        }
      },
      onSuccess: ({ data }) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["/komplain/paginate"]);
        close();
      },
    }
  );

  const onSubmit = (data) => {
    KTApp.block("#form-komplain");
    submit(data);
  };

  return (
    <form
      className="card mb-12"
      id="form-komplain"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="card-header">
        <div className="card-title w-100">
          <h3>
            {klaim?.id
              ? `Update Klaim Barang Rusak: ${klaim?.pengiriman?.resi || ""}`
              : "Tambah Klaim Barang Rusak"}
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
        <div className="mb-5">
          <strong className="text-muted">Catatan Customer</strong>
          <div className="fw-bolder">{klaim?.catatan}</div>
        </div>
        <div className="mb-5">
          <strong className="text-muted">Lampiran</strong>
          <div>
            <a
              href={`/${klaim?.attachment}`}
              target="_blank"
              className="fw-bolder text-primary"
            >
              Lihat Lampiran
              <i className="la la-external-link-alt fs-4"></i>
            </a>
          </div>
        </div>
        <div className="separator mb-4 mt-2"></div>
        <div className="row">
          <div className="col-md-8">
            <div className="mb-4">
              <label htmlFor="catatan_admin" className="form-label">
                Catatan Admin/Cabang :
              </label>
              <textarea
                name="catatan_admin"
                id="catatan_admin"
                placeholder="Catatan Admin/Cabang"
                className="form-control"
                autoComplete="off"
                {...register("catatan_admin")}
                rows="3"
              ></textarea>
              {errors?.catatan_admin && (
                <label className="label-error">
                  {errors.catatan_admin.message}
                </label>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-4">
              <label htmlFor="status" className="form-label">
                Status :
              </label>
              <Controller
                control={control}
                name="status"
                render={({ field: { value, onChange } }) => (
                  <Select
                    name="status"
                    options={statusOptions}
                    hideSelectedOptions={false}
                    value={statusOptions.find((opt) => opt.value == value)}
                    onChange={(val) => onChange(val.value)}
                  />
                )}
                rules={{ required: "Status harus diisi" }}
              />
              {errors?.status && (
                <label className="label-error">{errors.status.message}</label>
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
