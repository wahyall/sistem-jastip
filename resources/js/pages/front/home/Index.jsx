import { memo } from "react";
import BottomNavLayout from "../layouts/BottomNavLayout";
import { useBanner, useKeranjang } from "@/services";
import Skeleton from "react-loading-skeleton";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { currency } from "@/libs/utils";
import { useEffect } from "react";

import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { toast } from "react-toastify";

export default memo(function Index() {
  const [search, setSearch] = useState("");
  const { data: banners = [], isLoading: isBannerLoading } = useBanner();

  function handleSubmit(ev) {
    ev.preventDefault();
    router.visit(`?search=${search}`);
  }

  const params = new URLSearchParams(window.location.search);
  useEffect(() => {
    setSearch(params.get("search"));
  }, [params.get("search")]);

  const produk = useQuery({
    queryKey: ["produk", params.get("search")],
    queryFn: () =>
      axios
        .post("/data/produk/paginate", { search: params.get("search") })
        .then((res) => res.data),
  });

  const [openSheet, setOpenSheet] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState();

  console.log({ openSheet, selectedProduk });

  return (
    <>
      <BottomNavLayout title="Beranda">
        <section className="mb-4">
          {isBannerLoading ? (
            <Skeleton className="aspect-[2/1]" />
          ) : (
            <Splide aria-label="My Favorite Images">
              {banners.map((banner) => (
                <SplideSlide>
                  {banner.url ? (
                    <a href={banner.url} target="_blank">
                      <img
                        src={banner.image_url}
                        alt="Banner"
                        className="aspect-[2/1] object-cover rounded-md"
                      />
                    </a>
                  ) : (
                    <img
                      src={banner.image_url}
                      alt="Banner"
                      className="aspect-[2/1] object-cover rounded-md"
                    />
                  )}
                </SplideSlide>
              ))}
            </Splide>
          )}
        </section>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-4 px-5 mb-4"
        >
          <label className="input input-bordered flex items-center gap-2 flex-1">
            <input
              type="text"
              className="grow"
              placeholder="Cari Produk..."
              value={search}
              onChange={(ev) => setSearch(ev.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <button className="btn btn-primary text-white" type="submit">
            Cari
          </button>
        </form>

        <section>
          {produk.isFetching ? (
            <Skeleton height={400} />
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-4">
                {produk.data.data.map((prod) => (
                  <div className="card card-compact bg-base-100 shadow overflow-hidden">
                    <Link href={`/produk/${prod.uuid}`}>
                      <figure>
                        <img
                          src={prod.thumbnail}
                          alt={prod.nama}
                          className="aspect-video object-cover"
                        />
                      </figure>
                    </Link>
                    <div className="card-body">
                      <Link href={`/produk/${prod.uuid}`}>
                        <h2 className="card-title">{prod.nama}</h2>
                        {prod.opsi_harga == "berat" ? (
                          <p>
                            {currency(
                              prod.opsi_harga_pengiriman[0].harga_berat
                            )}
                          </p>
                        ) : (
                          <p>
                            {currency(
                              prod.opsi_harga_pengiriman[0].harga_volume
                            )}
                          </p>
                        )}
                      </Link>
                      <div className="card-actions justify-end mt-2">
                        <button
                          className="btn btn-outline btn-primary btn-sm text-white w-full"
                          onClick={() => {
                            setSelectedProduk(prod);
                            setOpenSheet(true);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="200"
                            height="200"
                            viewBox="0 0 24 24"
                            className="h-6 w-6"
                          >
                            <g fill="currentColor">
                              <path d="M13.75 9a.75.75 0 0 0-1.5 0v1.25H11a.75.75 0 0 0 0 1.5h1.25V13a.75.75 0 0 0 1.5 0v-1.25H15a.75.75 0 0 0 0-1.5h-1.25V9Z" />
                              <path
                                fill-rule="evenodd"
                                d="M1.293 2.751a.75.75 0 0 1 .956-.459l.301.106c.617.217 1.14.401 1.553.603c.44.217.818.483 1.102.899c.282.412.399.865.452 1.362l.011.108H17.12c.819 0 1.653 0 2.34.077c.35.039.697.101 1.003.209c.3.105.631.278.866.584c.382.496.449 1.074.413 1.66c-.035.558-.173 1.252-.338 2.077l-.01.053l-.002.004l-.508 2.47c-.15.726-.276 1.337-.439 1.82c-.172.51-.41.96-.837 1.308c-.427.347-.916.49-1.451.556c-.505.062-1.13.062-1.87.062H10.88c-1.345 0-2.435 0-3.293-.122c-.897-.127-1.65-.4-2.243-1.026c-.547-.576-.839-1.188-.985-2.042c-.137-.8-.15-1.848-.15-3.3V7.038c0-.74-.002-1.235-.043-1.615c-.04-.363-.109-.545-.2-.677c-.087-.129-.22-.25-.524-.398c-.323-.158-.762-.314-1.43-.549l-.26-.091a.75.75 0 0 1-.46-.957ZM5.708 6.87v2.89c0 1.489.018 2.398.13 3.047c.101.595.274.925.594 1.263c.273.288.65.472 1.365.573c.74.105 1.724.107 3.14.107h5.304c.799 0 1.33-.001 1.734-.05c.382-.047.56-.129.685-.231c.125-.102.24-.26.364-.625c.13-.385.238-.905.4-1.688l.498-2.42v-.002c.178-.89.295-1.482.322-1.926c.026-.421-.04-.569-.101-.65a.561.561 0 0 0-.177-.087a3.17 3.17 0 0 0-.672-.134c-.595-.066-1.349-.067-2.205-.067H5.709ZM5.25 19.5a2.25 2.25 0 1 0 4.5 0a2.25 2.25 0 0 0-4.5 0Zm2.25.75a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5Zm6.75-.75a2.25 2.25 0 1 0 4.5 0a2.25 2.25 0 0 0-4.5 0Zm2.25.75a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5Z"
                                clip-rule="evenodd"
                              />
                            </g>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </BottomNavLayout>
      <BottomSheet open={openSheet} onDismiss={() => setOpenSheet(false)}>
        <SheetKeranjang
          produk={selectedProduk}
          onDismiss={() => setOpenSheet(false)}
        />
      </BottomSheet>
    </>
  );
});

const SheetKeranjang = memo(function SheetKeranjang({ produk, onDismiss }) {
  const [opsiId, setOpsiId] = useState();
  const { refetch } = useKeranjang();

  const { mutate: save, isLoading } = useMutation(
    () =>
      axios
        .post("/keranjang", {
          produk_id: produk.id,
          opsi_pengiriman_id: opsiId,
        })
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        onDismiss();
        refetch();
      },
    }
  );

  return (
    <div className="p-5">
      <img
        src={produk.thumbnail}
        className="w-full aspect-video object-cover"
      />
      <h4 className="text-xl mt-4 font-bold mb-3">{produk.nama}</h4>
      {produk.opsi_harga_pengiriman.map((opsi) => (
        <div
          className={`form-control rounded-lg px-4 border-2 my-2 hover:bg-primary/5 ${
            opsiId == opsi.id && "border-primary"
          }`}
        >
          <label className="label cursor-pointer">
            <input
              type="radio"
              name="radio-10"
              className="radio checked:bg-primary"
              value={opsi.id}
              checked={opsiId == opsi.id}
              onChange={(ev) => setOpsiId(opsi.id)}
            />
            <div>
              <span className="label-text">{opsi.nama}</span>
              {produk.opsi_harga == "berat" ? (
                <div className="text-sm text-slate-500">
                  {produk.berat}
                  {produk.satuan_berat.nama}: {currency(opsi.harga_berat)}
                </div>
              ) : (
                <div className="text-sm text-slate-500">
                  {produk.volume}
                  {produk.satuan_volume.nama}: {currency(opsi.harga_volume)}
                </div>
              )}
            </div>
          </label>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-primary w-full text-white"
        onClick={save}
        disabled={isLoading || !opsiId}
      >
        {isLoading && <span className="loading loading-spinner"></span>}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
          viewBox="0 0 24 24"
          className="h-6 w-6"
        >
          <g fill="currentColor">
            <path d="M13.75 9a.75.75 0 0 0-1.5 0v1.25H11a.75.75 0 0 0 0 1.5h1.25V13a.75.75 0 0 0 1.5 0v-1.25H15a.75.75 0 0 0 0-1.5h-1.25V9Z" />
            <path
              fill-rule="evenodd"
              d="M1.293 2.751a.75.75 0 0 1 .956-.459l.301.106c.617.217 1.14.401 1.553.603c.44.217.818.483 1.102.899c.282.412.399.865.452 1.362l.011.108H17.12c.819 0 1.653 0 2.34.077c.35.039.697.101 1.003.209c.3.105.631.278.866.584c.382.496.449 1.074.413 1.66c-.035.558-.173 1.252-.338 2.077l-.01.053l-.002.004l-.508 2.47c-.15.726-.276 1.337-.439 1.82c-.172.51-.41.96-.837 1.308c-.427.347-.916.49-1.451.556c-.505.062-1.13.062-1.87.062H10.88c-1.345 0-2.435 0-3.293-.122c-.897-.127-1.65-.4-2.243-1.026c-.547-.576-.839-1.188-.985-2.042c-.137-.8-.15-1.848-.15-3.3V7.038c0-.74-.002-1.235-.043-1.615c-.04-.363-.109-.545-.2-.677c-.087-.129-.22-.25-.524-.398c-.323-.158-.762-.314-1.43-.549l-.26-.091a.75.75 0 0 1-.46-.957ZM5.708 6.87v2.89c0 1.489.018 2.398.13 3.047c.101.595.274.925.594 1.263c.273.288.65.472 1.365.573c.74.105 1.724.107 3.14.107h5.304c.799 0 1.33-.001 1.734-.05c.382-.047.56-.129.685-.231c.125-.102.24-.26.364-.625c.13-.385.238-.905.4-1.688l.498-2.42v-.002c.178-.89.295-1.482.322-1.926c.026-.421-.04-.569-.101-.65a.561.561 0 0 0-.177-.087a3.17 3.17 0 0 0-.672-.134c-.595-.066-1.349-.067-2.205-.067H5.709ZM5.25 19.5a2.25 2.25 0 1 0 4.5 0a2.25 2.25 0 0 0-4.5 0Zm2.25.75a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5Zm6.75-.75a2.25 2.25 0 1 0 4.5 0a2.25 2.25 0 0 0-4.5 0Zm2.25.75a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5Z"
              clip-rule="evenodd"
            />
          </g>
        </svg>
        Keranjang
      </button>
    </div>
  );
});
