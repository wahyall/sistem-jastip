import React, { memo, useMemo, useState } from "react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useSatuanBarang } from "@/services";
import FileUpload from "../../components/FileUpload";

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
    if (file[0]?.file) {
      formData.append("gambar", file[0]?.file);
    }

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
          <div className="col-md-6">
            <div className="mb-8">
              <label className="form-label">Gambar :</label>
              <FileUpload
                files={
                  selected && produk?.gambar ? `${produk?.gambar_url}` : file
                }
                onupdatefiles={setFile}
                allowMultiple={false}
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                acceptedFileTypes={["image/*"]}
              />
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
