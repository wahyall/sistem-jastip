import React, { memo, useMemo, useState } from "react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { toast } from "react-toastify";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";
import { useCity, useDistrict, useProvince, useSatuanBarang } from "@/services";
import { If } from "react-haiku";
import CurrencyInput from "react-currency-input-field";

function Form({ close, selected }) {
  const queryClient = useQueryClient();
  const { data: tarifKurir } = useQuery(
    [`/data/tarif-kurir/${selected}/edit`],
    () => {
      KTApp.block("#form-tarif-kurir");
      return axios
        .get(`/data/tarif-kurir/${selected}/edit`)
        .then((res) => res.data);
    },
    {
      onSettled: () => KTApp.unblock("#form-tarif-kurir"),
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
    values: { ...tarifKurir },
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
          ? `/data/tarif-kurir/${selected}/update`
          : "/data/tarif-kurir/store",
        data
      ),
    {
      onSettled: () => KTApp.unblock("#form-tarif-kurir"),
      onError: (error) => {
        for (const key in error.response.data.errors) {
          if (Object.hasOwnProperty.call(error.response.data.errors, key)) {
            setError(key, { message: error.response.data.errors[key][0] });
          }
        }
      },
      onSuccess: ({ data }) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["/data/tarif-kurir/paginate"]);
        close();
      },
    }
  );

  const onSubmit = (data) => {
    KTApp.block("#form-tarif-kurir");
    submit(data);
  };

  // console.log(watch());

  const { data: provinces = [], isLoading: isProvincesLoading } = useProvince();
  const provinceOptions = useMemo(
    () =>
      provinces.map((item) => ({
        label: item.name,
        value: item.code,
      })),
    [provinces]
  );

  const { data: cities = [], isLoading: isCitiesLoading } = useCity(
    null,
    `?province_code=${watch("to_province_code")}`,
    { enabled: Boolean(watch("to_province_code")) }
  );
  const cityOptions = useMemo(
    () =>
      cities.map((item) => ({
        label: item.name,
        value: item.code,
      })),
    [cities]
  );

  const { data: districts = [], isLoading: isDistrictsLoading } = useDistrict(
    null,
    `?city_code=${watch("to_city_code")}`,
    { enabled: Boolean(watch("to_city_code")) }
  );
  const districtOptions = useMemo(
    () =>
      districts.map((item) => ({
        label: item.name,
        value: item.code,
      })),
    [districts]
  );

  return (
    <form
      className="card mb-12"
      id="form-tarif-kurir"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="card-header">
        <div className="card-title w-100">
          <h3>
            {tarifKurir?.id
              ? `Edit Tarif Kurir: ${tarifKurir?.nama || ""}`
              : "Tambah Tarif Kurir"}
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
          <div className="col-md-4">
            <div className="mb-8">
              <label htmlFor="nama" className="form-label">
                Provinsi Tujuan :
              </label>
              <Controller
                control={control}
                name="to_province_code"
                render={({ field: { value, onChange } }) => (
                  <Select
                    name="to_province_code"
                    placeholder="Provinsi Tujuan"
                    options={provinceOptions}
                    hideSelectedOptions={false}
                    value={provinceOptions.find((opt) => opt.value == value)}
                    onChange={(val) => {
                      onChange(val.value);
                      setValue("city_code", undefined);
                      setValue("district_code", undefined);
                    }}
                  />
                )}
                rules={{ required: "Provinsi Tujuan harus diisi" }}
              />
              {errors?.to_province_code && (
                <label className="label-error">
                  {errors.to_province_code.message}
                </label>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-8">
              <label htmlFor="city_code" className="form-label">
                Kota Tujuan :
              </label>
              <Controller
                control={control}
                name="to_city_code"
                render={({ field: { value, onChange } }) => (
                  <Select
                    name="to_city_code"
                    placeholder="Kota Tujuan"
                    isLoading={isCitiesLoading}
                    isDisabled={!watch("to_province_code")}
                    options={cityOptions}
                    hideSelectedOptions={false}
                    value={cityOptions.find((opt) => opt.value == value)}
                    onChange={(val) => {
                      onChange(val.value);
                      setValue("district_code", undefined);
                    }}
                  />
                )}
                rules={{ required: "Kota Tujuan harus diisi" }}
              />
              {errors?.city_code && (
                <label className="label-error">
                  {errors.city_code.message}
                </label>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-8">
              <label htmlFor="city_code" className="form-label">
                Kecamatan Tujuan :
              </label>
              <Controller
                control={control}
                name="to_district_code"
                render={({ field: { value, onChange } }) => (
                  <Select
                    name="to_district_code"
                    placeholder="Kecamatan Tujuan"
                    isLoading={isDistrictsLoading}
                    isDisabled={!watch("to_city_code")}
                    options={districtOptions}
                    hideSelectedOptions={false}
                    value={districtOptions.find((opt) => opt.value == value)}
                    onChange={(val) => onChange(val.value)}
                  />
                )}
                rules={{ required: "Kecamatan Tujuan harus diisi" }}
              />
              {errors?.city_code && (
                <label className="label-error">
                  {errors.city_code.message}
                </label>
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="mb-10">
              <label htmlFor="keterangan" className="form-label">
                Keterangan :
              </label>
              <input
                type="text"
                name="keterangan"
                id="keterangan"
                placeholder="Keterangan"
                className="form-control required"
                autoComplete="off"
                {...register("keterangan")}
              />
              {errors?.keterangan && (
                <label className="label-error">
                  {errors.keterangan.message}
                </label>
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
                <div className="col-5">
                  <label className="form-label">Berat (KG) :</label>
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
                  <label className="text-muted" style={{ fontSize: "0.9rem" }}>
                    *) Kosongkan <strong>Input Berat Kanan</strong> jika tidak
                    ada batasan atas
                  </label>
                  {errors?.items?.[index]?.from_berat && (
                    <label className="label-error">
                      {errors.items?.[index]?.from_berat.message}
                    </label>
                  )}
                </div>

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
