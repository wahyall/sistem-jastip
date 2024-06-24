import React, { useCallback, useState, memo, useRef } from "react";
import Paginate from "@/pages/dashboard/components/Paginate";
import { createColumnHelper } from "@tanstack/react-table";
import { For, If } from "react-haiku";
import { useQueryClient } from "@tanstack/react-query";

import useDelete from "@/hooks/useDelete";
import { currency } from "@/libs/utils";

import Flatpickr from "react-flatpickr";
import Form from "./Form";

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
      queryClient.invalidateQueries(["/komplain/paginate"]);
    },
  });

  const [preview, setPreview] = useState({});

  const columns = [
    columnHelper.accessor("nomor", {
      header: "#",
      style: {
        width: "25px",
      },
    }),
    columnHelper.accessor("pengiriman.resi", {
      header: "Resi",
    }),
    columnHelper.accessor("pengiriman.penerima", {
      header: "Penerima",
      cell: (cell) => (
        <div>
          <div style={{ whiteSpace: "nowrap" }}>
            <strong>{cell.getValue().nama}</strong>
          </div>
          <div>{cell.getValue().city.name}</div>
        </div>
      ),
    }),
    columnHelper.accessor("tanggal", {
      header: "Tanggal",
      style: {
        whiteSpace: "nowrap",
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (cell) => (
        <span className="badge badge-light-primary">
          {cell.getValue().toCapital()}
        </span>
      ),
    }),
    columnHelper.accessor("uuid", {
      id: "uuid",
      header: "Aksi",
      style: {
        width: "200px",
      },
      cell: (cell) =>
        !openForm && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-info btn-icon"
              onClick={() => {
                setPreview(cell.row.original);
                $("#modal-preview").modal("show");
              }}
            >
              <i className="la la-eye fs-3"></i>
            </button>
            <button
              className="btn btn-sm btn-warning"
              onClick={useCallback(() => handleEdit(cell.getValue()), [])}
            >
              <i className="la la-sync fs-3"></i>
              Update
            </button>
          </div>
        ),
    }),
  ];

  const [openFilterDate, setOpenFilterDate] = useState(false);
  const [filterDate, setFilterDate] = useState();

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
            <h1>Klaim Barang Rusak</h1>
          </div>
        </div>
        <div className="card-body">
          <div class="input-group mb-5">
            <a
              class="input-button input-group-text btn btn-light-primary btn-icon"
              title="toggle"
              onClick={() => setOpenFilterDate((prev) => !prev)}
            >
              <i class="la la-calendar-alt fs-2"></i>
            </a>

            {openFilterDate && (
              <>
                <Flatpickr
                  data-input
                  className="form-control mw-250px"
                  value={filterDate}
                  placeholder="Filter Tanggal Pengajuan"
                  onChange={(date, val) => setFilterDate(val)}
                  options={{
                    mode: "range",
                  }}
                />

                <a
                  class="input-button input-group-text btn btn-light btn-icon"
                  title="clear"
                  onClick={() => {
                    setFilterDate();
                    setOpenFilterDate((prev) => !prev);
                  }}
                >
                  <i class="la la-times fs-2"></i>
                </a>
              </>
            )}
          </div>
          <Paginate
            id="my-table"
            columns={columns}
            url="/komplain/paginate"
            payload={{ range: filterDate }}
          ></Paginate>
        </div>
      </div>

      <div class="modal fade" tabindex="-1" id="modal-preview">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Preview Klaim</h3>

              <div
                class="btn btn-icon btn-sm btn-active-light-primary ms-2"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="la la-times"></i>
              </div>
            </div>

            <div class="modal-body">
              <div className="row">
                <h4>Data Klaim</h4>
                <div className="mb-5">
                  <strong className="text-muted">Catatan Customer</strong>
                  <div className="fw-bolder">{preview.catatan}</div>
                </div>
                <div className="mb-5">
                  <strong className="text-muted">Catatan Admin/Cabang</strong>
                  <div className="fw-bolder">
                    {preview.catatan_admin ?? "-"}
                  </div>
                </div>
                <div className="mb-5">
                  <strong className="text-muted">Lampiran</strong>
                  <div>
                    <a
                      href={`/${preview.attachment}`}
                      target="_blank"
                      className="fw-bolder text-primary"
                    >
                      Lihat Lampiran
                      <i className="la la-external-link-alt fs-4"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="separator mb-8 mt-4"></div>
              <div className="row">
                <h4>Data Pengiriman</h4>
                <div className="col-md-6">
                  <div className="mb-5">
                    <strong className="text-muted">No. Resi</strong>
                    <div className="fw-bolder">{preview.pengiriman?.resi}</div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Pengirim</strong>
                    <div className="fw-bolder">
                      {preview.pengiriman?.pengirim?.nama}
                    </div>
                    <div>
                      {preview.pengiriman?.pengirim?.city?.name},{" "}
                      {preview.pengiriman?.pengirim?.province?.name}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Penerima</strong>
                    <div className="fw-bolder">
                      {preview.pengiriman?.penerima?.nama}
                    </div>
                    <div>
                      {preview.pengiriman?.penerima?.city?.name},{" "}
                      {preview.pengiriman?.penerima?.province?.name}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Tanggal Pengiriman</strong>
                    <div className="fw-bolder">
                      {preview.pengiriman?.tanggal_kirim}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Layanan Pengiriman</strong>
                    <div className="fw-bolder">
                      {preview.pengiriman?.layanan?.nama}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Biaya Kirim</strong>
                    <div className="fw-bolder">
                      {currency(preview.pengiriman?.total_ongkir)}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Biaya Lainnya</strong>
                    <div className="fw-bolder">
                      {currency(preview.pengiriman?.biaya_tambahan)}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Status</strong>
                    <div className="fw-bolder">
                      {preview.pengiriman?.status?.toCapital()}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Tanggal Penerimaan</strong>
                    <div className="fw-bolder">
                      {preview.pengiriman?.tanggal_terima ?? "-"}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-5">
                    <strong className="text-muted">Jumlah Barang</strong>
                    <div className="fw-bolder">
                      {preview.pengiriman?.total_koli}{" "}
                      {preview.pengiriman?.satuan?.nama}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Berat Barang</strong>
                    <div className="fw-bolder">
                      {preview.pengiriman?.total_berat} gr
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Kategori Barang</strong>
                    <div className="fw-bolder">
                      {preview.pengiriman?.kategori?.nama}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Detail Barang</strong>
                    <div className="fw-bolder">
                      {preview.pengiriman?.detail_barang}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Index);
