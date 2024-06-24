<?php

namespace App\Http\Controllers;

use App\Http\Requests\PembayaranRequest;
use App\Models\Pengiriman;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class PembayaranController extends Controller {
    public function paginate(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $data = Pengiriman::with(['satuan', 'cabang', 'pengirim.city', 'penerima.city', 'jenis_pembayaran'])->where(function ($q) use ($request) {
            $q->where('resi', 'LIKE', "%$request->search%");
            $q->orWhere('status', 'LIKE', "%$request->search%");
            $q->orWhere('total_berat', 'LIKE', "%$request->search%");
            $q->orWhere('total_koli', 'LIKE', "%$request->search%");
            $q->orWhere('catatan', 'LIKE', "%$request->search%");
            $q->orWhereHas('satuan', function ($q) use ($request) {
                $q->where('nama', 'LIKE', "%$request->search%");
            });
            $q->orWhereHas('cabang', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%$request->search%");
            });
            $q->orWhereHas('pengirim', function ($q) use ($request) {
                $q->where('nama', 'LIKE', "%$request->search%");
                $q->orWhereHas('city', function ($q) use ($request) {
                    $q->where('name', 'LIKE', "%$request->search%");
                });
            });
            $q->orWhereHas('penerima', function ($q) use ($request) {
                $q->where('nama', 'LIKE', "%$request->search%");
                $q->orWhereHas('city', function ($q) use ($request) {
                    $q->where('name', 'LIKE', "%$request->search%");
                });
            });
            $q->orWhereHas('layanan', function ($q) use ($request) {
                $q->where('nama', 'LIKE', "%$request->search%");
            });
            $q->orWhereHas('trackings', function ($q) use ($request) {
                $q->whereHas('kurir', function ($q) use ($request) {
                    $q->where('name', 'LIKE', "%$request->search%");
                });
            });
        })->when(str_contains($request->range, "to"), function ($q) use ($request) {
            $range = explode(" to ", $request->range);
            $q->whereBetween('tanggal_kirim', $range);
        })->when($request->status, function ($q) use ($request) {
            $q->where('status', $request->status);
        })->when(auth()->user()->role == 'cabang', function ($q) {
            $q->where('cabang_id', auth()->user()->id);
        })->when($request->status, function ($q) use ($request) {
            $q->where('status', $request->status);
        })->when($request->status_bayar != '-', function ($q) use ($request) {
            $q->where('status_bayar', $request->status_bayar);
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        $data->map(function ($a) {
            $a->notes = @$a->pembayarans()->orderBy('id', 'DESC')->first()->catatan ?? '-';
        });

        return response()->json($data);
    }

    public function show() {
        return response()->json(Pembayaran::get());
    }

    public function store(PembayaranRequest $request) {
        $body = $request->validated();

        $pengiriman = Pengiriman::find($request->pengiriman_id);
        if ($pengiriman->pembayaran['piutang'] < $body['nominal']) {
            return response()->json([
                'errors' => [
                    'nominal' => ['Nominal pembayaran tidak boleh melebihi Sisa Pembayaran (Piutang)']
                ]
            ], 400);
        }

        $data = Pembayaran::create($body);
        $data->pengiriman->updateStatusBayar();

        return response()->json([
            'message' => 'Berhasil menambahkan data',
        ]);
    }

    public function edit($uuid) {
        $data = Pengiriman::with(['pembayarans', 'cabang', 'pengirim'])->where('uuid', $uuid)->first();
        return response()->json($data);
    }

    public function update(PembayaranRequest $request, $uuid) {
        $body = $request->validated();

        $data = Pembayaran::findByUuid($uuid);
        $data->update($body);
        $data->pengiriman->updateStatusBayar();

        return response()->json([
            'message' => 'Berhasil memperbarui data',
        ]);
    }

    public function destroy($uuid) {
        $data = Pembayaran::findByUuid($uuid);
        $data->delete();
        $data->pengiriman->updateStatusBayar();

        return response()->json([
            'message' => 'Berhasil menghapus data',
        ]);
    }

    public function export(Request $request) {
        $data = Pengiriman::with(['satuan', 'cabang', 'kategori', 'pengirim.city', 'penerima.city', 'layanan', 'jenis_pembayaran'])->when(str_contains($request->range, "to"), function ($q) use ($request) {
            $range = explode(" to ", $request->range);
            $q->whereBetween('tanggal_kirim', $range);
        })->when($request->status, function ($q) use ($request) {
            $q->where('status', $request->status);
        })->when($request->status_bayar != '-', function ($q) use ($request) {
            $q->where('status_bayar', $request->status_bayar);
        })->when(auth()->user()->role == 'cabang', function ($q) {
            $q->where('cabang_id', auth()->user()->id);
        })->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setCellValue('A1', 'No. Resi');
        $sheet->setCellValue('B1', 'Customer');
        $sheet->setCellValue('C1', 'Status');
        $sheet->setCellValue('D1', 'Tujuan');
        $sheet->setCellValue('E1', 'Tanggal Kirim');
        $sheet->setCellValue('F1', 'Tanggal Terima');
        $sheet->setCellValue('G1', 'Koli');
        $sheet->setCellValue('H1', 'KG');
        $sheet->setCellValue('I1', 'Jumlah');
        $sheet->setCellValue('J1', 'Pembayaran');
        $sheet->setCellValue('K1', 'Piutang');
        $sheet->setCellValue('L1', 'Tanggal Pembayaran');
        $sheet->setCellValue('M1', 'Cabang');
        $sheet->setCellValue('N1', 'TOP');
        $sheet->setCellValue('O1', 'Notes');

        $sheet->getStyle('A1:O1')->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
        $sheet->getStyle('I1:K1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FFC5FB24');

        $row = 2;
        foreach ($data as $key => $pengiriman) {
            $sheet->setCellValue('A' . $row, $pengiriman->resi);
            $sheet->setCellValue('B' . $row, $pengiriman->pengirim->nama);
            $sheet->setCellValue('C' . $row, $pengiriman->status);
            $sheet->setCellValue('D' . $row, $pengiriman->penerima->city->name);
            $sheet->setCellValue('E' . $row, $pengiriman->tanggal_kirim);
            $sheet->setCellValue('F' . $row, $pengiriman->tanggal_terima);
            $sheet->setCellValue('G' . $row, $pengiriman->total_koli);
            $sheet->setCellValue('H' . $row, $pengiriman->total_berat);
            $sheet->setCellValue('I' . $row, $pengiriman->pembayaran['tagihan']);
            $sheet->setCellValue('J' . $row, $pengiriman->pembayaran['dibayarkan'] * -1);
            $sheet->setCellValue('K' . $row, "=I$row-J$row");
            $sheet->setCellValue('L' . $row, @$pengiriman->pembayarans->first()->tanggal);
            $sheet->setCellValue('M' . $row, $pengiriman->cabang->name);
            $sheet->setCellValue('N' . $row, $pengiriman->jenis_pembayaran->nama);
            $sheet->setCellValue('O' . $row, $pengiriman->catatan);

            $row++;
        }

        $writer = new Xlsx($spreadsheet);
        $filename = "Keuangan__$request->status.xlsx";
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        $writer->save("php://output");
    }
}
