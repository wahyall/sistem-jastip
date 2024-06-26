import React, { useCallback, useState, memo } from "react";
import Paginate from "@/pages/dashboard/components/Paginate";
import { createColumnHelper } from "@tanstack/react-table";
import { If } from "react-haiku";
import { useQueryClient } from "@tanstack/react-query";
import axios from "@/libs/axios";

import Form from "./Form";
import useDelete from "@/hooks/useDelete";

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
      queryClient.invalidateQueries(["/data/tarif-kurir/paginate"]);
    },
  });

  const columns = [
    columnHelper.accessor("nomor", {
      header: "#",
      style: {
        width: "25px",
      },
    }),
    columnHelper.accessor("to_province.name", {
      header: "Provinsi",
    }),
    columnHelper.accessor("to_city.name", {
      header: "Kabupaten/Kota",
    }),
    columnHelper.accessor("to_district.name", {
      header: "Kecamatan",
    }),
    columnHelper.accessor("keterangan", {
      header: "Keterangan",
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
                () =>
                  handleDelete(`/data/tarif-kurir/${cell.getValue()}/destroy`),
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
            <h1>Data Tarif Kurir</h1>
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
            url="/data/tarif-kurir/paginate"
          ></Paginate>
        </div>
      </div>
    </section>
  );
}

export default memo(Index);
