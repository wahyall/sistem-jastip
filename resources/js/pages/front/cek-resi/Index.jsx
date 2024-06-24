import axios from "@/libs/axios";
import { router } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { For, If, Show } from "react-haiku";
import { useForm } from "react-hook-form";

export default function Index() {
  const [data, setData] = useState();
  const [error, setError] = useState();

  const resi = location.pathname.split("/")[2];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: { resi },
  });

  useEffect(() => {
    if (resi) mutate({ resi });
  }, [resi]);

  const { mutate, isLoading } = useMutation(
    (data) => axios.post("/cek-resi", data).then((res) => res.data),
    {
      onSuccess: (data) => {
        setData(data);
        setError(null);
      },
      onError: (err) => {
        setData(null);
        setError(err.response.data);
      },
    }
  );

  const statusNumber = useMemo(() => {
    if (data?.status == "Pengiriman Dibuat") return 1;
    if (data?.status == "Diproses") return 2;
    if (data?.status == "Delivery") return 3;
    if (data?.status == "Delivered") return 4;
  }, [data]);

  const lineWidth = useMemo(() => {
    if (data?.status == "Pengiriman Dibuat") return "w-[20%]";
    if (data?.status == "Diproses") return "w-[50%]";
    if (data?.status == "Delivery") return "w-[85%]";
    if (data?.status == "Delivered") return "w-[100%]";
  }, [data]);

  const [openFoto, setOpenFoto] = useState(false);

  const onSubmit = (data) => {
    router.visit(`/track/${data.resi}`);
  };

  return (
    <main>
      <div
        className="min-h-[calc(100vh_-_50px)] flex flex-col items-center justify-center bg-cover bg-center p-5 lg:p-10"
        style={{ backgroundImage: "url(/assets/media/hero-image.jpg)" }}
      >
        <div className="bg-white p-4 rounded w-[420px] max-w-full">
          <h1 className="mb-3 font-medium text-xl">Lacak Pengiriman</h1>
          <form
            className="flex items-center gap-4 "
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              placeholder="Masukkan No. Resi..."
              className="input input-bordered w-full"
              {...register("resi", { required: true })}
            />
            <button
              className={`btn btn-primary ${isLoading && "loading"}`}
              disabled={isLoading}
              data-ripplet
            >
              Lacak
            </button>
          </form>

          {/* <If isTrue={data && !error}>
            <div className="divider my-4"></div>
            <div className="relative">
              <div
                className="absolute bg-slate-100 w-[30px]"
                style={{ borderRadius: "30px", left: 0, top: 0, bottom: 0 }}
              ></div>
              <For
                each={data?.trackings}
                render={(item) => (
                  <div
                    className="grid relative z-10 mb-10"
                    style={{ gridTemplateColumns: "30px 1fr", gap: "2rem" }}
                  >
                    <div className="w-[30px] h-[30px] flex items-center justify-center bg-green-400 rounded-full">
                      <i className="la la-check text-white fs-4"></i>
                    </div>
                    <div>
                      <h5>{item.status}</h5>
                      <div>
                        <strong className="text-slate-600 text-sm">
                          Tanggal:{" "}
                        </strong>{" "}
                        {item.tanggal_indo}, {item.jam}
                      </div>
                      <Show>
                        <Show.When isTrue={item.status == "Pengiriman Dibuat"}>
                          <div>
                            <strong className="text-slate-600 text-sm">
                              Cabang:{" "}
                            </strong>
                            {data.cabang.name}
                          </div>
                        </Show.When>
                        <Show.When isTrue={item.status == "Diproses"}>
                          <div>
                            <strong className="text-slate-600 text-sm">
                              Note:
                            </strong>{" "}
                            {item.catatan ?? "-"}
                          </div>
                        </Show.When>
                        <Show.When isTrue={item.status == "Delivery"}>
                          <div>
                            <strong className="text-slate-600 text-sm">
                              Note:
                            </strong>{" "}
                            {item.catatan ?? "-"}
                          </div>
                          <div>
                            <strong className="text-slate-600 text-sm">
                              Kurir:
                            </strong>{" "}
                            {item.kurir?.name}
                          </div>
                        </Show.When>
                        <Show.When isTrue={item.status == "Delivered"}>
                          <div className="mb-4">
                            <strong className="text-slate-600 text-sm">
                              Note:
                            </strong>{" "}
                            {item.catatan ?? "-"}
                          </div>
                          <div>
                            <img
                              src={`/${item.foto}`}
                              className="w-full max-w-[400px]"
                            />
                          </div>
                        </Show.When>
                      </Show>
                    </div>
                  </div>
                )}
              />
            </div>
          </If> */}

          <If isTrue={!data && error}>
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

        <If isTrue={data && !error}>
          <div className="bg-white p-8 rounded w-[960px] max-w-full mt-10">
            <div className="lg:flex lg:justify-between grid grid-cols-4 relative">
              <div className="absolute bg-slate-200 h-1 left-10 right-10 top-5 lg:top-10">
                <div
                  className={`${lineWidth} absolute bg-primary h-1 inline-block`}
                ></div>
              </div>
              <div className="flex lg:justify-center items-center flex-col relative text-center">
                <div
                  className={`w-12 lg:w-20 h-12 lg:h-20 rounded-full flex items-center justify-center ${
                    statusNumber >= 1 ? "bg-primary" : "bg-slate-100"
                  }`}
                >
                  <i
                    className={`la la-box text-xl lg:text-4xl ${
                      statusNumber >= 1 ? "text-white" : "text-slate-700"
                    }`}
                  ></i>
                </div>
                <div className="mt-2 font-medium text-xs">
                  Pengiriman Dibuat
                </div>
              </div>
              <div className="flex lg:justify-center items-center flex-col relative text-center">
                <div
                  className={`w-12 lg:w-20 h-12 lg:h-20 rounded-full flex items-center justify-center ${
                    statusNumber >= 2 ? "bg-primary" : "bg-slate-100"
                  }`}
                >
                  <i
                    className={`la la-car text-xl lg:text-4xl ${
                      statusNumber >= 2 ? "text-white" : "text-slate-700"
                    }`}
                  ></i>
                </div>
                <div className="mt-2 font-medium text-xs">Diproses</div>
              </div>
              <div className="flex lg:justify-center items-center flex-col relative text-center">
                <div
                  className={`w-12 lg:w-20 h-12 lg:h-20 rounded-full flex items-center justify-center ${
                    statusNumber >= 3 ? "bg-primary" : "bg-slate-100"
                  }`}
                >
                  <i
                    className={`la la-shipping-fast text-xl lg:text-4xl ${
                      statusNumber >= 3 ? "text-white" : "text-slate-700"
                    }`}
                  ></i>
                </div>
                <div className="mt-2 font-medium text-xs">Delivery</div>
              </div>
              <div className="flex lg:justify-center items-center flex-col relative text-center">
                <div
                  className={`w-12 lg:w-20 h-12 lg:h-20 rounded-full flex items-center justify-center ${
                    statusNumber >= 4 ? "bg-primary" : "bg-slate-100"
                  }`}
                >
                  <i
                    className={`la la-check-circle text-xl lg:text-4xl ${
                      statusNumber >= 4 ? "text-white" : "text-slate-700"
                    }`}
                  ></i>
                </div>
                <div className="mt-2 font-medium text-xs">Delivered</div>
              </div>
            </div>
            <div className="divider"></div>
            <h2 className="text-center text-xl text-primary font-semibold mb-8">
              Status Paket Anda
            </h2>
            <div className="grid gap-4 lg:grid-cols-2 max-w-[720px] mx-auto">
              <div className="p-4 border rounded">
                <h6 className="text-primary mb-4">Details</h6>
                <div className="grid grid-cols-3 gap-y-4 gap-x-2">
                  <div className="text-xs">
                    <div className="font-bold">Tgl Pengiriman</div>
                    <div>{data?.tanggal_kirim}</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold">Tujuan</div>
                    <div>{data?.penerima?.city?.name}</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold">Penerima</div>
                    <div>{data?.penerima?.nama}</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold">Asal</div>
                    <div>{data?.pengirim?.city?.name}</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold">Pengirim</div>
                    <div>{data?.pengirim?.nama}</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold">Status</div>
                    <div>{data?.status}</div>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded">
                <h6 className="text-primary mb-4">History</h6>
                <For
                  each={data?.trackings}
                  render={(tracking) => (
                    <div className="grid gap-4 grid-cols-[25%_1rem_1fr] pb-8 relative">
                      <div className="absolute top-0 left-[calc(25%_+_1.2rem)] w-[2px] bg-primary h-full opacity-50"></div>
                      <div className="text-xs">
                        <div>{tracking.hari_indo}</div>
                        <div className="font-bold">{tracking.tanggal_indo}</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="text-xs">
                        <div>{tracking.jam}</div>
                        <div className="font-bold mt-1">
                          {tracking.catatan ?? "-"}
                        </div>

                        {tracking.status === "Delivered" && tracking.foto && (
                          <div className="mt-2">
                            <a
                              className="btn btn-ghost text-primary btn-sm normal-case -ml-2"
                              onClick={() => setOpenFoto(true)}
                            >
                              Foto
                              <i className="la la-external-link-alt ml-1 text-lg"></i>
                            </a>

                            {openFoto && (
                              <div
                                className="fixed inset-0 bg-slate-700/70 z-[100] flex justify-center items-center p-5"
                                onClick={() => setOpenFoto(false)}
                              >
                                <img
                                  src={`/${tracking.foto}`}
                                  className="w-screen max-w-full"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </If>
      </div>
    </main>
  );
}
