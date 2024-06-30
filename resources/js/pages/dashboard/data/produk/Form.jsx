import React, { memo, useMemo, useState } from "react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useSatuanBarang } from "@/services";
import FileUpload from "../../components/FileUpload";
import { If } from "react-haiku";
import Skeleton from "react-loading-skeleton";
import { currency } from "@/libs/utils";

const opsiHargaOptions = [
  { label: "Berat", value: "berat" },
  { label: "Volume", value: "volume" },
];

function Form({ close, selected }) {
  const queryClient = useQueryClient();
  const { data: produk } = useQuery(
    [`/data/produk/${selected}/edit`],
    () => {
      KTApp.block("#form-produk");
      return axios.get(`/data/produk/${selected}/edit`).then((res) => res.data);
    },
    {
      onSettled: () => KTApp.unblock("#form-produk"),
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
    values: { ...produk },
  });
  const { mutate: submit } = useMutation(
    (data) =>
      axios.post(
        selected ? `/data/produk/${selected}/update` : "/data/produk/store",
        data
      ),
    {
      onSettled: () => KTApp.unblock("#form-produk"),
      onError: (error) => {
        for (const key in error.response.data.errors) {
          if (Object.hasOwnProperty.call(error.response.data.errors, key)) {
            setError(key, { message: error.response.data.errors[key][0] });
          }
        }
      },
      onSuccess: ({ data }) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["/data/produk/paginate"]);
        close();
      },
    }
  );

  const onSubmit = (data) => {
    KTApp.block("#form-produk");

    const formData = new FormData(document.querySelector("#form-produk"));
    file.forEach((image, i) => {
      formData.append(`images[$i]`, image.file);
    });

    submit(formData);
  };

  const { data: satuans = [], isLoading: isSatuansLoading } = useSatuanBarang();
  const satuanOptions = useMemo(
    () =>
      satuans.map((item) => ({
        label: item.nama,
        value: item.id,
      })),
    [satuans]
  );

  const volume = useMemo(() => {
    return watch("volume_p") * watch("volume_l") * watch("volume_t");
  }, [watch("volume_p"), watch("volume_l"), watch("volume_t")]);

  const { data: estimasiHarga = [], isFetching: isHargaFetching } = useQuery({
    queryKey: [
      "estimasi-harga",
      watch("satuan_berat_id"),
      watch("satuan_volume_id"),
      watch("berat"),
      volume,
    ],
    queryFn: () =>
      axios
        .post("/data/produk/estimasi-harga", {
          satuan_berat_id: watch("satuan_berat_id"),
          satuan_volume_id: watch("satuan_volume_id"),
          berat: watch("berat"),
          volume,
        })
        .then((res) => res.data),
    enabled:
      Boolean(watch("satuan_berat_id")) &&
      Boolean(watch("satuan_volume_id")) &&
      Boolean(watch("berat")) &&
      Boolean(volume),
  });

  return (
    <form
      className="card mb-12"
      id="form-produk"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="card-header">
        <div className="card-title w-100">
          <h3>
            {produk?.id
              ? `Edit Produk: ${produk?.nama || ""}`
              : "Tambah Produk"}
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
            <div className="mb-8 multiple">
              <label className="form-label">Gambar :</label>
              <FileUpload
                files={
                  selected && produk?.images_url
                    ? [...produk?.images_url]
                    : file
                }
                onupdatefiles={setFile}
                allowMultiple={true}
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                acceptedFileTypes={["image/*"]}
              />
              {errors?.gambar && (
                <label className="label-error">{errors.gambar.message}</label>
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="mb-8">
              <label htmlFor="nama" className="form-label">
                Produk :
              </label>
              <input
                type="text"
                name="nama"
                id="nama"
                placeholder="Produk"
                className="form-control required"
                autoComplete="off"
                {...register("nama", { required: "Produk harus diisi" })}
              />
              {errors?.nama && (
                <label className="label-error">{errors.nama.message}</label>
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="mb-8">
              <label htmlFor="deskripsi" className="form-label">
                Deskripsi :
              </label>
              <textarea
                rows="10"
                name="deskripsi"
                id="deskripsi"
                placeholder="Deskripsi"
                className="form-control required"
                autoComplete="off"
                {...register("deskripsi", {
                  required: "Deskripsi harus diisi",
                })}
              ></textarea>
              {errors?.deskripsi && (
                <label className="label-error">
                  {errors.deskripsi.message}
                </label>
              )}
            </div>
          </div>
          <div className="col-4">
            <div className="mb-8">
              <label htmlFor="berat" className="form-label">
                Berat :
              </label>
              <div className="d-flex gap-4">
                <div>
                  <input
                    step="any"
                    type="number"
                    name="berat"
                    id="berat"
                    placeholder="Berat"
                    className="form-control required w-100px"
                    autoComplete="off"
                    {...register("berat", { required: "Berat harus diisi" })}
                  />
                  {errors?.berat && (
                    <label className="label-error">
                      {errors.berat.message}
                    </label>
                  )}
                </div>
                <div>
                  <Controller
                    control={control}
                    name="satuan_berat_id"
                    render={({ field: { value, onChange } }) => (
                      <Select
                        name="satuan_berat_id"
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
                  {errors?.satuan_berat_id && (
                    <label className="label-error">
                      {errors.satuan_berat_id.message}
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="mb-8">
              <label htmlFor="volume_p" className="form-label">
                Volume :
              </label>
              <div className="d-flex gap-4">
                <div>
                  <input
                    step="any"
                    type="number"
                    name="volume_p"
                    id="volume_p"
                    placeholder="Panjang"
                    className="form-control required w-100px"
                    autoComplete="off"
                    {...register("volume_p", {
                      required: "Panjang harus diisi",
                    })}
                  />
                  {errors?.volume_p && (
                    <label className="label-error">
                      {errors.volume_p.message}
                    </label>
                  )}
                </div>
                <div>
                  <input
                    step="any"
                    type="number"
                    name="volume_l"
                    id="volume_l"
                    placeholder="Lebar"
                    className="form-control required w-100px"
                    autoComplete="off"
                    {...register("volume_l", {
                      required: "Lebar harus diisi",
                    })}
                  />
                  {errors?.volume_l && (
                    <label className="label-error">
                      {errors.volume_l.message}
                    </label>
                  )}
                </div>
                <div>
                  <input
                    step="any"
                    type="number"
                    name="volume_t"
                    id="volume_t"
                    placeholder="Tinggi"
                    className="form-control required w-100px"
                    autoComplete="off"
                    {...register("volume_t", {
                      required: "Tinggi harus diisi",
                    })}
                  />
                  {errors?.volume_t && (
                    <label className="label-error">
                      {errors.volume_t.message}
                    </label>
                  )}
                </div>
                <div>
                  <Controller
                    control={control}
                    name="satuan_volume_id"
                    render={({ field: { value, onChange } }) => (
                      <Select
                        name="satuan_volume_id"
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
                  {errors?.satuan_volume_id && (
                    <label className="label-error">
                      {errors.satuan_volume_id.message}
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="mb-8">
              <label htmlFor="berat" className="form-label">
                Opsi Harga Berdasarkan :
              </label>
              <Controller
                control={control}
                name="opsi_harga"
                render={({ field: { value, onChange } }) => (
                  <Select
                    name="opsi_harga"
                    placeholder="Opsi Harga"
                    options={opsiHargaOptions}
                    hideSelectedOptions={false}
                    value={opsiHargaOptions.find((opt) => opt.value == value)}
                    onChange={(val) => onChange(val.value)}
                  />
                )}
                rules={{ required: "Opsi Harga harus diisi" }}
              />
              {errors?.opsi_harga && (
                <label className="label-error">
                  {errors.opsi_harga.message}
                </label>
              )}
            </div>
          </div>
          <If isTrue={Boolean(estimasiHarga.length)}>
            <If isTrue={!isHargaFetching}>
              <div className="col-12">
                <div className="card d-flex flex-row shadow-none rounded-3 overflow-hidden">
                  <div
                    className="d-flex justify-content-center align-items-center bg-light-primary"
                    style={{ width: "30%", height: "200px" }}
                  >
                    <h4>Estimasi Harga</h4>
                  </div>
                  <div
                    className="d-flex align-items-center bg-light-primary gap-5"
                    style={{ width: "70%", height: "200px" }}
                  >
                    <div>
                      <h5 className="mb-3">Berat</h5>
                      {estimasiHarga.map((opsi) => (
                        <div className="mb-2">
                          <strong>{opsi.nama}</strong>:{" "}
                          <span>{currency(opsi.harga_berat)}</span>
                        </div>
                      ))}
                    </div>
                    <br />
                    <div>
                      <h5 className="mb-3">Volume</h5>
                      {estimasiHarga.map((opsi) => (
                        <div className="mb-2">
                          <strong>{opsi.nama}</strong>:{" "}
                          <span>{currency(opsi.harga_volume)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </If>
          </If>
          <If isTrue={isHargaFetching}>
            <div className="col-12">
              <Skeleton height={200} width="100%" />
            </div>
          </If>
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
