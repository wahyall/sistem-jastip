import React, { memo, useMemo, useState } from "react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useKurir } from "@/services";
import { usePage } from "@inertiajs/react";
import { For, Show } from "react-haiku";
import Flatpickr from "react-flatpickr";
import { currency } from "@/libs/utils";
import CurrencyInput from "react-currency-input-field";
import useDelete from "@/hooks/useDelete";

function Form({ close, selected }) {
  const queryClient = useQueryClient();
  const { data: pengiriman = { pembayarans: [] }, refetch } = useQuery(
    [`/keuangan/${selected}/edit`],
    () => {
      KTApp.block("#form-pengiriman");
      return axios.get(`/keuangan/${selected}/edit`).then((res) => res.data);
    },
    {
      onSettled: () => KTApp.unblock("#form-pengiriman"),
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
    reset,
    setValue,
  } = useForm();
  const { mutate: submit } = useMutation(
    (data) =>
      axios.post("/keuangan/store", { ...data, pengiriman_id: pengiriman?.id }),
    {
      onMutate: () => KTApp.block("#form-pengiriman"),
      onSettled: () => KTApp.unblock("#form-pengiriman"),
      onError: (error) => {
        for (const key in error.response.data.errors) {
          if (Object.hasOwnProperty.call(error.response.data.errors, key)) {
            setError(key, { message: error.response.data.errors[key][0] });
          }
        }
      },
      onSuccess: ({ data }) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["/keuangan/paginate"]);
        queryClient.invalidateQueries([
          "/keuangan/paginate?status=Pengiriman Dibuat",
        ]);
        queryClient.invalidateQueries(["/keuangan/paginate?status=Diproses"]);
        queryClient.invalidateQueries(["/keuangan/paginate?status=Delivery"]);
        queryClient.invalidateQueries(["/keuangan/paginate?status=Delivered"]);
        handleClose();

        setTimeout(() => {
          refetch();
        }, 100);
      },
    }
  );

  const { data: kurirs = [], isLoading: isKurirsLoading } = useKurir(
    null,
    pengiriman.cabang_id
  );
  const kurirOptions = useMemo(
    () =>
      kurirs.map((item) => ({
        label: item.name,
        value: item.id,
      })),
    [kurirs]
  );

  const {
    auth: { user },
  } = usePage().props;

  const [openForm, setOpenForm] = useState(false);
  function handleAddBayar() {
    setOpenForm(true);
  }

  function handleClose() {
    setOpenForm(false);
    reset();
  }

  const { delete: handleDelete } = useDelete({
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries(["/keuangan/paginate"]);
      queryClient.invalidateQueries(["/keuangan/paginate?onProgress=1"]);
      queryClient.invalidateQueries(["/keuangan/paginate?selesai=1"]);
    },
  });

  return (
    <div className="card mb-12" id="form-pengiriman">
      <div className="card-header">
        <div className="card-title w-100">
          <h3>{pengiriman?.id ? `Update Pembayaran` : "Pembayaran"}</h3>
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
        <div className="mb-10 d-flex alig-items-center gap-20">
          <div>
            <h2>
              Resi: <span className="fw-normal">{pengiriman.resi}</span>
            </h2>
            <h2>
              Pengirim:{" "}
              <span className="fw-normal">{pengiriman.pengirim?.nama}</span>
            </h2>
            <h2>
              Tagihan:{" "}
              <span className="fw-normal">
                {currency(pengiriman.pembayaran?.tagihan)}
              </span>
            </h2>
            <h2>
              Piutang:{" "}
              <span className="fw-normal">
                {currency(pengiriman.pembayaran?.piutang)}
              </span>
            </h2>
          </div>
          {!pengiriman.pembayaran?.status && (
            <button
              type="button"
              className="btn btn-primary btn-icon rounded-circle btn-sm w-30px h-30px"
              onClick={handleAddBayar}
            >
              <i className="la la-plus fs-4"></i>
            </button>
          )}
        </div>

        <div class="table-responsive">
          <table class="table table-hover table-rounded table-striped">
            <thead>
              <tr class="fw-bold fs-6 text-gray-800 border-bottom border-gray-200">
                <th>Nominal</th>
                <th>Tanggal</th>
                <th>Notes</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <For
                each={pengiriman.pembayarans}
                render={(item) => (
                  <tr>
                    <td>{currency(item.nominal)}</td>
                    <td>{item.tanggal}</td>
                    <td>{item.catatan ?? "-"}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm btn-icon"
                        onClick={() =>
                          handleDelete(`/keuangan/${item.uuid}/destroy`)
                        }
                      >
                        <i className="la la-trash fs-4"></i>
                      </button>
                    </td>
                  </tr>
                )}
              />
              {openForm && (
                <tr>
                  <td>
                    <Controller
                      control={control}
                      name="nominal"
                      render={({ field: { value, onChange } }) => (
                        <CurrencyInput
                          id="nominal"
                          mask="999.999"
                          prefix="Rp. "
                          placeholder="Rp. 000.000"
                          className="form-control text-end"
                          groupSeparator="."
                          decimalSeparator=","
                          value={value}
                          onValueChange={onChange}
                          autoComplete="off"
                          allowDecimals={false}
                          allowNegativeValue={false}
                        />
                      )}
                      rules={{
                        required: `Nominal harus diisi`,
                      }}
                    />
                    {errors?.nominal && (
                      <label className="label-error">
                        {errors.nominal.message}
                      </label>
                    )}
                  </td>
                  <td>
                    <Controller
                      control={control}
                      name="tanggal"
                      render={({ field: { value, onChange } }) => (
                        <Flatpickr
                          className="form-control"
                          value={value}
                          placeholder="Tanggal Bayar"
                          onChange={(date, val) => onChange(val)}
                        />
                      )}
                      rules={{ required: "Tanggal harus diisi" }}
                    />
                    {errors?.tanggal && (
                      <label className="label-error">
                        {errors.tanggal.message}
                      </label>
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Catatan"
                      {...register("catatan")}
                    />
                  </td>
                  <td>
                    <div className="d-flex gap-4">
                      <button
                        className="btn btn-primary btn-sm btn-icon"
                        onClick={handleSubmit(submit)}
                      >
                        <i className="la la-save fs-4"></i>
                      </button>
                      <button
                        className="btn btn-light-danger btn-sm btn-icon"
                        onClick={() => handleClose()}
                      >
                        <i className="la la-times fs-4"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default memo(Form);
