import React, { memo, useMemo, useState } from "react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import {
  useCabang,
  usePengirim,
  usePenerima,
  useKategoriBarang,
  useSatuanBarang,
  useJenisPembayaran,
} from "@/services";
import { usePage } from "@inertiajs/react";
import { currency } from "@/libs/utils";
import CurrencyInput from "react-currency-input-field";
import { useEffect } from "react";

import Flatpickr from "react-flatpickr";

function Form({ close, selected }) {
  const queryClient = useQueryClient();
  const { data: pengiriman } = useQuery(
    [`/pengiriman/${selected}/edit`],
    () => {
      KTApp.block("#form-pengiriman");
      return axios.get(`/pengiriman/${selected}/edit`).then((res) => res.data);
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
    setValue,
  } = useForm({
    values: { ...pengiriman },
  });
  const { mutate: submit } = useMutation(
    (data) =>
      axios.post(
        selected ? `/pengiriman/${selected}/update` : "/pengiriman/store",
        data
      ),
    {
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
        queryClient.invalidateQueries(["/pengiriman/paginate"]);
        close();
      },
    }
  );

  const {
    auth: { user },
  } = usePage().props;

  const { data: cabangs = [], isLoading: isCabangsLoading } = useCabang(null, {
    enabled: user.role == "admin",
  });
  const cabangOptions = useMemo(
    () =>
      cabangs.map((item) => ({
        label: item.name,
        value: item.id,
      })),
    [cabangs]
  );

  const { data: pengirims = [], isLoading: isPengirimsLoading } = usePengirim();
  const pengirimOptions = useMemo(
    () =>
      pengirims.map((item) => ({
        label: item.nama,
        value: item.id,
      })),
    [pengirims]
  );

  const { data: penerimas = [], isLoading: isPenerimasLoading } = usePenerima();
  const penerimasOptions = useMemo(
    () =>
      penerimas.map((item) => ({
        label: item.nama,
        value: item.id,
      })),
    [penerimas]
  );

  const { data: ketagoris = [], isLoading: isKategorisLoading } =
    useKategoriBarang();
  const kategoriOptions = useMemo(
    () =>
      ketagoris.map((item) => ({
        label: item.nama,
        value: item.id,
      })),
    [ketagoris]
  );

  const { data: satuans = [], isLoading: isSatuansLoading } = useSatuanBarang();
  const satuanOptions = useMemo(
    () =>
      satuans.map((item) => ({
        label: item.nama,
        value: item.id,
      })),
    [satuans]
  );

  const selectedCabang = useMemo(
    () => cabangs.find((item) => item.id === watch("cabang_id")),
    [cabangs, watch("cabang_id")]
  );
  const selectedPengirim = useMemo(
    () => pengirims.find((item) => item.id === watch("pengirim_id")),
    [pengirims, watch("pengirim_id")]
  );
  const selectedPenerima = useMemo(
    () => penerimas.find((item) => item.id === watch("penerima_id")),
    [penerimas, watch("penerima_id")]
  );

  const { data: ongkirs = [], isLoading: isOngkirsLoading } = useQuery({
    queryKey: [
      "ongkir",
      selectedPengirim?.city_code,
      selectedPenerima?.city_code,
    ],
    queryFn: () =>
      axios
        .post("/data/ongkir/ongkir", {
          from_city_code: selectedPengirim?.city_code,
          to_city_code: selectedPenerima?.city_code,
        })
        .then((res) => res.data),
    enabled:
      Boolean(selectedPengirim?.city_code) &&
      Boolean(selectedPenerima?.city_code),
    cacheTime: 0,
  });
  const ongkirOptions = useMemo(
    () =>
      ongkirs.map((item) => ({
        label: `${item.layanan_ongkir.nama} - ${currency(item.ongkir)}`,
        value: item.layanan_ongkir_id,
      })),
    [ongkirs]
  );
  const selectedOngkir = useMemo(
    () =>
      ongkirs.find(
        (item) => item.layanan_ongkir_id === watch("layanan_ongkir_id")
      ),
    [ongkirs, watch("layanan_ongkir_id")]
  );

  useEffect(() => {
    if (!watch("total_berat") || !selectedOngkir) return;

    setValue("total_ongkir", watch("total_berat") * selectedOngkir.ongkir);
  }, [watch("total_berat"), selectedOngkir]);

  const { data: jenisPembayarans = [], isLoading: isJenisPembayaransLoading } =
    useJenisPembayaran();
  const jenisPembayaranOptions = useMemo(
    () =>
      jenisPembayarans.map((item) => ({
        label: item.nama,
        value: item.id,
      })),
    [jenisPembayarans]
  );

  const statusOptions = [
    {
      label: "Pengiriman Dibuat",
      value: "Pengiriman Dibuat",
    },
    {
      label: "Diproses",
      value: "Diproses",
    },
    {
      label: "Delivery",
      value: "Delivery",
    },
    {
      label: "Delivered",
      value: "Delivered",
    },
  ];

  const [step, setStep] = useState(1);
  const onSubmit = (data) => {
    if (pengiriman?.id) {
      if (step == 4) {
        KTApp.block("#form-pengiriman");
        submit(data);
      } else {
        setStep((prev) => prev + 1);
      }
    } else {
      if (step == 3) {
        KTApp.block("#form-pengiriman");
        submit(data);
      } else {
        setStep((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    KTUtil.scrollTop();
  }, [step]);

  return (
    <form
      className="card mb-12"
      id="form-pengiriman"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="card-header">
        <div className="card-title w-100">
          <h3>
            {pengiriman?.id
              ? `Edit Pengiriman: ${pengiriman?.resi || ""}`
              : "Tambah Pengiriman"}
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
        <ol class="breadcrumb breadcrumb-separatorless text-muted fs-6 fw-semibold">
          <li class="breadcrumb-item">
            <span
              className={`w-30px h-30px me-2 d-flex justify-content-center align-items-center text-white fs-5 rounded-circle ${
                step == 1 ? "bg-primary" : "bg-secondary"
              }`}
            >
              1
            </span>
            Pengirim & Penerima
          </li>
          <li className="ms-3 me-5">
            <i className="fa fa-chevron-right"></i>
          </li>
          <li class="breadcrumb-item">
            <span
              className={`w-30px h-30px me-2 d-flex justify-content-center align-items-center text-white fs-5 rounded-circle ${
                step == 2 ? "bg-primary" : "bg-secondary"
              }`}
            >
              2
            </span>
            Barang
          </li>
          <li className="ms-3 me-5">
            <i className="fa fa-chevron-right"></i>
          </li>
          <li class="breadcrumb-item">
            <span
              className={`w-30px h-30px me-2 d-flex justify-content-center align-items-center text-white fs-5 rounded-circle ${
                step == 3 ? "bg-primary" : "bg-secondary"
              }`}
            >
              3
            </span>
            Biaya
          </li>
          <li className="ms-3 me-5">
            <i className="fa fa-chevron-right"></i>
          </li>
          {Boolean(pengiriman?.id) && (
            <li class="breadcrumb-item">
              <span
                className={`w-30px h-30px me-2 d-flex justify-content-center align-items-center text-white fs-5 rounded-circle ${
                  step == 4 ? "bg-primary" : "bg-secondary"
                }`}
              >
                4
              </span>
              Tracking
            </li>
          )}
        </ol>

        <div className="separator my-10"></div>

        {step == 1 && (
          <div className="row">
            <div className="col-md-8">
              {user.role == "admin" && (
                <div className="mb-8">
                  <label htmlFor="cabang_id" className="form-label">
                    Cabang :
                  </label>
                  <Controller
                    control={control}
                    name="cabang_id"
                    render={({ field: { value, onChange } }) => (
                      <Select
                        isLoading={isCabangsLoading}
                        options={cabangOptions}
                        hideSelectedOptions={false}
                        value={cabangOptions.find((opt) => opt.value == value)}
                        onChange={(val) => onChange(val.value)}
                      />
                    )}
                    rules={{ required: "Cabang harus diisi" }}
                  />
                  {errors?.cabang_id && (
                    <label className="label-error">
                      {errors.cabang_id.message}
                    </label>
                  )}

                  {Boolean(selectedCabang) && (
                    <div className="mt-2">
                      <div>
                        Nama: <strong>{selectedCabang.name}</strong>
                      </div>
                      <div>
                        Alamat: <strong>{selectedCabang.address}</strong>
                      </div>
                      <div>
                        No. Telepon: <strong>{selectedCabang.phone}</strong>
                      </div>
                      <div>
                        Email: <strong>{selectedCabang.email}</strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mb-8">
                <label htmlFor="pengirim_id" className="form-label">
                  Pengirim :
                </label>
                <Controller
                  control={control}
                  name="pengirim_id"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      isLoading={isPengirimsLoading}
                      options={pengirimOptions}
                      hideSelectedOptions={false}
                      value={pengirimOptions.find((opt) => opt.value == value)}
                      onChange={(val) => onChange(val.value)}
                    />
                  )}
                  rules={{ required: "Pengirim harus diisi" }}
                />
                {errors?.pengirim_id && (
                  <label className="label-error">
                    {errors.pengirim_id.message}
                  </label>
                )}

                {Boolean(selectedPengirim) && (
                  <div className="mt-2">
                    <div>
                      Nama: <strong>{selectedPengirim.nama}</strong>
                    </div>
                    <div>
                      Alamat: <strong>{selectedPengirim.alamat}</strong>
                    </div>
                    <div>
                      Provinsi:{" "}
                      <strong>{selectedPengirim.province.name}</strong>
                    </div>
                    <div>
                      Kota: <strong>{selectedPengirim.city.name}</strong>
                    </div>
                    <div>
                      Kecamatan:{" "}
                      <strong>{selectedPengirim.district.name}</strong>
                    </div>
                    <div>
                      No. Telepon: <strong>{selectedPengirim.telp}</strong>
                    </div>
                    <div>
                      Email: <strong>{selectedPengirim.email}</strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <label htmlFor="penerima_id" className="form-label">
                  Penerima :
                </label>
                <Controller
                  control={control}
                  name="penerima_id"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      isLoading={isPenerimasLoading}
                      options={penerimasOptions}
                      hideSelectedOptions={false}
                      value={penerimasOptions.find((opt) => opt.value == value)}
                      onChange={(val) => onChange(val.value)}
                    />
                  )}
                  rules={{ required: "Penerima harus diisi" }}
                />
                {errors?.penerima_id && (
                  <label className="label-error">
                    {errors.penerima_id.message}
                  </label>
                )}

                {Boolean(selectedPenerima) && (
                  <div className="mt-2">
                    <div>
                      Nama: <strong>{selectedPenerima.nama}</strong>
                    </div>
                    <div>
                      Alamat: <strong>{selectedPenerima.alamat}</strong>
                    </div>
                    <div>
                      Provinsi:{" "}
                      <strong>{selectedPenerima.province.name}</strong>
                    </div>
                    <div>
                      Kota: <strong>{selectedPenerima.city.name}</strong>
                    </div>
                    <div>
                      Kecamatan:{" "}
                      <strong>{selectedPenerima.district.name}</strong>
                    </div>
                    <div>
                      No. Telepon: <strong>{selectedPenerima.telp}</strong>
                    </div>
                    <div>
                      Email: <strong>{selectedPenerima.email}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step == 2 && (
          <div className="row">
            <div className="col-md-8">
              <div className="mb-8">
                <label htmlFor="kategori_barang_id" className="form-label">
                  Kategori Barang :
                </label>
                <Controller
                  control={control}
                  name="kategori_barang_id"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      isLoading={isKategorisLoading}
                      options={kategoriOptions}
                      hideSelectedOptions={false}
                      value={kategoriOptions.find((opt) => opt.value == value)}
                      onChange={(val) => onChange(val.value)}
                    />
                  )}
                  rules={{ required: "Kategori Barang harus diisi" }}
                />
                {errors?.kategori_barang_id && (
                  <label className="label-error">
                    {errors.kategori_barang_id.message}
                  </label>
                )}
              </div>

              <div className="mb-8">
                <label htmlFor="satuan_barang_id" className="form-label">
                  Satuan Barang :
                </label>
                <Controller
                  control={control}
                  name="satuan_barang_id"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      isLoading={isSatuansLoading}
                      options={satuanOptions}
                      hideSelectedOptions={false}
                      value={satuanOptions.find((opt) => opt.value == value)}
                      onChange={(val) => onChange(val.value)}
                    />
                  )}
                  rules={{ required: "Satuan Barang harus diisi" }}
                />
                {errors?.satuan_barang_id && (
                  <label className="label-error">
                    {errors.satuan_barang_id.message}
                  </label>
                )}
              </div>
            </div>

            <div className="col-12"></div>
            <div className="col-md-4">
              <div className="mb-8">
                <label htmlFor="total_berat" className="form-label">
                  Total Berat :
                </label>
                <input
                  type="number"
                  name="total_berat"
                  id="total_berat"
                  placeholder="Total Berat"
                  className="form-control required"
                  autoComplete="off"
                  {...register("total_berat", {
                    required: "Total Berat harus diisi",
                  })}
                />
                {errors?.total_berat && (
                  <label className="label-error">
                    {errors.total_berat.message}
                  </label>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-8">
                <label htmlFor="total_koli" className="form-label">
                  Total Koli :
                </label>
                <input
                  type="number"
                  name="total_koli"
                  id="total_koli"
                  placeholder="Total Koli"
                  className="form-control required"
                  autoComplete="off"
                  {...register("total_koli", {
                    required: "Total Koli harus diisi",
                  })}
                />
                {errors?.total_koli && (
                  <label className="label-error">
                    {errors.total_koli.message}
                  </label>
                )}
              </div>
            </div>

            <div className="col-12">
              <div className="mb-8">
                <label htmlFor="detail_barang" className="form-label">
                  Detail Barang :
                </label>
                <textarea
                  name="detail_barang"
                  id="detail_barang"
                  placeholder="Detail Barang"
                  className="form-control required"
                  autoComplete="off"
                  rows={3}
                  {...register("detail_barang", {
                    required: "Detail Barang harus diisi",
                  })}
                ></textarea>
                {errors?.detail_barang && (
                  <label className="label-error">
                    {errors.detail_barang.message}
                  </label>
                )}
              </div>
            </div>
            <div className="col-12">
              <div className="mb-8">
                <label htmlFor="catatan" className="form-label">
                  Catatan :
                </label>
                <textarea
                  name="catatan"
                  id="catatan"
                  placeholder="Catatan"
                  className="form-control required"
                  autoComplete="off"
                  rows={3}
                  {...register("catatan")}
                ></textarea>
                {errors?.catatan && (
                  <label className="label-error">
                    {errors.catatan.message}
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {step == 3 && (
          <div className="row">
            <div className="col-12">
              <div className="mb-8">
                <label htmlFor="layanan_ongkir_id" className="form-label">
                  Jenis Layanan :
                </label>
                <Controller
                  control={control}
                  name="layanan_ongkir_id"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      isLoading={isOngkirsLoading}
                      options={ongkirOptions}
                      hideSelectedOptions={false}
                      value={ongkirOptions.find((opt) => opt.value == value)}
                      onChange={(val) => onChange(val.value)}
                    />
                  )}
                  rules={{ required: "Jenis Layanan harus diisi" }}
                />
                {errors?.layanan_ongkir_id && (
                  <label className="label-error">
                    {errors.layanan_ongkir_id.message}
                  </label>
                )}
              </div>
            </div>

            <div className="col-6">
              <div className="mb-8">
                <label htmlFor="total_ongkir" className="form-label">
                  Total Ongkir :
                </label>
                <Controller
                  control={control}
                  name="total_ongkir"
                  render={({ field: { value, onChange } }) => (
                    <CurrencyInput
                      id="total_ongkir"
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
                    required: `Total Ongkir harus diisi`,
                  }}
                />
                {errors?.total_ongkir && (
                  <label className="label-error">
                    {errors.total_ongkir.message}
                  </label>
                )}
              </div>
            </div>

            <div></div>

            <div className="col-6">
              <div className="mb-8">
                <label htmlFor="biaya_tambahan" className="form-label">
                  Biaya Tambahan :
                </label>
                <Controller
                  control={control}
                  name="biaya_tambahan"
                  render={({ field: { value, onChange } }) => (
                    <CurrencyInput
                      id="biaya_tambahan"
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
                />
                {errors?.biaya_tambahan && (
                  <label className="label-error">
                    {errors.biaya_tambahan.message}
                  </label>
                )}
              </div>
            </div>
            <div className="col-12">
              <div className="mb-8">
                <label
                  htmlFor="keterangan_biaya_tambahan"
                  className="form-label"
                >
                  Keterangan Biaya Tambahan :
                </label>
                <input
                  type="text"
                  name="keterangan_biaya_tambahan"
                  id="keterangan_biaya_tambahan"
                  placeholder="Keterangan Biaya Tambahan"
                  className="form-control required"
                  autoComplete="off"
                  {...register("keterangan_biaya_tambahan")}
                />
                {errors?.keterangan_biaya_tambahan && (
                  <label className="label-error">
                    {errors.keterangan_biaya_tambahan.message}
                  </label>
                )}
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="jenis_pembayaran_id" className="form-label">
                Cara Pembayaran :
              </label>
              <Controller
                control={control}
                name="jenis_pembayaran_id"
                render={({ field: { value, onChange } }) => (
                  <Select
                    isLoading={isJenisPembayaransLoading}
                    options={jenisPembayaranOptions}
                    hideSelectedOptions={false}
                    value={jenisPembayaranOptions.find(
                      (opt) => opt.value == value
                    )}
                    onChange={(val) => onChange(val.value)}
                  />
                )}
                rules={{ required: "Cara Pembayaran harus diisi" }}
              />
              {errors?.jenis_pembayaran_id && (
                <label className="label-error">
                  {errors.jenis_pembayaran_id.message}
                </label>
              )}
            </div>
          </div>
        )}

        {step == 4 && (
          <div className="row">
            <div className="col-md-6">
              <div className="mb-8">
                <label htmlFor="status" className="form-label">
                  Status :
                </label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field: { value, onChange } }) => (
                    <Select
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
            <div></div>
            <div className="col-md-6">
              <div className="mb-8">
                <label htmlFor="tanggal_kirim" className="form-label">
                  Tanggal Pengiriman :
                </label>
                <Controller
                  control={control}
                  name="tanggal_kirim"
                  render={({ field: { value, onChange } }) => (
                    <Flatpickr
                      className="form-control"
                      value={value}
                      onChange={(date, val) => onChange(val)}
                    />
                  )}
                  rules={{ required: "Tanggal Pengiriman harus diisi" }}
                />
                {errors?.tanggal_kirim && (
                  <label className="label-error">
                    {errors.tanggal_kirim.message}
                  </label>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-8">
                <label htmlFor="tanggal_terima" className="form-label">
                  Tanggal Penerimaan :
                </label>
                <Controller
                  control={control}
                  name="tanggal_terima"
                  render={({ field: { value, onChange } }) => (
                    <Flatpickr
                      className="form-control"
                      value={value}
                      onChange={(date, val) => onChange(val)}
                    />
                  )}
                />
                {errors?.tanggal_terima && (
                  <label className="label-error">
                    {errors.tanggal_terima.message}
                  </label>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="card-footer">
        <div className="d-flex justify-content-between">
          {step > 1 && (
            <button
              type="button"
              className="btn btn-light-primary btn-sm"
              onClick={() => setStep((prev) => prev - 1)}
            >
              <>
                <i className="fa fa-chevron-left me-2"></i>
                Kembali
              </>
            </button>
          )}
          {pengiriman?.id ? (
            <button
              type="submit"
              className="btn btn-primary btn-sm ms-auto d-block"
            >
              {step == 4 ? (
                <>
                  <i className="las la-save"></i>
                  Simpan
                </>
              ) : (
                <>
                  Lanjut
                  <i className="fa fa-chevron-right ms-2"></i>
                </>
              )}
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary btn-sm ms-auto d-block"
            >
              {step == 3 ? (
                <>
                  <i className="las la-save"></i>
                  Simpan
                </>
              ) : (
                <>
                  Lanjut
                  <i className="fa fa-chevron-right ms-2"></i>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default memo(Form);
