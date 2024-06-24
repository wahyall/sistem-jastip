import axios from "@/libs/axios";
import FileUpload from "@/pages/dashboard/components/FileUpload";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { For, If, Show } from "react-haiku";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Index() {
  const [data, setData] = useState();
  const [error, setError] = useState();

  const [file, setFile] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setErrorForm,
    clearErrors,
    reset,
  } = useForm();

  const { mutate, isLoading } = useMutation(
    (data) => axios.post("/klaim", data).then((res) => res.data),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        setError(null);
        reset();
        setFile([]);
      },
      onError: (err) => {
        setData(null);
        setError(err.response.data);
      },
    }
  );

  useEffect(() => {
    if (file.length) {
      clearErrors("attachment");
    }
  }, [file]);

  const onSubmit = (data) => {
    if (!file.length) {
      setErrorForm("attachment", {
        message: "Foto/Video harus diisi",
      });
      return;
    }

    const formData = new FormData();
    formData.append("resi", data.resi);
    formData.append("catatan", data.catatan);
    formData.append("attachment", file[0].file);
    mutate(formData);
  };

  return (
    <main>
      <div
        className="min-h-[calc(100vh_-_50px)] flex items-center justify-center bg-cover bg-center p-10"
        style={{ backgroundImage: "url(/assets/media/hero-image.jpg)" }}
      >
        <div className="bg-white p-4 rounded w-[560px] max-w-full">
          <h1 className="font-medium text-xl">Ajukan Klaim Barang Rusak</h1>
          <div className="divider my-2"></div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="resi" className="label mb-0">
                No. Resi :
              </label>
              <input
                type="text"
                name="resi"
                id="resi"
                placeholder="No. Resi"
                className="input input-bordered block w-full"
                autoComplete="off"
                {...register("resi", { required: "No. Resi harus diisi" })}
              />
              {errors?.resi && (
                <label className="text-red-400 mt-1 inline-block">
                  {errors.resi.message}
                </label>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="catatan" className="label mb-0">
                Catatan/Keterangan :
              </label>
              <textarea
                type="text"
                name="catatan"
                id="catatan"
                placeholder="Catatan/Keterangan"
                className="textarea input-bordered block w-full"
                autoComplete="off"
                {...register("catatan", {
                  required: "Catatan/Keterangan harus diisi",
                })}
                rows="5"
              ></textarea>
              {errors?.catatan && (
                <label className="text-red-400 mt-1 inline-block">
                  {errors.catatan.message}
                </label>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="attachment" className="label mb-0">
                Foto/Video :
              </label>
              <FileUpload
                files={file}
                onupdatefiles={setFile}
                allowMultiple={false}
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                acceptedFileTypes={["image/*", "video/mp4"]}
              />
              {errors?.attachment && (
                <label className="text-red-400 -mt-2 inline-block">
                  {errors.attachment.message}
                </label>
              )}
            </div>
            <button
              className={`btn btn-primary w-full ${isLoading && "loading"}`}
              disabled={isLoading}
              data-ripplet
            >
              Ajukan Klaim
            </button>
          </form>

          <If isTrue={error}>
            <div className="divider my-4"></div>
            <div role="alert" className="alert alert-error justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error?.message}</span>
            </div>
          </If>
        </div>
      </div>
    </main>
  );
}
