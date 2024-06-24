import React, { memo, useMemo, useState } from "react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useProvince, useCity, useDistrict } from "@/services";

function Form({ close, selected }) {
  const queryClient = useQueryClient();
  const { data: satuanBarang } = useQuery(
    [`/data/satuan-barang/${selected}/edit`],
    () => {
      KTApp.block("#form-satuan-barang");
      return axios
        .get(`/data/satuan-barang/${selected}/edit`)
        .then((res) => res.data);
    },
    {
      onSettled: () => KTApp.unblock("#form-satuan-barang"),
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
    values: { ...satuanBarang },
  });
  const { mutate: submit } = useMutation(
    (data) =>
      axios.post(
        selected
          ? `/data/satuan-barang/${selected}/update`
          : "/data/satuan-barang/store",
        data
      ),
    {
      onSettled: () => KTApp.unblock("#form-satuan-barang"),
      onError: (error) => {
        for (const key in error.response.data.errors) {
          if (Object.hasOwnProperty.call(error.response.data.errors, key)) {
            setError(key, { message: error.response.data.errors[key][0] });
          }
        }
      },
      onSuccess: ({ data }) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["/data/satuan-barang/paginate"]);
        close();
      },
    }
  );

  const onSubmit = (data) => {
    KTApp.block("#form-satuan-barang");
    submit(data);
  };

  return (
    <form
      className="card mb-12"
      id="form-satuan-barang"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="card-header">
        <div className="card-title w-100">
          <h3>
            {satuanBarang?.id
              ? `Edit Satuan Barang: ${satuanBarang?.nama || ""}`
              : "Tambah Satuan Barang"}
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
          <div className="col-12">
            <div className="mb-4">
              <label htmlFor="nama" className="form-label">
                Satuan :
              </label>
              <input
                type="text"
                name="nama"
                id="nama"
                placeholder="Satuan"
                className="form-control required"
                autoComplete="off"
                {...register("nama", { required: "Satuan harus diisi" })}
              />
              {errors?.nama && (
                <label className="label-error">{errors.nama.message}</label>
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
