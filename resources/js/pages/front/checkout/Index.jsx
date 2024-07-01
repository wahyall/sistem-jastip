import { router, usePage } from "@inertiajs/react";
import { memo } from "react";
import BottomNavLayout from "../layouts/BottomNavLayout";
import {
  useAlamat,
  useCity,
  useDistrict,
  useKeranjang,
  useProvince,
} from "@/services";
import { useMemo } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useMutation } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { useEffect } from "react";
import { currency } from "@/libs/utils";
import { toast } from "react-toastify";

const AlamatCustomer = memo(function AlamatCustomer({ onBack }) {
  const { data: alamat = {}, refetch } = useAlamat();
  const { register, watch, handleSubmit, control } = useForm({
    values: { ...alamat },
  });

  const { data: provinces = [], isLoading: isProvincesLoading } = useProvince();
  const provinceOptions = useMemo(
    () =>
      provinces.map((item) => ({
        label: item.name,
        value: item.code,
      })),
    [provinces]
  );

  const { data: cities = [], isLoading: isCitiesLoading } = useCity(
    null,
    `?province_code=${watch("province_code")}`,
    { enabled: Boolean(watch("province_code")) }
  );
  const cityOptions = useMemo(
    () =>
      cities.map((item) => ({
        label: item.name,
        value: item.code,
      })),
    [cities]
  );

  const { data: districts = [], isLoading: isDistrictsLoading } = useDistrict(
    null,
    `?city_code=${watch("city_code")}`,
    { enabled: Boolean(watch("city_code")) }
  );
  const districtOptions = useMemo(
    () =>
      districts.map((item) => ({
        label: item.name,
        value: item.code,
      })),
    [districts]
  );

  const { mutate: save, isLoading } = useMutation(
    (data) => axios.post("/alamat", data).then((res) => res.data),
    {
      onSuccess: () => {
        refetch();
        onBack();
      },
    }
  );

  return (
    <BottomNavLayout
      title="Edit Alamat"
      back={true}
      bottomNav={false}
      cart={false}
      onBack={onBack}
    >
      <form onSubmit={handleSubmit(save)}>
        <label className="form-control w-full mb-5">
          <div className="label">
            <span className="label-text">Nama Penerima</span>
          </div>
          <input
            type="text"
            placeholder="Masukkan Nama Penerima"
            className="input input-bordered w-full"
            {...register("penerima", { required: true })}
          />
        </label>
        <label className="form-control w-full mb-5">
          <div className="label">
            <span className="label-text">Nomor Telepon</span>
          </div>
          <input
            type="text"
            placeholder="Masukkan Nomor Telepon"
            className="input input-bordered w-full"
            {...register("telepon", { required: true })}
          />
        </label>
        <label className="form-control w-full mb-5">
          <div className="label">
            <span className="label-text">Provinsi</span>
          </div>
          <Controller
            control={control}
            name="province_code"
            render={({ field: { value, onChange } }) => (
              <Select
                name="province_code"
                placeholder="Provinsi Tujuan"
                options={provinceOptions}
                hideSelectedOptions={false}
                value={provinceOptions.find((opt) => opt.value == value)}
                onChange={(val) => {
                  onChange(val.value);
                  setValue("city_code", undefined);
                  setValue("district_code", undefined);
                }}
              />
            )}
            rules={{ required: true }}
          />
        </label>
        <label className="form-control w-full mb-5">
          <div className="label">
            <span className="label-text">Kabupaten/Kota</span>
          </div>
          <Controller
            control={control}
            name="city_code"
            render={({ field: { value, onChange } }) => (
              <Select
                name="city_code"
                placeholder="Kota Tujuan"
                isLoading={isCitiesLoading}
                isDisabled={!watch("province_code")}
                options={cityOptions}
                hideSelectedOptions={false}
                value={cityOptions.find((opt) => opt.value == value)}
                onChange={(val) => {
                  onChange(val.value);
                  setValue("district_code", undefined);
                }}
              />
            )}
            rules={{ required: true }}
          />
        </label>
        <label className="form-control w-full mb-5">
          <div className="label">
            <span className="label-text">Kecamatan</span>
          </div>
          <Controller
            control={control}
            name="district_code"
            render={({ field: { value, onChange } }) => (
              <Select
                name="district_code"
                placeholder="Kecamatan Tujuan"
                isLoading={isDistrictsLoading}
                isDisabled={!watch("city_code")}
                options={districtOptions}
                hideSelectedOptions={false}
                value={districtOptions.find((opt) => opt.value == value)}
                onChange={(val) => onChange(val.value)}
              />
            )}
            rules={{ required: true }}
          />
        </label>
        <label className="form-control w-full mb-5">
          <div className="label">
            <span className="label-text">Kode Pos</span>
          </div>
          <input
            type="number"
            placeholder="Masukkan Kode Pos"
            className="input input-bordered w-full"
            {...register("kode_pos", { required: true })}
          />
        </label>
        <label className="form-control w-full mb-5">
          <div className="label">
            <span className="label-text">Detail Alamat</span>
          </div>
          <textarea
            placeholder="Masukkan Detail Alamat"
            className="textarea input-bordered w-full"
            rows="4"
            {...register("detail_alamat", { required: true })}
          ></textarea>
        </label>
        <div className="form-control w-full mb-5">
          <div className="label">
            <span className="label-text">Tandai Sebagai</span>
          </div>
          <div className="flex gap-10">
            <div className="form-control">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  className="radio checked:bg-blue-500"
                  {...register("tandai", { required: true })}
                  value="rumah"
                />
                <span className="label-text">Rumah</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  className="radio checked:bg-blue-500"
                  {...register("tandai", { required: true })}
                  value="kantor"
                />
                <span className="label-text">Kantor</span>
              </label>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full text-white mt-10"
          disabled={isLoading}
        >
          {isLoading && <span className="loading loading-spinner"></span>}
          Simpan
        </button>
      </form>
    </BottomNavLayout>
  );
});

