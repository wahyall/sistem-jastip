import React, { memo, useMemo, useState } from "react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { toast } from "react-toastify";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";
import { useSatuanBarang } from "@/services";
import { If } from "react-haiku";
import CurrencyInput from "react-currency-input-field";

const tipeOptions = [
  { label: "Berat", value: "berat" },
  { label: "Volume", value: "volume" },
];

function Form({ close, selected }) {
  const queryClient = useQueryClient();
  const { data: opsiPengiriman } = useQuery(
    [`/data/opsi-pengiriman/${selected}/edit`],
    () => {
      KTApp.block("#form-opsi-pengiriman");
      return axios
        .get(`/data/opsi-pengiriman/${selected}/edit`)
        .then((res) => res.data);
    },
    {
      onSettled: () => KTApp.unblock("#form-opsi-pengiriman"),
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
    values: { ...opsiPengiriman },
    defaultValues: { items: [{}] },
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "items",
    }
  );

  const { mutate: submit } = useMutation(
    (data) =>
      axios.post(
        selected
          ? `/data/opsi-pengiriman/${selected}/update`
          : "/data/opsi-pengiriman/store",
        data
      ),
    {
      onSettled: () => KTApp.unblock("#form-opsi-pengiriman"),
      onError: (error) => {
        for (const key in error.response.data.errors) {
          if (Object.hasOwnProperty.call(error.response.data.errors, key)) {
            setError(key, { message: error.response.data.errors[key][0] });
          }
        }
      },
      onSuccess: ({ data }) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["/data/opsi-pengiriman/paginate"]);
        close();
      },
    }
  );

  const onSubmit = (data) => {
    KTApp.block("#form-opsi-pengiriman");
    submit(data);
  };

  console.log(watch());

  const { data: satuans = [], isLoading: isSatuansLoading } = useSatuanBarang();
  const satuanOptions = useMemo(
    () =>
      satuans.map((item) => ({
        label: item.nama,
        value: item.id,
      })),
    [satuans]
  );

  return (
    <form
      className="card mb-12"
      id="form-opsi-pengiriman"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="card-header">
        <div className="card-title w-100">
          <h3>
            {opsiPengiriman?.id
              ? `Edit Opsi Pengiriman: ${opsiPengiriman?.nama || ""}`
              : "Tambah Opsi Pengiriman"}
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
            <div className="mb-10">
              <label htmlFor="nama" className="form-label">
                Opsi Pengiriman :
              </label>
              <input
                type="text"
                name="nama"
                id="nama"
                placeholder="Opsi Pengiriman"
                className="form-control required"
                autoComplete="off"
                {...register("nama", {
                  required: "Opsi Pengiriman harus diisi",
                })}
              />
              {errors?.nama && (
                <label className="label-error">{errors.nama.message}</label>
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="d-flex">
              <div>Detail Rincian</div>
              <button
                type="button"
                className="btn btn-light-primary btn-sm ms-auto"
                onClick={() => append({})}
              >
                <i className="la la-plus"></i>
                Add Detail
              </button>
            </div>

            {fields.map((field, index) => (
              <div className="row mb-5">
                <div className="col-3">
                  <label htmlFor="nama" className="form-label">
                    Tipe :
                  </label>
                  <Controller
                    control={control}
                    name={`items.${index}.tipe`}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        name={`items.${index}.tipe`}
                        placeholder="Tipe"
                        options={tipeOptions}
                        hideSelectedOptions={false}
                        value={tipeOptions.find((opt) => opt.value == value)}
                        onChange={(val) => onChange(val.value)}
                      />
                    )}
                    rules={{ required: "Tipe harus diisi" }}
                  />
                  {errors?.items?.[index]?.tipe && (
                    <label className="label-error">
                      {errors.items?.[index]?.tipe.message}
                    </label>
                  )}
                </div>
                <div className="col-2">
                  <label htmlFor="nama" className="form-label">
                    Satuan :
                  </label>
                  <Controller
                    control={control}
                    name={`items.${index}.satuan_barang_id`}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        name={`items.${index}.satuan_barang_id`}
                        placeholder="Satuan"
                        isLoading={isSatuansLoading}
                        options={satuanOptions}
                        hideSelectedOptions={false}
                        value={satuanOptions.find((opt) => opt.value == value)}
                        onChange={(val) => onChange(val.value)}
                      />
                    )}
                    rules={{ required: "Satuan harus diisi" }}
                  />
                  {errors?.items?.[index]?.satuan_barang_id && (
                    <label className="label-error">
                      {errors.items?.[index]?.satuan_barang_id.message}
                    </label>
                  )}
                </div>

                {watch(`items.${index}.tipe`) == "berat" && (
                  <div className="col-4">
                    <label className="form-label">Berat :</label>
                    <div class="input-group mb-3">
                      <input
                        type="numeric"
                        step="any"
                        name={`items.${index}.from_berat`}
                        placeholder="Dari"
                        className="form-control required"
                        autoComplete="off"
                        {...register(`items.${index}.from_berat`, {
                          required: "Dari Berat harus diisi",
                        })}
                      />
                      <span class="input-group-text">-</span>
                      <input
                        type="numeric"
                        step="any"
                        name={`items.${index}.to_berat`}
                        placeholder="Sampai"
                        className="form-control required"
                        autoComplete="off"
                        {...register(`items.${index}.to_berat`)}
                      />
                    </div>
                    <label
                      className="text-muted"
                      style={{ fontSize: "0.9rem" }}
                    >
                      *) Kosongkan <strong>Input Berat Kanan</strong> jika tidak
                      ada batasan atas
                    </label>
                    {errors?.items?.[index]?.from_berat && (
                      <label className="label-error">
                        {errors.items?.[index]?.from_berat.message}
                      </label>
                    )}
                  </div>
                )}

                {watch(`items.${index}.tipe`) == "volume" && (
                  <div className="col-4">
                    <label className="form-label">Total Volume :</label>
                    <input
                      type="numeric"
                      step="any"
                      name={`items.${index}.volume`}
                      placeholder="Total Volume"
                      className="form-control required"
                      autoComplete="off"
                      {...register(`items.${index}.volume`, {
                        required: "Total Volume harus diisi",
                      })}
                    />
                    {errors?.items?.[index]?.volume && (
                      <label className="label-error">
                        {errors.items?.[index]?.volume.message}
                      </label>
                    )}
                  </div>
                )}

                <div className="col-3">
                  <label className="form-label">Nominal :</label>
                  <Controller
                    control={control}
                    name={`items.${index}.nominal`}
                    render={({ field: { value, onChange } }) => (
                      <CurrencyInput
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
                  {errors?.items?.[index]?.nominal && (
                    <label className="label-error">
                      {errors.items?.[index]?.nominal.message}
                    </label>
                  )}
                </div>
              </div>
            ))}
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
