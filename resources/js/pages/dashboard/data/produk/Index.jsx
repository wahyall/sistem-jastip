import React, { useCallback, useState, memo } from "react";
import Paginate from "@/pages/dashboard/components/Paginate";
import { createColumnHelper } from "@tanstack/react-table";
import { If } from "react-haiku";
import { useQueryClient } from "@tanstack/react-query";
import axios from "@/libs/axios";

import Form from "./Form";
import useDelete from "@/hooks/useDelete";
import { currency } from "@/libs/utils";

const columnHelper = createColumnHelper();

function Index() {
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  const handleEdit = (uuid) => {
    setSelected(uuid);
    setOpenForm(true);
    KTUtil.scrollTop();
  };

  const { delete: handleDelete } = useDelete({
    onSuccess: () => {
      queryClient.invalidateQueries(["/data/produk/paginate"]);
    },
  });

  const columns = [
    columnHelper.accessor("nomor", {
      header: "#",
      style: {
        width: "25px",
      },
    }),
    columnHelper.accessor("thumbnail", {
      header: "Gambar",
      cell: (cell) => (
        <div className="symbol symbol-30px symbol-md-40px">
          <img src={cell.getValue()} alt="Foto" />
        </div>
      ),
    }),
    columnHelper.accessor("nama", {
      header: "Produk",
    }),
    columnHelper.accessor("berat", {
      header: "Berat",
      cell: (cell) =>
        `${cell.getValue()} ${cell.row.original.satuan_berat.nama}`,
    }),
    columnHelper.accessor("volume", {
      header: "Volume",
      cell: (cell) =>
        `${cell.row.original.volume_p} x ${cell.row.original.volume_l} x ${
          cell.row.original.volume_t
        } = ${cell.getValue()} ${cell.row.original.satuan_volume.nama}`,
    }),
    columnHelper.accessor("opsi_harga_pengiriman", {
      header: "Harga Ekpedisi (Berat)",
      cell: (cell) => (
        <div>
          {cell.getValue().map((opsi) => (
            <div className="mb-3" key={`berat-${opsi.id}`}>
              <strong>{opsi.nama}</strong>:
              <span>{currency(opsi.harga_berat)}</span>
            </div>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor("opsi_harga_pengiriman", {
      header: "Harga Ekpedisi (Volume)",
      cell: (cell) => (
        <div>
          {cell.getValue().map((opsi) => (
            <div className="mb-3" key={`volume-${opsi.id}`}>
              <strong>{opsi.nama}</strong>:
              <span>{currency(opsi.harga_volume)}</span>
            </div>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor("uuid", {
      id: "uuid",
      header: "Aksi",
      style: {
        width: "100px",
      },
      cell: (cell) =>
        !openForm && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-warning btn-icon"
              onClick={useCallback(() => handleEdit(cell.getValue()), [])}
            >
              <i className="la la-pencil fs-3"></i>
            </button>
            <button
              className="btn btn-sm btn-danger btn-icon"
              onClick={useCallback(
                () => handleDelete(`/data/produk/${cell.getValue()}/destroy`),
                []
              )}
            >
              <i className="la la-trash fs-3"></i>
            </button>
          </div>
        ),
    }),
  ];

  return (
    <section>
      <If isTrue={openForm}>
        <Form
          close={useCallback(() => setOpenForm(false), [])}
          selected={selected}
        />
      </If>
      <div className="card">
        <div className="card-header">
          <div className="card-title w-100">
            <h1>Data Produk</h1>
            <If isTrue={!openForm}>
              <button
                type="button"
                className="btn btn-primary btn-sm ms-auto"
                onClick={() => (
                  setSelected(null), setOpenForm(true), KTUtil.scrollTop()
                )}
              >
                <i className="las la-plus"></i>
                Tambah
              </button>
            </If>
          </div>
        </div>
        <div className="card-body">
          <Paginate
            id="my-table"
            columns={columns}
            url="/data/produk/paginate"
          ></Paginate>
        </div>
      </div>
    </section>
  );
}

export default memo(Index);
