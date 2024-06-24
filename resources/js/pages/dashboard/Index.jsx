import axios from "@/libs/axios";
import { currency } from "@/libs/utils";
import { useQuery } from "@tanstack/react-query";
import ReactApexChart from "react-apexcharts";
import Skeleton from "react-loading-skeleton";
import Select from "react-select";

import { useCallback, useState, memo, useRef, useMemo } from "react";
import Paginate from "@/pages/dashboard/components/Paginate";
import { createColumnHelper } from "@tanstack/react-table";
import { For, If } from "react-haiku";
import { useQueryClient } from "@tanstack/react-query";

import Flatpickr from "react-flatpickr";
import useDownloadExcel from "@/hooks/useDownloadExcel";

const columnHelper = createColumnHelper();

const tahuns = [];
for (let tahun = 2023; tahun <= new Date().getFullYear(); tahun++) {
  tahuns.push({ value: tahun, label: tahun });
}

export default function Index() {
  const [tahunDelivered, setTahunDelivered] = useState(
    new Date().getFullYear()
  );
  const [tahunRevenue, setTahunRevenue] = useState(new Date().getFullYear());

  const { data: card = {} } = useQuery({
    queryKey: ["dashboard", "index"],
    queryFn: () => axios.post("/dashboard").then((res) => res.data),
    cacheTime: 0,
    staleTime: 0,
  });

  const { data: delivered = {}, isLoading: isDeliveredLoading } = useQuery({
    queryKey: ["dashboard", "delivered", tahunDelivered],
    queryFn: () =>
      axios
        .post("/dashboard/delivered", { tahun: tahunDelivered })
        .then((res) => res.data.chart),
  });

  const { data: revenue = {}, isLoading: isRevenueLoading } = useQuery({
    queryKey: ["dashboard", "revenue", tahunRevenue],
    queryFn: () =>
      axios
        .post("/dashboard/revenue", { tahun: tahunRevenue })
        .then((res) => res.data.chart),
  });

  const chartDelivered = useMemo(() => {
    var height = 300;
    var labelColor = "#A1A5B7";
    var borderColor = "#E4E6EF";
    var baseColor = "#28BB5E";
    var lightColor = "#28BB5E";

    return {
      3: {
        series: [
          {
            name: "Avg. Monthly Delivered",
            data: delivered?.chart3,
          },
        ],
        options: {
          chart: {
            fontFamily: "inherit",
            type: "area",
            height: height,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {},
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: false,
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.4,
              opacityTo: 0,
              stops: [0, 90, 100],
            },
          },
          stroke: {
            curve: "smooth",
            show: true,
            width: 3,
            colors: [baseColor],
          },
          xaxis: {
            categories: delivered?.month3,
            crosshairs: {
              position: "front",
              stroke: {
                color: baseColor,
                width: 1,
                dashArray: 3,
              },
            },
            tooltip: {
              enabled: true,
              formatter: undefined,
              offsetY: 0,
              style: {
                fontSize: "12px",
              },
            },
            labels: {
              formatter: function (val) {
                return val;
              },
            },
          },
          yaxis: {
            tickAmount: 5,
            labels: {
              style: {
                colors: labelColor,
                fontSize: "12px",
              },
            },
          },
          states: {
            normal: {
              filter: {
                type: "none",
                value: 0,
              },
            },
            hover: {
              filter: {
                type: "none",
                value: 0,
              },
            },
            active: {
              allowMultipleDataPointsSelection: false,
              filter: {
                type: "none",
                value: 0,
              },
            },
          },
          tooltip: {
            style: {
              fontSize: "12px",
            },
            y: {
              formatter: function (val, series) {
                return (
                  "Rp " +
                  Intl.NumberFormat("id-ID", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(delivered?.chart3?.[series.dataPointIndex])
                );
              },
            },
          },
          colors: [lightColor],
          grid: {
            borderColor: borderColor,
            strokeDashArray: 4,
            yaxis: {
              lines: {
                show: true,
              },
            },
          },
          markers: {
            strokeColor: baseColor,
            strokeWidth: 3,
          },
        },
      },
      12: {
        series: [
          {
            name: "Avg. Monthly Delivered",
            data: delivered?.chart12,
          },
        ],
        options: {
          chart: {
            fontFamily: "inherit",
            type: "area",
            height: height,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {},
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: false,
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.4,
              opacityTo: 0,
              stops: [0, 90, 100],
            },
          },
          stroke: {
            curve: "smooth",
            show: true,
            width: 3,
            colors: [baseColor],
          },
          xaxis: {
            categories: delivered?.month12,
            crosshairs: {
              position: "front",
              stroke: {
                color: baseColor,
                width: 1,
                dashArray: 3,
              },
            },
            tooltip: {
              enabled: true,
              formatter: undefined,
              offsetY: 0,
              style: {
                fontSize: "12px",
              },
            },
          },
          yaxis: {
            tickAmount: 5,
            labels: {
              style: {
                colors: labelColor,
                fontSize: "12px",
              },
            },
          },
          states: {
            normal: {
              filter: {
                type: "none",
                value: 0,
              },
            },
            hover: {
              filter: {
                type: "none",
                value: 0,
              },
            },
            active: {
              allowMultipleDataPointsSelection: false,
              filter: {
                type: "none",
                value: 0,
              },
            },
          },
          tooltip: {
            style: {
              fontSize: "12px",
            },
            y: {
              formatter: function (val, series) {
                return (
                  "Rp " +
                  Intl.NumberFormat("id-ID", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(delivered?.chart12?.[series.dataPointIndex])
                );
              },
            },
          },
          colors: [lightColor],
          grid: {
            borderColor: borderColor,
            strokeDashArray: 4,
            yaxis: {
              lines: {
                show: true,
              },
            },
          },
          markers: {
            strokeColor: baseColor,
            strokeWidth: 3,
          },
        },
      },
    };
  }, [delivered]);

  const chartRevenue = useMemo(() => {
    var height = 300;
    var labelColor = "#A1A5B7";
    var borderColor = "#E4E6EF";
    var baseColor = "#28BB5E";
    var lightColor = "#28BB5E";

    return {
      3: {
        series: [
          {
            name: "Grafik Pemasukan",
            data: revenue?.chart3,
          },
        ],
        options: {
          chart: {
            fontFamily: "inherit",
            type: "area",
            height: height,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {},
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: false,
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.4,
              opacityTo: 0,
              stops: [0, 90, 100],
            },
          },
          stroke: {
            curve: "smooth",
            show: true,
            width: 3,
            colors: [baseColor],
          },
          xaxis: {
            categories: revenue?.month3,
            crosshairs: {
              position: "front",
              stroke: {
                color: baseColor,
                width: 1,
                dashArray: 3,
              },
            },
            tooltip: {
              enabled: true,
              formatter: undefined,
              offsetY: 0,
              style: {
                fontSize: "12px",
              },
            },
          },
          yaxis: {
            tickAmount: 5,
            labels: {
              style: {
                colors: labelColor,
                fontSize: "12px",
              },
            },
          },
          states: {
            normal: {
              filter: {
                type: "none",
                value: 0,
              },
            },
            hover: {
              filter: {
                type: "none",
                value: 0,
              },
            },
            active: {
              allowMultipleDataPointsSelection: false,
              filter: {
                type: "none",
                value: 0,
              },
            },
          },
          tooltip: {
            style: {
              fontSize: "12px",
            },
            y: {
              formatter: function (val, series) {
                return (
                  "Rp " +
                  Intl.NumberFormat("id-ID", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(revenue?.chart3?.[series.dataPointIndex])
                );
              },
            },
          },
          colors: [lightColor],
          grid: {
            borderColor: borderColor,
            strokeDashArray: 4,
            yaxis: {
              lines: {
                show: true,
              },
            },
          },
          markers: {
            strokeColor: baseColor,
            strokeWidth: 3,
          },
        },
      },
      12: {
        series: [
          {
            name: "Avg. Monthly Delivered",
            data: revenue?.chart12,
          },
        ],
        options: {
          chart: {
            fontFamily: "inherit",
            type: "area",
            height: height,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {},
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: false,
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.4,
              opacityTo: 0,
              stops: [0, 90, 100],
            },
          },
          stroke: {
            curve: "smooth",
            show: true,
            width: 3,
            colors: [baseColor],
          },
          xaxis: {
            categories: revenue?.month12,
            crosshairs: {
              position: "front",
              stroke: {
                color: baseColor,
                width: 1,
                dashArray: 3,
              },
            },
            tooltip: {
              enabled: true,
              formatter: undefined,
              offsetY: 0,
              style: {
                fontSize: "12px",
              },
            },
            labels: {
              formatter: function (val) {
                return val;
              },
            },
          },
          yaxis: {
            tickAmount: 5,
            labels: {
              style: {
                colors: labelColor,
                fontSize: "12px",
              },
            },
          },
          states: {
            normal: {
              filter: {
                type: "none",
                value: 0,
              },
            },
            hover: {
              filter: {
                type: "none",
                value: 0,
              },
            },
            active: {
              allowMultipleDataPointsSelection: false,
              filter: {
                type: "none",
                value: 0,
              },
            },
          },
          tooltip: {
            style: {
              fontSize: "12px",
            },
            y: {
              formatter: function (val, series) {
                return (
                  "Rp " +
                  Intl.NumberFormat("id-ID", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(revenue?.chart12?.[series.dataPointIndex])
                );
              },
            },
          },
          colors: [lightColor],
          grid: {
            borderColor: borderColor,
            strokeDashArray: 4,
            yaxis: {
              lines: {
                show: true,
              },
            },
          },
          markers: {
            strokeColor: baseColor,
            strokeWidth: 3,
          },
        },
      },
    };
  }, [revenue]);

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
    columnHelper.accessor("total_koli", {
      header: "Jumlah",
      cell: (cell) => `${cell.getValue()} ${cell.row.original.satuan.nama}`,
    }),
    columnHelper.accessor("layanan.nama", {
      header: "Layanan",
    }),
    columnHelper.accessor("cabang.name", {
      header: "Cabang",
    }),
  ];

  const [openFilterDate, setOpenFilterDate] = useState(false);
  const [filterDate, setFilterDate] = useState();

  const [status, setStatus] = useState("semua");
  const { download: exportExcel } = useDownloadExcel();

  return (
    <main>
      <div className="row mb-10" style={{ rowGap: "1.5rem" }}>
        <div className="col-xl-3 col-lg-4 col-6">
          <div className="card card-flush">
            <div className="card-header">
              <div className="card-title d-flex flex-column">
                <div className="d-flex align-items-center">
                  <i className="la la-check-circle fs-2 text-dark"></i>
                  <span className="fw-bold text-gray-900 ms-2">
                    Total Pengiriman
                  </span>
                </div>
              </div>
            </div>

            <div className="card-body d-flex flex-column pt-0">
              <span className="fs-2hx fw-bold text-gray-900 mb-2">
                {Intl.NumberFormat("en-US").format(card.total?.currentTotal)}
              </span>
              <div className="d-flex align-items-center gap-2">
                <span
                  className={`badge badge-light-${
                    card.total?.percentTotal >= 0 ? "success" : "danger"
                  } fs-base`}
                >
                  {Intl.NumberFormat("en-US").format(card.total?.percentTotal)}%
                </span>
                <span className="text-gray-500 fw-semibold fs-6">
                  vs Last Month
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-4 col-6">
          <div className="card card-flush">
            <div className="card-header">
              <div className="card-title d-flex flex-column">
                <div className="d-flex align-items-center">
                  <i className="la la-truck fs-2 text-dark"></i>
                  <span className="fw-bold text-gray-900 ms-2">Pending</span>
                </div>
              </div>
            </div>

            <div className="card-body d-flex flex-column pt-0">
              <span className="fs-2hx fw-bold text-gray-900 mb-2">
                {Intl.NumberFormat("en-US").format(
                  card.pending?.currentPending
                )}
              </span>
              <div className="d-flex align-items-center gap-2">
                <span
                  className={`badge badge-light-${
                    card.pending?.percentPending >= 0 ? "success" : "danger"
                  } fs-base`}
                >
                  {Intl.NumberFormat("en-US").format(
                    card.pending?.percentPending
                  )}
                  %
                </span>
                <span className="text-gray-500 fw-semibold fs-6">
                  vs Last Month
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-4 col-6">
          <div className="card card-flush">
            <div className="card-header">
              <div className="card-title d-flex flex-column">
                <div className="d-flex align-items-center">
                  <i className="la la-sync-alt fs-2 text-dark"></i>
                  <span className="fw-bold text-gray-900 ms-2">
                    On Progress
                  </span>
                </div>
              </div>
            </div>

            <div className="card-body d-flex flex-column pt-0">
              <span className="fs-2hx fw-bold text-gray-900 mb-2">
                {Intl.NumberFormat("en-US").format(
                  card.progress?.currentProgress
                )}
              </span>
              <div className="d-flex align-items-center gap-2">
                <span
                  className={`badge badge-light-${
                    card.progress?.percentProgress >= 0 ? "success" : "danger"
                  } fs-base`}
                >
                  {Intl.NumberFormat("en-US").format(
                    card.progress?.percentProgress
                  )}
                  %
                </span>
                <span className="text-gray-500 fw-semibold fs-6">
                  vs Last Month
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-4 col-6">
          <div className="card card-flush">
            <div className="card-header">
              <div className="card-title d-flex flex-column">
                <div className="d-flex align-items-center">
                  <i className="la la-sign-out-alt fs-2 text-dark"></i>
                  <span className="fw-bold text-gray-900 ms-2">Selesai</span>
                </div>
              </div>
            </div>

            <div className="card-body d-flex flex-column pt-0">
              <span className="fs-2hx fw-bold text-gray-900 mb-2">
                {Intl.NumberFormat("en-US").format(
                  card.selesai?.currentSelesai
                )}
              </span>
              <div className="d-flex align-items-center gap-2">
                <span
                  className={`badge badge-light-${
                    card.selesai?.percentSelesai >= 0 ? "success" : "danger"
                  } fs-base`}
                >
                  {Intl.NumberFormat("en-US").format(
                    card.selesai?.percentSelesai
                  )}
                  %
                </span>
                <span className="text-gray-500 fw-semibold fs-6">
                  vs Last Month
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-10" style={{ rowGap: "1.5rem" }}>
        <div className="col-lg-6">
          {isDeliveredLoading ? (
            <Skeleton height={400} />
          ) : (
            <div className="card card-flush">
              <div className="card-header d-flex align-items-center justify-content-between gap-5">
                <div className="card-title">Avg. Monthly Delivered</div>
                <Select
                  options={tahuns}
                  isSearchable={false}
                  className="fs-6"
                  value={tahuns.find((t) => t.value == tahunDelivered)}
                  onChange={(e) => setTahunDelivered(e.value)}
                />
              </div>
              <div className="card-body pt-0">
                <ul class="nav nav-tabs nav-line-tabs mb-5 fs-6">
                  <li class="nav-item">
                    <a
                      class="nav-link active"
                      data-bs-toggle="tab"
                      href="#delivered-12-months"
                    >
                      12 Months
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      data-bs-toggle="tab"
                      href="#delivered-3-months"
                    >
                      3 Months
                    </a>
                  </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                  <div
                    class="tab-pane fade show active"
                    id="delivered-12-months"
                    role="tabpanel"
                  >
                    <ReactApexChart
                      options={chartDelivered[12].options}
                      series={chartDelivered[12].series}
                      type="area"
                      height={300}
                    />
                  </div>
                  <div
                    class="tab-pane fade"
                    id="delivered-3-months"
                    role="tabpanel"
                  >
                    <ReactApexChart
                      options={chartDelivered[3].options}
                      series={chartDelivered[3].series}
                      type="area"
                      height={300}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-lg-6">
          {isRevenueLoading ? (
            <Skeleton height={400} />
          ) : (
            <div className="card card-flush">
              <div className="card-header d-flex align-items-center justify-content-between gap-5">
                <div className="card-title">Grafik Pemasukan</div>
                <Select
                  options={tahuns}
                  isSearchable={false}
                  className="fs-6"
                  value={tahuns.find((t) => t.value == tahunRevenue)}
                  onChange={(e) => setTahunRevenue(e.value)}
                />
              </div>
              <div className="card-body pt-0">
                <ul class="nav nav-tabs nav-line-tabs mb-5 fs-6">
                  <li class="nav-item">
                    <a
                      class="nav-link active"
                      data-bs-toggle="tab"
                      href="#revenue-12-months"
                    >
                      12 Months
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      data-bs-toggle="tab"
                      href="#revenue-3-months"
                    >
                      3 Months
                    </a>
                  </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                  <div
                    class="tab-pane fade show active"
                    id="revenue-12-months"
                    role="tabpanel"
                  >
                    <ReactApexChart
                      options={chartRevenue[12].options}
                      series={chartRevenue[12].series}
                      type="area"
                      height={300}
                    />
                  </div>
                  <div
                    class="tab-pane fade"
                    id="revenue-3-months"
                    role="tabpanel"
                  >
                    <ReactApexChart
                      options={chartRevenue[3].options}
                      series={chartRevenue[3].series}
                      type="area"
                      height={300}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card card-flush">
        <div className="card-header align-items-center">
          <div className="card-title">Pengiriman Terakhir</div>
          <button
            type="button"
            className="btn btn-light-danger btn-sm"
            onClick={() =>
              exportExcel("/dashboard/export", "POST", {
                status,
                range: filterDate,
              })
            }
          >
            Export
            <i className="la la-file-alt fs-4 ms-2"></i>
          </button>
        </div>
        <div className="card-body pt-0">
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
                onClick={() => setStatus(null)}
              >
                Semua
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link ms-2 btn btn-active-light btn-color-gray-600 btn-active-color-primary rounded-bottom-0"
                data-bs-toggle="tab"
                href="#status-pending"
                onClick={() => setStatus("Pengiriman Dibuat")}
              >
                Pending
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link ms-2 btn btn-active-light btn-color-gray-600 btn-active-color-primary rounded-bottom-0"
                data-bs-toggle="tab"
                href="#status-progress"
                onClick={() => setStatus("Diproses")}
              >
                On Progress
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link ms-2 btn btn-active-light btn-color-gray-600 btn-active-color-primary rounded-bottom-0"
                data-bs-toggle="tab"
                href="#status-delivery"
                onClick={() => setStatus("Delivery")}
              >
                Delivery
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link ms-2 btn btn-active-light btn-color-gray-600 btn-active-color-primary rounded-bottom-0"
                data-bs-toggle="tab"
                href="#status-delivered"
                onClick={() => setStatus("Delivered")}
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
                url="/pengiriman/paginate"
                payload={{ range: filterDate }}
              ></Paginate>
            </div>
            <div className="tab-pane fade" id="status-pending" role="tabpanel">
              <Paginate
                id="my-table-pending"
                columns={columns}
                url="/pengiriman/paginate?status=Pengiriman Dibuat"
                payload={{ range: filterDate }}
              ></Paginate>
            </div>
            <div className="tab-pane fade" id="status-progress" role="tabpanel">
              <Paginate
                id="my-table-progress"
                columns={columns}
                url="/pengiriman/paginate?status=Diproses"
                payload={{ range: filterDate }}
              ></Paginate>
            </div>
            <div className="tab-pane fade" id="status-delivery" role="tabpanel">
              <Paginate
                id="my-table-delivery"
                columns={columns}
                url="/pengiriman/paginate?status=Delivery"
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
                url="/pengiriman/paginate?status=Delivered"
                payload={{ range: filterDate }}
              ></Paginate>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
