import { memo } from "react";
import BottomNavLayout from "../layouts/BottomNavLayout";
import { useKeranjang } from "@/services";
import Skeleton from "react-loading-skeleton";
import { currency } from "@/libs/utils";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { toast } from "react-toastify";

export default memo(function Index() {
  const queryClient = useQueryClient();
  const { data: keranjangs = [], isFetching, refetch } = useKeranjang();

  const [selected, setSelected] = useState([]);

  function changeCart(keranjang, ev) {
    if (ev.target.checked) setSelected((prev) => [...prev, keranjang.id]);
    else setSelected((prev) => prev.filter((i) => i != keranjang.id));
  }

  const isSelectedAll = useMemo(() => {
    if (!keranjangs.length) return false;
    return selected.length >= keranjangs.length;
  }, [selected, keranjangs]);
  function handleSelectAll(ev) {
    if (ev.target.checked) {
      setSelected(keranjangs.map((keranjang) => keranjang.id));
    } else setSelected([]);
  }

  const totalHarga = useMemo(() => {
    let total = 0;
    keranjangs
      .filter((keranjang) => selected.includes(keranjang.id))
      .forEach((keranjang) => (total += keranjang.harga * keranjang.kuantitas));
    return total;
  }, [selected, keranjangs]);

  const { mutate: updateKeranjang, isLoading } = useMutation(
    (data) =>
      axios.post(`/keranjang/${data.type}`, data).then((res) => res.data),
    {
      onSuccess: (data) => {
        // toast.success(data.message);
        refetch();
      },
    }
  );

  function updateKuantitas(data) {
    queryClient.setQueryData(["keranjang"], (prev) => {
      const newData = [...prev];
      console.log(newData);
      const index = newData.findIndex(
        (keranjang) => keranjang.produk_id == data.produk_id
      );
      if (index >= 0) {
        if (data.type == "plus") newData[index].kuantitas++;
        else if (data.type == "minus") newData[index].kuantitas--;
      }
      return newData;
    });

    updateKeranjang(data);
  }

  const isSameEkspedisi = useMemo(() => {
    const data = keranjangs
      .filter((keranjang) => selected.includes(keranjang.id))
      .map((keranjang) => keranjang.opsi_pengiriman_id);

    return data.every((item) => item == data[0]);
  }, [selected, keranjangs]);

  const { mutate: deleteKeranjang, isLoading: isDeleting } = useMutation(
    (uuid) => axios.delete(`/keranjang/${uuid}`),
    {
      onSettled: () => {
        refetch();
      },
    }
  );

  function checkout() {
    sessionStorage.setItem("checkout", JSON.stringify({ selected }));
    router.visit("/checkout");
  }

  return (
    <BottomNavLayout title="Keranjang" back={true} bottomNav={false}>
      {isFetching && !keranjangs.length ? (
        <Skeleton height={400} />
      ) : (
        <section>
          <div className="form-control mb-4">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={isSelectedAll}
                onChange={handleSelectAll}
              />
              <span className="label-text">Pilih Semua</span>
            </label>
          </div>
          {keranjangs.map((keranjang) => (
            <div
              className="card card-compact bg-base-100 border mb-2"
              key={keranjang.id}
            >
              <div className="card-body">
                <div className="flex gap-4 items-center">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={selected.includes(keranjang.id)}
                    onChange={(ev) => changeCart(keranjang, ev)}
                  />
                  <div className="flex-1 flex items-center gap-4">
                    <img
                      src={keranjang.produk.thumbnail}
                      alt={keranjang.produk.nama}
                      className="w-16 h-16 object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex">
                        <Link
                          href={`/produk/${keranjang.produk.uuid}`}
                          className="flex-1"
                        >
                          <h4 className="card-title">
                            {keranjang.produk.nama}
                          </h4>
                          <p className="-mt-2 mb-3 text-slate-400">
                            Pengiriman {keranjang.opsi_pengiriman.nama}
                          </p>
                        </Link>
                        {isFetching || isDeleting ? (
                          <Skeleton height={32} width={32} />
                        ) : (
                          <button
                            type="button"
                            className="btn btn-sm btn-ghost text-error btn-square"
                            onClick={() => deleteKeranjang(keranjang.uuid)}
                          >
                            <svg
                              className="w-5 h-5"
                              xmlns="http://www.w3.org/2000/svg"
                              width="200"
                              height="200"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M20 8.7H4a.75.75 0 1 1 0-1.5h16a.75.75 0 0 1 0 1.5Z"
                              />
                              <path
                                fill="currentColor"
                                d="M16.44 20.75H7.56A2.4 2.4 0 0 1 5 18.49V8a.75.75 0 0 1 1.5 0v10.49c0 .41.47.76 1 .76h8.88c.56 0 1-.35 1-.76V8A.75.75 0 1 1 19 8v10.49a2.4 2.4 0 0 1-2.56 2.26Zm.12-13a.74.74 0 0 1-.75-.75V5.51c0-.41-.48-.76-1-.76H9.22c-.55 0-1 .35-1 .76V7a.75.75 0 1 1-1.5 0V5.51a2.41 2.41 0 0 1 2.5-2.26h5.56a2.41 2.41 0 0 1 2.53 2.26V7a.75.75 0 0 1-.75.76Z"
                              />
                              <path
                                fill="currentColor"
                                d="M10.22 17a.76.76 0 0 1-.75-.75v-4.53a.75.75 0 0 1 1.5 0v4.52a.75.75 0 0 1-.75.76Zm3.56 0a.75.75 0 0 1-.75-.75v-4.53a.75.75 0 0 1 1.5 0v4.52a.76.76 0 0 1-.75.76Z"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      {isFetching || isDeleting ? (
                        <Skeleton height={32} />
                      ) : (
                        <div className="flex justify-between">
                          <div className="join">
                            <button
                              className="btn btn-sm rounded-r-none"
                              onClick={() =>
                                updateKuantitas({
                                  produk_id: keranjang.produk_id,
                                  type: "minus",
                                })
                              }
                            >
                              -
                            </button>
                            <input
                              className="input input-sm input-bordered join-item w-12 text-center"
                              value={keranjang.kuantitas}
                              readOnly
                            />
                            <button
                              className="btn btn-sm rounded-l-none"
                              onClick={() =>
                                updateKuantitas({
                                  produk_id: keranjang.produk_id,
                                  type: "plus",
                                })
                              }
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right text-primary font-medium text-lg">
                            {currency(keranjang.harga * keranjang.kuantitas)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="fixed w-full max-w-[460px] bottom-0 left-1/2 -translate-x-1/2 shadow border-t bg-base-100 p-4">
            <div className="flex justify-between mb-4">
              <div>Total Harga:</div>
              <div className="font-bold text-lg">{currency(totalHarga)}</div>
            </div>
            <button
              disabled={!isSameEkspedisi || !selected.length}
              type="button"
              className="btn btn-primary w-full text-white"
              onClick={checkout}
            >
              Checkout
            </button>
            {!isSameEkspedisi && (
              <div className="text-error text-xs text-center mt-2">
                Produk yang akan di-Checkout harus dalam Ekspedisi yang sama
              </div>
            )}
          </div>
        </section>
      )}
    </BottomNavLayout>
  );
});
