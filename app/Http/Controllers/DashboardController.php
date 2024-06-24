<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use App\Models\MyCourse;
use App\Models\Pengiriman;
use App\Models\Transaction;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class DashboardController extends Controller {
    public function menu() {
        if (request()->wantsJson()) {
            $menus = Menu::with(['children' => function ($q) {
                $q->where('shown', true);
            }])->where('parent_id', 0)->where(function ($q) {
                $q->where('middleware', 'LIKE', '%' . request()->user()->role . '%');
            })->where('shown', 1)->get();

            return response()->json($menus);
        } else {
            return abort(404);
        }
    }

    public function index(Request $request) {
        if (request()->wantsJson() && request()->ajax()) {
            $lastYear = date('Y');
            $lastMonth = date('m') - 1;
            if ($lastMonth == 0) {
                $lastYear = date('Y') - 1;
                $lastMonth = 12;
            }

            $currentTotal = Pengiriman::author()->whereYear('tanggal_kirim', date('Y'))->whereMonth('tanggal_kirim', date('m'))->count();
            $lastTotal = Pengiriman::author()->whereYear('tanggal_kirim', $lastYear)->whereMonth('tanggal_kirim', $lastMonth)->count();
            $percentTotal = $lastTotal ? (($currentTotal - $lastTotal) / $lastTotal * 100) : 100;

            $currentPending = Pengiriman::author()->whereYear('tanggal_kirim', date('Y'))->whereMonth('tanggal_kirim', date('m'))->whereIn('status', ['Pengiriman Dibuat'])->count();
            $lastPending = Pengiriman::author()->whereYear('tanggal_kirim', $lastYear)->whereMonth('tanggal_kirim', $lastMonth)->whereIn('status', ['Pengiriman Dibuat'])->count();
            $percentPending = $lastPending ? (($currentPending - $lastPending) / $lastPending * 100) : 100;

            $currentProgress = Pengiriman::author()->whereYear('tanggal_kirim', date('Y'))->whereMonth('tanggal_kirim', date('m'))->whereIn('status', ['Diproses', 'Delivery'])->count();
            $lastProgress = Pengiriman::author()->whereYear('tanggal_kirim', $lastYear)->whereMonth('tanggal_kirim', $lastMonth)->whereIn('status', ['Diproses', 'Delivery'])->count();
            $percentProgress = $lastProgress ? (($currentProgress - $lastProgress) / $lastProgress * 100) : 100;

            $currentSelesai = Pengiriman::author()->whereYear('tanggal_kirim', date('Y'))->whereMonth('tanggal_kirim', date('m'))->whereIn('status', ['Delivered'])->count();
            $lastSelesai = Pengiriman::author()->whereYear('tanggal_kirim', $lastYear)->whereMonth('tanggal_kirim', $lastMonth)->whereIn('status', ['Delivered'])->count();
            $percentSelesai = $lastSelesai ? (($currentSelesai - $lastSelesai) / $lastSelesai * 100) : 100;

            return response()->json([
                'total' => compact('currentTotal', 'lastTotal', 'percentTotal'),
                'pending' => compact('currentPending', 'lastPending', 'percentPending'),
                'progress' => compact('currentProgress', 'lastProgress', 'percentProgress'),
                'selesai' => compact('currentSelesai', 'lastSelesai', 'percentSelesai'),
            ]);
        } else {
            abort(404);
        }
    }

    public function delivered(Request $request) {
        if (request()->wantsJson() && request()->ajax()) {
            $start12Date = Carbon::parse("$request->tahun-01-01")->format('Y-m-d H:i:s');
            $end12Date = Carbon::parse("$request->tahun-12-31")->format('Y-m-d H:i:s');

            $end3Date = Carbon::parse("$request->tahun-" . date('m') . "-01")->format('Y-m-d H:i:s');
            $start3Date = Carbon::parse($end3Date)->subMonths(2)->format('Y-m-d H:i:s');

            $period12Date = collect(CarbonPeriod::create($start12Date, '1 month', $end12Date));
            $period3Date = collect(CarbonPeriod::create($start3Date, '1 month', $end3Date));

            $chart12 = $period12Date->map(function ($date) {
                $data = Pengiriman::author()->whereYear('tanggal_kirim', $date->format('Y'))->whereMonth('tanggal_kirim', $date->format('m'))->where('status', 'Delivered')->get();
                return $data->count();
            });

            $chart3 = $period3Date->map(function ($date) {
                $data = Pengiriman::author()->whereYear('tanggal_kirim', $date->format('Y'))->whereMonth('tanggal_kirim', $date->format('m'))->where('status', 'Delivered')->get();
                return $data->count();
            });

            $month12 = $period12Date->map(function ($a) {
                return $a->format('M');
            });
            $month3 = $period3Date->map(function ($a) {
                return $a->format('M');
            });

            return response()->json([
                'chart' => compact('chart12', 'chart3', 'month12', 'month3')
            ]);
        } else {
            abort(404);
        }
    }

    public function revenue(Request $request) {
        if (request()->wantsJson() && request()->ajax()) {
            $start12Date = Carbon::parse("$request->tahun-01-01")->format('Y-m-d H:i:s');
            $end12Date = Carbon::parse("$request->tahun-12-31")->format('Y-m-d H:i:s');

            $end3Date = Carbon::parse("$request->tahun-" . date('m') . "-01")->format('Y-m-d H:i:s');
            $start3Date = Carbon::parse($end3Date)->subMonths(2)->format('Y-m-d H:i:s');

            $period12Date = collect(CarbonPeriod::create($start12Date, '1 month', $end12Date));
            $period3Date = collect(CarbonPeriod::create($start3Date, '1 month', $end3Date));

            $chart12 = $period12Date->map(function ($date) {
                $data = Pengiriman::author()->whereYear('tanggal_kirim', $date->format('Y'))->whereMonth('tanggal_kirim', $date->format('m'))->get();
                return $data->sum('total_ongkir') + $data->sum('biaya_tambahan');
            });

            $chart3 = $period3Date->map(function ($date) {
                $data = Pengiriman::author()->whereYear('tanggal_kirim', $date->format('Y'))->whereMonth('tanggal_kirim', $date->format('m'))->get();
                return $data->sum('total_ongkir') + $data->sum('biaya_tambahan');
            });

            $month12 = $period12Date->map(function ($a) {
                return $a->format('M');
            });
            $month3 = $period3Date->map(function ($a) {
                return $a->format('M');
            });

            return response()->json([
                'chart' => compact('chart12', 'chart3', 'month12', 'month3')
            ]);
        } else {
            abort(404);
        }
    }

    public function export(Request $request) {
        $data = Pengiriman::with(['satuan', 'cabang', 'kategori', 'pengirim.city', 'penerima.city', 'layanan', 'jenis_pembayaran'])->when(str_contains($request->range, "to"), function ($q) use ($request) {
            $range = explode(" to ", $request->range);
            $q->whereBetween('tanggal_kirim', $range);
        })->when($request->status, function ($q) use ($request) {
            $q->where('status', $request->status);
        })->when(auth()->user()->role == 'cabang', function ($q) {
            $q->where('cabang_id', auth()->user()->id);
        })->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setCellValue('A1', 'Kategori');
        $sheet->setCellValue('B1', 'No. Resi');
        $sheet->setCellValue('C1', 'Customer');
        $sheet->setCellValue('D1', 'Penerima');
        $sheet->setCellValue('E1', 'No. Telp');
        $sheet->setCellValue('F1', 'Status');
        $sheet->setCellValue('G1', 'Tujuan');
        $sheet->setCellValue('H1', 'Tanggal Kirim');
        $sheet->setCellValue('I1', 'Tanggal Terima');
        $sheet->setCellValue('J1', 'Koli');
        $sheet->setCellValue('K1', 'KG');
        $sheet->setCellValue('L1', 'Jumlah');
        $sheet->setCellValue('M1', 'Pembayaran');
        $sheet->setCellValue('N1', 'Layanan');
        $sheet->setCellValue('O1', 'Cabang');
        $sheet->setCellValue('P1', 'Notes');

        $sheet->getStyle('A1:P1')->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

        $row = 2;
        foreach ($data as $key => $pengiriman) {
            $sheet->setCellValue('A' . $row, $pengiriman->kategori->nama);
            $sheet->setCellValue('B' . $row, $pengiriman->resi);
            $sheet->setCellValue('C' . $row, $pengiriman->pengirim->nama);
            $sheet->setCellValue('D' . $row, $pengiriman->penerima->nama);
            $sheet->setCellValue('E' . $row, $pengiriman->penerima->telp);
            $sheet->setCellValue('F' . $row, $pengiriman->status);
            $sheet->setCellValue('G' . $row, $pengiriman->penerima->city->name);
            $sheet->setCellValue('H' . $row, $pengiriman->tanggal_kirim);
            $sheet->setCellValue('I' . $row, $pengiriman->tanggal_terima);
            $sheet->setCellValue('J' . $row, $pengiriman->total_koli);
            $sheet->setCellValue('K' . $row, $pengiriman->total_berat);
            $sheet->setCellValue('L' . $row, $pengiriman->total_ongkir + $pengiriman->biaya_tambahan);
            $sheet->setCellValue('M' . $row, $pengiriman->jenis_pembayaran->nama);
            $sheet->setCellValue('N' . $row, $pengiriman->layanan->nama);
            $sheet->setCellValue('O' . $row, $pengiriman->cabang->name);
            $sheet->setCellValue('P' . $row, $pengiriman->catatan);

            $row++;
        }

        $writer = new Xlsx($spreadsheet);
        $filename = "Pengiriman__$request->status.xlsx";
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        $writer->save("php://output");
    }
}
