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
import FileUpload from "../components/FileUpload";
import useDelete from "@/hooks/useDelete";

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

function Form({ close, selected }) {
  const queryClient = useQueryClient();
  const { data: pengiriman = { trackings: [] }, refetch } = useQuery(
    [`/tracking/${selected}/edit`],
    () => {
      KTApp.block("#form-pengiriman");
      return axios.get(`/tracking/${selected}/edit`).then((res) => res.data);
    },
    {
      onSettled: () => KTApp.unblock("#form-pengiriman"),
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
    reset,
    setValue,
  } = useForm();
  const { mutate: submit } = useMutation(
    (data) => axios.post("/tracking/store", data),
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
        queryClient.invalidateQueries(["/tracking/paginate"]);
        queryClient.invalidateQueries([
          "/tracking/paginate?status=Pengiriman Dibuat",
        ]);
        queryClient.invalidateQueries(["/tracking/paginate?status=Diproses"]);
        queryClient.invalidateQueries(["/tracking/paginate?status=Delivery"]);
        queryClient.invalidateQueries(["/tracking/paginate?status=Delivered"]);
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
  function handleAddTracking() {
    const lastStatus = pengiriman.trackings[pengiriman.trackings.length - 1];
    if (lastStatus.status == "Pengiriman Dibuat")
      setValue("status", "Diproses");
    else if (lastStatus.status == "Diproses") setValue("status", "Delivery");
    else if (lastStatus.status == "Delivery") setValue("status", "Delivered");

    setOpenForm(true);
  }

  function handleClose() {
    setOpenForm(false);
    reset();
    setFile([]);
  }

  function onSubmit(data) {
    const formData = new FormData(document.querySelector("#form-tracking"));
    formData.append("pengiriman_id", pengiriman.id);

    if (file[0]?.file) {
      formData.append("foto", file[0].file);
    }

    submit(formData);
  }

  const { delete: deleteTracking } = useDelete({
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries(["/tracking/paginate"]);
      queryClient.invalidateQueries([
        "/tracking/paginate?status=Pengiriman Dibuat",
      ]);
      queryClient.invalidateQueries(["/tracking/paginate?status=Diproses"]);
      queryClient.invalidateQueries(["/tracking/paginate?status=Delivery"]);
      queryClient.invalidateQueries(["/tracking/paginate?status=Delivered"]);
    },
  });

  return (
    <div className="card mb-12" id="form-pengiriman">
      <div className="card-header">
        <div className="card-title w-100">
          <h3>{pengiriman?.id ? `Update Tracking` : "Tracking"}</h3>
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
          <h2 className="mb-0">
            Resi: <span className="fw-normal">{pengiriman.resi}</span>
          </h2>
          {pengiriman.status != "Delivered" && (
            <button
              type="button"
              className="btn btn-primary btn-icon rounded-circle btn-sm w-30px h-30px"
              onClick={handleAddTracking}
            >
              <i className="la la-plus fs-4"></i>
            </button>
          )}
        </div>
        <div className="position-relative">
          <div
            className="position-absolute bg-light w-30px"
            style={{ borderRadius: "30px", left: 0, top: 0, bottom: 0 }}
          ></div>
          <For
            each={pengiriman.trackings}
            render={(item) => (
              <div
                className="d-grid position-relative z-1 mb-10"
                style={{ gridTemplateColumns: "30px 1fr", gap: "2rem" }}
              >
                <div className="w-30px h-30px d-flex align-items-center justify-content-center bg-success rounded-circle">
                  <i className="la la-check text-white fs-4"></i>
                </div>
                <div>
                  <h5>
                    {item.status}
                    <button
                      type="button"
                      className="btn btn-sm btn-icon"
                      onClick={() =>
                        deleteTracking(`/tracking/${item.uuid}/destroy`)
                      }
                    >
                      <i className="la la-trash text-danger fs-4"></i>
                    </button>
                  </h5>
                  <div>
                    <strong className="text-muted">Tanggal: </strong>{" "}
                    {item.tanggal_indo}, {item.jam}
                  </div>
                  <Show>
                    <Show.When isTrue={item.status == "Pengiriman Dibuat"}>
                      <div>
                        <strong className="text-muted">Cabang: </strong>
                        {pengiriman.cabang.name}
                      </div>
                    </Show.When>
                    <Show.When isTrue={item.status == "Diproses"}>
                      <div>
                        <strong className="text-muted">Note:</strong>{" "}
                        {item.catatan ?? "-"}
                      </div>
                    </Show.When>
                    <Show.When isTrue={item.status == "Delivery"}>
                      <div>
                        <strong className="text-muted">Note:</strong>{" "}
                        {item.catatan ?? "-"}
                      </div>
                      <div>
                        <strong className="text-muted">Kurir:</strong>{" "}
                        {item.kurir?.name}
                      </div>
                    </Show.When>
                    <Show.When isTrue={item.status == "Delivered"}>
                      <div className="mb-4">
                        <strong className="text-muted">Note:</strong>{" "}
                        {item.catatan ?? "-"}
                      </div>
                      <div>
                        {Boolean(item.foto) && (
                          <img
                            src={`/${item.foto}`}
                            className="w-100 mw-400px"
                          />
                        )}
                      </div>
                    </Show.When>
                  </Show>
                </div>
              </div>
            )}
          />

          {openForm && (
            <form
              id="form-tracking"
              onSubmit={handleSubmit(onSubmit)}
              className="d-grid position-relative z-1 mb-10 mw-400px"
              style={{ gridTemplateColumns: "30px 1fr", gap: "2rem" }}
            >
              <div className="w-30px h-30px d-flex align-items-center justify-content-center bg-success rounded-circle opacity-50">
                <i className="la la-check text-white fs-4"></i>
              </div>
              <div>
                <div className="mb-4">
                  <label htmlFor="status" className="form-label">
                    Status :
                  </label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field: { value, onChange } }) => (
                      <Select
                        isDisabled={user?.role == "kurir"}
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
                    <label className="label-error">
                      {errors.status.message}
                    </label>
                  )}
                </div>
                <div className="d-flex gap-5">
                  <div className="mb-4">
                    <Controller
                      control={control}
                      name="tanggal"
                      render={({ field: { value, onChange } }) => (
                        <Flatpickr
                          name="tanggal"
                          className="form-control"
                          value={value}
                          onChange={(date, val) => onChange(val)}
                          placeholder="Tanggal"
                        />
                      )}
                      rules={{ required: "Tanggal harus diisi" }}
                    />
                    {errors?.tanggal && (
                      <label className="label-error">
                        {errors.tanggal.message}
                      </label>
                    )}
                  </div>
                  <div className="mb-4">
                    <Controller
                      control={control}
                      name="jam"
                      render={({ field: { value, onChange } }) => (
                        <Flatpickr
                          name="jam"
                          className="form-control"
                          value={value}
                          onChange={(date, val) => onChange(val)}
                          placeholder="Jam"
                          options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i",
                          }}
                        />
                      )}
                      rules={{ required: "Jam harus diisi" }}
                    />
                    {errors?.jam && (
                      <label className="label-error">
                        {errors.jam.message}
                      </label>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    name="catatan"
                    id="catatan"
                    placeholder="Catatan"
                    className="form-control"
                    autoComplete="off"
                    {...register("catatan")}
                  />
                  {errors?.catatan && (
                    <label className="label-error">
                      {errors.catatan.message}
                    </label>
                  )}
                </div>
                {watch("status") == "Delivery" && (
                  <div className="mb-4">
                    <Controller
                      control={control}
                      name="kurir_id"
                      render={({ field: { value, onChange } }) => (
                        <Select
                          name="kurir_id"
                          isLoading={isKurirsLoading}
                          options={kurirOptions}
                          hideSelectedOptions={false}
                          placeholder="Pilih Kurir"
                          value={kurirOptions.find((opt) => opt.value == value)}
                          onChange={(val) => onChange(val.value)}
                        />
                      )}
                      rules={{ required: "Kurir harus diisi" }}
                    />
                    {errors?.kurir_id && (
                      <label className="label-error">
                        {errors.kurir_id.message}
                      </label>
                    )}
                  </div>
                )}
                {watch("status") == "Delivered" && (
                  <div className="mb-4">
                    <FileUpload
                      files={file}
                      onupdatefiles={setFile}
                      allowMultiple={false}
                      labelIdle='Foto - <span class="filepond--label-action">Browse</span>'
                      acceptedFileTypes={["image/*"]}
                    />
                    {errors?.foto && (
                      <label className="label-error">
                        {errors.foto.message}
                      </label>
                    )}
                  </div>
                )}
                <div className="d-flex justify-content-end gap-4 mt-4">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleClose}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Simpan
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(Form);
