<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Resi Pengiriman</title>

    <style>
        *,
        *::before,
        *::after {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            padding: 1rem
        }

        table {
            width: 100%;
        }

        table td {
            padding: 0.5rem
        }

        .border {
            border: 1px solid #000;
        }

        .text-center {
            text-align: center;
        }

        .barcode div {
            height: 60px !important;
        }
    </style>
</head>

<body>
    <table cellspacing="0">
        <tr>
            <td class="border text-center">
                <h2>No. Resi: {{ $pengiriman->resi }}</h2>
            </td>
        </tr>
        <tr>
            <td>
                <div class="barcode" style="transform: scale(1.65); margin: 1rem 0 0 12.5rem">
                    {!! DNS1D::getBarcodeHTML($pengiriman->resi, 'C39') !!}
                </div>
                <br>
            </td>
        </tr>
        <tr>
            <td>
                <div style="border: 3px dashed #000"></div>
            </td>
        </tr>
        <tr>
            <td>
                <table cellspacing="0">
                    <tr>
                        <td style="width: 50%; vertical-align: top">
                            <div>
                                <strong>Penerima: </strong>
                                {{ $pengiriman->penerima->nama }}
                            </div>
                            <div style="margin: 1rem 0">
                                <span class="border" style="padding: 0.5rem 0.75rem">HOME</span>
                            </div>
                            <div>{{ $pengiriman->penerima->telp }}</div>
                            <div>{{ $pengiriman->penerima->alamat }}, {{ $pengiriman->penerima->district->name }},</div>
                            <div>{{ $pengiriman->penerima->city->name }}, {{ $pengiriman->penerima->province->name }}
                            </div>
                        </td>
                        <td style="width: 50%; vertical-align: top">
                            <div>
                                <strong>Pengirim: </strong>
                                {{ $pengiriman->pengirim->nama }}
                            </div>
                            <br>
                            <div>{{ $pengiriman->pengirim->telp }}</div>
                            <div>{{ $pengiriman->pengirim->alamat }}, {{ $pengiriman->pengirim->district->name }},
                            </div>
                            <div>{{ $pengiriman->pengirim->city->name }}, {{ $pengiriman->pengirim->province->name }}
                            </div>
                        </td>
                    </tr>
                </table>

                <br>
            </td>
        </tr>
        <tr>
            <td>
                <table>
                    <tr>
                        <td style="width: 50%">
                            <div class="border text-center" style="padding: 0.5rem">
                                <h4>{{ $pengiriman->pengirim->city->name }}</h4>
                            </div>
                        </td>
                        <td style="width: 50%">
                            <div class="border text-center" style="padding: 0.5rem">
                                <h4>{{ $pengiriman->pengirim->district->name }}</h4>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <div style="padding: 0.5rem; margin-top: -2rem">
                    <table>
                        <tr>
                            <td class="border text-center" style="width: 30%">
                                <h4>{{ $pengiriman->jenis_pembayaran->nama }}</h4>
                            </td>
                            <td class="border text-center" style="width: 70%">
                                <h4>{{ $pengiriman->catatan }}</h4>
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <table style="margin-top: -2rem">
                    <tr>
                        <td style="width: 80%">
                            <table>
                                <tr>
                                    <td style="width: 50%">
                                        <strong>Berat: </strong> {{ $pengiriman->total_berat }} gr
                                    </td>
                                    <td style="width: 50%">
                                        <strong>Ongkos Kirim: </strong>
                                        {{ currency($pengiriman->total_ongkir + $pengiriman->biaya_tambahan, true) }}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width: 50%">
                                        <strong>Jumlah: </strong> {{ $pengiriman->total_koli }}
                                        {{ $pengiriman->satuan->nama }}
                                    </td>
                                    <td style="width: 50%">
                                        <strong>Detail Barang: </strong>
                                        {{ $pengiriman->detail_barang }}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width: 50%">
                                        <strong>Kategori: </strong> {{ $pengiriman->kategori->nama }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td style="width: 20%"></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
