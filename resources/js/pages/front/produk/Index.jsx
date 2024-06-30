import { memo } from "react";
import BottomNavLayout from "../layouts/BottomNavLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePage } from "@inertiajs/react";
import axios from "@/libs/axios";
import Skeleton from "react-loading-skeleton";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { currency } from "@/libs/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { useKeranjang } from "@/services";

export default memo(function Index() {
  const {
    route: { parameters },
  } = usePage().props;
  const { data: produk = {}, isFetching } = useQuery({
    queryKey: ["produk", parameters.uuid],
    queryFn: () =>
      axios.get(`/data/produk/${parameters.uuid}`).then((res) => res.data),
  });

  const { refetch } = useKeranjang();
  const [opsiId, setOpsiId] = useState();
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
        refetch();
      },
    }
  );

  return (
    <BottomNavLayout title="Detail Produk" back={true} bottomNav={false}>
      {isFetching ? (
        <Skeleton height={400} />
      ) : (
        <section>
          <Splide aria-label="My Favorite Images">
            {produk.images.map((iamge) => (
              <SplideSlide>
                <img
                  src={iamge.image_url}
                  alt="Banner"
                  className="aspect-[2/1] object-cover rounded-md"
                />
              </SplideSlide>
            ))}
          </Splide>

          <div className="my-5">
            <h1 className="text-xl font-bold ">{produk.nama}</h1>
            <div className="text-right  text-slate-400 mb-5">
              {produk.opsi_harga == "berat" ? (
                <p>
                  {currency(produk.opsi_harga_pengiriman[0].harga_berat)} ~{" "}
                  {currency(produk.opsi_harga_pengiriman[1].harga_berat)}
                </p>
              ) : (
                <p>
                  {currency(produk.opsi_harga_pengiriman[0].harga_volume)} ~{" "}
                  {currency(produk.opsi_harga_pengiriman[1].harga_volume)}
                </p>
              )}
            </div>

            <div className="mb-10">
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
                          {produk.satuan_berat.nama}:{" "}
                          {currency(opsi.harga_berat)}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-500">
                          {produk.volume}
                          {produk.satuan_volume.nama}:{" "}
                          {currency(opsi.harga_volume)}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="border-b flex">
              <div className="border-b-2 border-primary font-bold">
                Deskripsi
              </div>
            </div>

            <article className="p-1 mb-8">{produk.deskripsi}</article>

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
        </section>
      )}
    </BottomNavLayout>
  );
});
