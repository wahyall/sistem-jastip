<?php

namespace App\Http\Controllers;

use App\Http\Requests\PengirimanRequest;
use App\Models\Pengiriman;
use App\Models\Tracking;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Webklex\PDFMerger\Facades\PDFMergerFacade;

class PengirimanController extends Controller {
    public function paginate(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $data = Pengiriman::with(['cabang', 'customer'])->where(function ($q) use ($request) {
            $q->where('resi', 'LIKE', "%$request->search%");
            $q->orWhere('status', 'LIKE', "%$request->search%");
            $q->orWhereHas('cabang', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%$request->search%");
            });
            $q->orWhereHas('customer', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%$request->search%");
            });
        })->when(str_contains($request->range, "to"), function ($q) use ($request) {
            $range = explode(" to ", $request->range);
            $q->whereBetween('tanggal_kirim', $range);
        })->when($request->status, function ($q) use ($request) {
            $q->where('status', $request->status);
        })->when(auth()->user()->role == 'cabang', function ($q) {
            $q->where('cabang_id', auth()->user()->id);
        })->when(auth()->user()->role == 'kurir', function ($q) {
            $q->whereHas('trackings', function ($q) {
                $q->where('kurir_id', auth()->user()->id);
            });
        })->when($request->status, function ($q) use ($request) {
            $q->where('status', $request->status);
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($data);
    }

    public function show() {
        return response()->json(Pengiriman::get());
    }

    public function store(PengirimanRequest $request) {
        $body = $request->validated();

        if (auth()->user()->role == 'cabang') {
            $body['cabang_id'] = auth()->user()->id;
        }

        $body['resi'] = Pengiriman::genResi();
        $body['tanggal_kirim'] = date('Y-m-d');
        $body['status'] = 'Pengiriman Dibuat';
        $data = Pengiriman::create($body);

        $data->trackings()->create([
            'status' => 'Pengiriman Dibuat',
            'tanggal' => date('Y-m-d'),
            'jam' => date('H:i'),
        ]);
        $data->updateStatusTracking();

        return response()->json([
            'message' => 'Berhasil menambahkan data',
        ]);
    }

    public function edit($uuid) {
        $data = Pengiriman::findByUuid($uuid);
        return response()->json($data);
    }

    public function update(PengirimanRequest $request, $uuid) {
        $body = $request->validated();

        $data = Pengiriman::findByUuid($uuid);

        if (auth()->user()->role == 'cabang') {
            $body['cabang_id'] = auth()->user()->id;
        }
        $data->update($body);

        return response()->json([
            'message' => 'Berhasil memperbarui data',
        ]);
    }

    public function destroy($uuid) {
        $data = Pengiriman::findByUuid($uuid);
        $data->delete();

        return response()->json([
            'message' => 'Berhasil menghapus data',
        ]);
    }

    public function cetakResi(Request $request) {
        $data = Pengiriman::with(['pengirim.city', 'penerima.city', 'cabang'])->whereIn('resi', $request->resi)->get();

        if ($request->preview) {
            $pdf = PDF::loadView('report.resi', ['pengiriman' => $data->first()]);
            $pdf->setPaper('F4');
            return $pdf->stream("Resi Pengiriman " . $data->first()->resi . ".pdf");
        }

        if (!is_dir(storage_path('tmp'))) {
            mkdir(storage_path('tmp'));
        }

        $pdfMerger = PDFMergerFacade::init();
        foreach ($data as $key => $pengiriman) {
            $pdf = PDF::loadView('report.resi', compact('pengiriman'));
            $pdf->setPaper('F4');
            $pdfMerger->addString($pdf->output(), 'all');
        }

        $pdfMerger->merge();
        $pdfMerger->setFileName('Resi Pengiriman.pdf');
        $pdfMerger->stream();
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
