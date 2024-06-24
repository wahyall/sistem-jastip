import React, { useCallback, useState, memo, useRef } from "react";
import Paginate from "@/pages/dashboard/components/Paginate";
import { createColumnHelper } from "@tanstack/react-table";
import { For, If } from "react-haiku";
import { useQueryClient } from "@tanstack/react-query";

import Form from "./Form";
import { currency } from "@/libs/utils";

import Flatpickr from "react-flatpickr";

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

  const [preview, setPreview] = useState({});

  const columns = [
    columnHelper.accessor("nomor", {
      header: "#",
      style: {
        width: "25px",
      },
    }),
    columnHelper.accessor("resi", {
      header: "Resi",
    }),
    columnHelper.accessor("pengirim", {
      header: "Pengirim",
      cell: (cell) => (
        <div>
          <div style={{ whiteSpace: "nowrap" }}>
            <strong>{cell.getValue().nama}</strong>
          </div>
          <div>{cell.getValue().city.name}</div>
        </div>
      ),
    }),
    columnHelper.accessor("penerima", {
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
    columnHelper.accessor("tanggal_kirim", {
      header: "Tanggal Kirim",
      style: {
        whiteSpace: "nowrap",
      },
    }),
    columnHelper.accessor("cabang.name", {
      header: "Cabang",
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (cell) => {
        if (cell.getValue() == "Pengiriman Dibuat")
          return (
            <span className="badge badge-light">
              {cell.getValue().toCapital()}
            </span>
          );

        if (cell.getValue() == "Diproses")
          return (
            <span className="badge badge-light-warning">
              {cell.getValue().toCapital()}
            </span>
          );

        if (cell.getValue() == "Delivery")
          return (
            <span className="badge badge-light-primary">
              {cell.getValue().toCapital()}
            </span>
          );

        if (cell.getValue() == "Delivered")
          return (
            <span className="badge badge-success">
              {cell.getValue().toCapital()}
            </span>
          );
      },
    }),
    columnHelper.accessor("kurir.name", {
      header: "Kurir",
    }),
    columnHelper.accessor("catatan", {
      header: "Catatan",
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
              <i className="la la-pencil fs-3"></i>
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
            <h1>Tracking</h1>
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
                  placeholder="Filter Tanggal Kirim"
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

          <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 mb-5">
            <li className="nav-item">
              <a
                className="nav-link me-2 btn btn-active-light btn-color-gray-600 btn-active-color-primary rounded-bottom-0 active"
                data-bs-toggle="tab"
                href="#status-semua"
              >
                Semua
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link ms-2 btn btn-active-light btn-color-gray-600 btn-active-color-primary rounded-bottom-0"
                data-bs-toggle="tab"
                href="#status-pending"
              >
                Pending
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link ms-2 btn btn-active-light btn-color-gray-600 btn-active-color-primary rounded-bottom-0"
                data-bs-toggle="tab"
                href="#status-progress"
              >
                On Progress
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link ms-2 btn btn-active-light btn-color-gray-600 btn-active-color-primary rounded-bottom-0"
                data-bs-toggle="tab"
                href="#status-delivery"
              >
                Delivery
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link ms-2 btn btn-active-light btn-color-gray-600 btn-active-color-primary rounded-bottom-0"
                data-bs-toggle="tab"
                href="#status-delivered"
              >
                Finish
              </a>
            </li>
          </ul>

          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="status-semua"
              role="tabpanel"
            >
              <Paginate
                id="my-table"
                columns={columns}
                url="/tracking/paginate"
                payload={{ range: filterDate }}
              ></Paginate>
            </div>
            <div className="tab-pane fade" id="status-pending" role="tabpanel">
              <Paginate
                id="my-table-pending"
                columns={columns}
                url="/tracking/paginate?status=Pengiriman Dibuat"
                payload={{ range: filterDate }}
              ></Paginate>
            </div>
            <div className="tab-pane fade" id="status-progress" role="tabpanel">
              <Paginate
                id="my-table-progress"
                columns={columns}
                url="/tracking/paginate?status=Diproses"
                payload={{ range: filterDate }}
              ></Paginate>
            </div>
            <div className="tab-pane fade" id="status-delivery" role="tabpanel">
              <Paginate
                id="my-table-delivery"
                columns={columns}
                url="/tracking/paginate?status=Delivery"
                payload={{ range: filterDate }}
              ></Paginate>
            </div>
            <div
              className="tab-pane fade"
              id="status-delivered"
              role="tabpanel"
            >
              <Paginate
                id="my-table-delivered"
                columns={columns}
                url="/tracking/paginate?status=Delivered"
                payload={{ range: filterDate }}
              ></Paginate>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" tabindex="-1" id="modal-preview">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Preview Pengiriman</h3>

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
                <div className="col-md-6">
                  <div className="mb-5">
                    <strong className="text-muted">No. Resi</strong>
                    <div className="fw-bolder">{preview.resi}</div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Pengirim</strong>
                    <div className="fw-bolder">{preview.pengirim?.nama}</div>
                    <div>
                      {preview.pengirim?.city?.name},{" "}
                      {preview.pengirim?.province?.name}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Penerima</strong>
                    <div className="fw-bolder">{preview.penerima?.nama}</div>
                    <div>
                      {preview.penerima?.city?.name},{" "}
                      {preview.penerima?.province?.name}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Tanggal Pengiriman</strong>
                    <div className="fw-bolder">{preview.tanggal_kirim}</div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Layanan Pengiriman</strong>
                    <div className="fw-bolder">{preview.layanan?.nama}</div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Biaya Kirim</strong>
                    <div className="fw-bolder">
                      {currency(preview.total_ongkir)}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Biaya Lainnya</strong>
                    <div className="fw-bolder">
                      {currency(preview.biaya_tambahan)}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Status</strong>
                    <div className="fw-bolder">
                      {preview.status?.toCapital()}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Tanggal Penerimaan</strong>
                    <div className="fw-bolder">
                      {preview.tanggal_terima ?? "-"}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-5">
                    <strong className="text-muted">Jumlah Barang</strong>
                    <div className="fw-bolder">{preview.total_koli}</div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Berat Barang</strong>
                    <div className="fw-bolder">
                      {preview.total_berat} {preview.satuan?.nama}
                    </div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Kategori Barang</strong>
                    <div className="fw-bolder">{preview.kategori?.nama}</div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Detail Barang</strong>
                    <div className="fw-bolder">{preview.detail_barang}</div>
                  </div>
                  <div className="mb-5">
                    <strong className="text-muted">Catatan</strong>
                    <div className="fw-bolder">{preview.catatan}</div>
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
