import React, { memo, useMemo, useState } from "react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";

function Form({ close, selected }) {
  const [file, setFile] = useState([]);
  const queryClient = useQueryClient();
  const { data: banner } = useQuery(
    [`/data/banner/${selected}/edit`],
    () => {
      KTApp.block("#form-banner");
      return axios.get(`/data/banner/${selected}/edit`).then((res) => res.data);
    },
    {
      onSettled: () => KTApp.unblock("#form-banner"),
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
    values: { ...banner },
  });
  const { mutate: submit } = useMutation(
    (data) =>
      axios.post(
        selected ? `/data/banner/${selected}/update` : "/data/banner/store",
        data
      ),
    {
      onSettled: () => KTApp.unblock("#form-banner"),
      onError: (error) => {
        for (const key in error.response.data.errors) {
          if (Object.hasOwnProperty.call(error.response.data.errors, key)) {
            setError(key, { message: error.response.data.errors[key][0] });
          }
        }
      },
      onSuccess: ({ data }) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["/data/banner/paginate"]);
        close();
      },
    }
  );

  const onSubmit = (data) => {
    KTApp.block("#form-banner");

    const formData = new FormData(document.querySelector("#form-banner"));
    if (file[0]?.file) {
      formData.append("image", file[0]?.file);
    }

    submit(formData);
  };

  return (
    <form
      className="card mb-12"
      id="form-banner"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="card-header">
        <div className="card-title w-100">
          <h3>
            {banner?.id
              ? `Edit Banner: ${banner?.nama || ""}`
              : "Tambah Banner"}
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
            <div className="mb-8">
              <label className="form-label">Banner :</label>
              <FileUpload
                files={selected ? banner?.image_url : file}
                onupdatefiles={setFile}
                allowMultiple={false}
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
              <label htmlFor="url" className="form-label">
                URL (Optional) :
              </label>
              <input
                type="text"
                name="url"
                id="url"
                placeholder="URL"
                className="form-control required"
                autoComplete="off"
                {...register("url")}
              />
              {errors?.url && (
                <label className="label-error">{errors.url.message}</label>
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