export default memo(function Index() {
  const { selected } = JSON.parse(sessionStorage.getItem("checkout"));
  const { data: keranjangs = [], refetch } = useKeranjang();

  useEffect(() => {
    if (!selected.length) router.visit("/keranjang");
  }, [selected]);

  const selectedKeranjang = useMemo(() => {
    return keranjangs.filter((keranjang) => selected.includes(keranjang.id));
  }, [selected, keranjangs]);

  const [editAlamat, setEditAlamat] = useState(false);
  const { data: alamat = {} } = useAlamat();

  const [tipeKurir, setTipeKurir] = useState("standar");
  const tarif = useMemo(() => {
    let totalBerat = 0;
    selectedKeranjang.forEach(
      (keranjang) =>
        (totalBerat += keranjang.produk.berat * keranjang.kuantitas)
    );

    const items = alamat?.tarif?.items || [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].from_berat < totalBerat && items[i].to_berat >= totalBerat)
        return items[i];
      else if (i == items.length - 1 && items[i].from_berat < totalBerat)
        return items[i];

      return {};
    }
  }, [alamat, selectedKeranjang]);

  const subtotal = useMemo(() => {
    let total = 0;
    keranjangs
      .filter((keranjang) => selected.includes(keranjang.id))
      .forEach((keranjang) => (total += keranjang.harga * keranjang.kuantitas));
    return total;
  }, [selected, keranjangs]);

  const { mutate: checkout, isLoading } = useMutation(
    (data) =>
      axios
        .post("/checkout", { selected, tipe_kurir: tipeKurir })
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        toast.success("Berhasil melakukan Checkout");
        refetch();
        router.visit(`/pembayaran/${data.uuid}`);
      },
    }
  );

  if (editAlamat) return <AlamatCustomer onBack={() => setEditAlamat(false)} />;

  return (
    <BottomNavLayout
      title="Checkout"
      back={true}
      bottomNav={false}
      cart={false}
      backUrl="/keranjang"
    >
      <section>
        <div
          className="card compact bg-base-100 shadow hover:bg-slate-50"
          onClick={() => setEditAlamat(true)}
        >
          <div className="card-body">
            <div className="flex gap-4">
              <svg
                className="h-6 w-6 mt-2"
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="200"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M19.367 18.102L18 14h-1.5l.833 4H2.667l.833-4H2L.632 18.102C.285 19.146.9 20 2 20h16c1.1 0 1.715-.854 1.367-1.898zM15 5A5 5 0 1 0 5 5c0 4.775 5 10 5 10s5-5.225 5-10zm-7.7.06A2.699 2.699 0 0 1 10 2.361a2.699 2.699 0 1 1 0 5.399a2.7 2.7 0 0 1-2.7-2.7z"
                />
              </svg>
              <div className="flex-1">
                <h4 className="card-title mb-3">Alamat Pengiriman</h4>
                {Boolean(alamat?.id) ? (
                  <div className="flex gap-4 items-center cursor-pointer">
                    <div className="flex-1">
                      <div className="badge badge-ghost mb-2">
                        {alamat?.tandai}
                      </div>
                      <div className="font-medium">
                        {alamat?.penerima} | {alamat?.telepon}
                      </div>
                      <div>{alamat?.detail_alamat},</div>
                      <div>
                        {alamat?.district?.name}, {alamat?.city?.name},{" "}
                        {alamat?.province?.name}
                      </div>
                      <div>{alamat?.kode_pos}</div>
                    </div>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      width="200"
                      height="200"
                      viewBox="0 0 56 56"
                    >
                      <path
                        fill="currentColor"
                        d="M18.695 48.367c.586 0 1.102-.234 1.524-.633L38.78 29.57c.446-.445.68-.984.68-1.57c0-.61-.234-1.172-.68-1.57L20.22 8.289a2.073 2.073 0 0 0-1.524-.656a2.122 2.122 0 0 0-2.156 2.156c0 .563.258 1.125.633 1.524L34.21 28L17.17 44.688c-.374.398-.632.937-.632 1.523c0 1.219.938 2.156 2.156 2.156"
                      />
                      <script xmlns="" />
                    </svg>
                  </div>
                ) : (
                  <div className="flex gap-4 items-center cursor-pointer">
                    <div className="flex-1">
                      <div>Anda Belum Mangatur Alamat Pengiriamn</div>
                      <div>
                        <strong>Atur Sekarang!</strong>
                      </div>
                    </div>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      width="200"
                      height="200"
                      viewBox="0 0 56 56"
                    >
                      <path
                        fill="currentColor"
                        d="M18.695 48.367c.586 0 1.102-.234 1.524-.633L38.78 29.57c.446-.445.68-.984.68-1.57c0-.61-.234-1.172-.68-1.57L20.22 8.289a2.073 2.073 0 0 0-1.524-.656a2.122 2.122 0 0 0-2.156 2.156c0 .563.258 1.125.633 1.524L34.21 28L17.17 44.688c-.374.398-.632.937-.632 1.523c0 1.219.938 2.156 2.156 2.156"
                      />
                      <script xmlns="" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        {selectedKeranjang.map((keranjang) => (
          <div
            className="card card-compact bg-base-100 border mb-2"
            key={keranjang.id}
          >
            <div className="card-body">
              <div className="flex-1 flex items-center gap-4">
                <img
                  src={keranjang.produk.thumbnail}
                  alt={keranjang.produk.nama}
                  className="w-16 h-16 object-cover"
                />
                <div className="flex-1">
                  <div className="flex">
                    <div className="flex-1">
                      <h4 className="card-title">{keranjang.produk.nama}</h4>
                      <p className="-mt-2 text-slate-400">
                        Pengiriman {keranjang.opsi_pengiriman.nama}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-slate-400">
                      x {keranjang.kuantitas}
                    </div>
                    <div className="text-right text-primary font-medium text-lg">
                      {currency(keranjang.harga * keranjang.kuantitas)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-4 bg-green-300 p-4 flex gap-4 -ml-4 -mr-4">
          <div className="flex-1">
            <h6 className="font-medium">Ongkos Kirim Kurir</h6>
            <h5 className="font-bold text-lg">
              {tipeKurir == "standar" ? "Standar" : "Ambil di Tempat"}
            </h5>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              {tipeKurir == "standar" ? currency(tarif?.nominal) : "Rp 0"}
              <svg
                className="h-6 w-6 rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="200"
                viewBox="0 0 56 56"
              >
                <path
                  fill="currentColor"
                  d="M18.695 48.367c.586 0 1.102-.234 1.524-.633L38.78 29.57c.446-.445.68-.984.68-1.57c0-.61-.234-1.172-.68-1.57L20.22 8.289a2.073 2.073 0 0 0-1.524-.656a2.122 2.122 0 0 0-2.156 2.156c0 .563.258 1.125.633 1.524L34.21 28L17.17 44.688c-.374.398-.632.937-.632 1.523c0 1.219.938 2.156 2.156 2.156"
                />
                <script xmlns="" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li onClick={() => setTipeKurir("standar")}>
                <a>Standar</a>
              </li>
              <li onClick={() => setTipeKurir("ambil")}>
                <a>
                  Ambil di Tempat <span className="text-success">Rp 0</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="card compact bg-base-100 shadow border mt-5 border-l-8 border-l-green-300">
          <div className="card-body">
            <h4 className="card-title mb-4">Rincian Pembayaran</h4>
            <div className="flex justify-between gap-4 mb-2">
              <div>Subtotal Paket</div>
              <div>
                <strong>{currency(subtotal)}</strong>
              </div>
            </div>
            <div className="flex justify-between gap-4 mb-2">
              <div>Subtotal Ongkos Kirim</div>
              <div>
                <strong>
                  {tipeKurir == "standar" ? currency(tarif?.nominal) : "Rp 0"}
                </strong>
              </div>
            </div>
            <div className="divider"></div>
            <div className="flex justify-between gap-4 mb-2">
              <div className="text-lg">Total Pembayaran</div>
              <div className="text-xl">
                <strong>
                  {currency(
                    (tipeKurir == "standar" ? tarif?.nominal : 0) + subtotal
                  )}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary text-white w-full mt-20"
          disabled={isLoading}
          onClick={checkout}
        >
          {isLoading && <span className="loading loading-spinner"></span>}
          Checkout & Bayar
        </button>
      </section>
    </BottomNavLayout>
  );
});
