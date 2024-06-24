<?php

if (!function_exists('currency')) {
    function currency($number, $withRP = false) {
        $value = number_format($number, 0, ',', '.');
        if ($withRP) {
            $value = 'Rp ' . $value;
        }
        return $value;
    }
}

if (!function_exists('date_indo')) {
    function date_indo($tanggal, $cetak_hari = false) {
        $hari = array(
            '',
            'Senin',
            'Selasa',
            'Rabu',
            'Kamis',
            'Jumat',
            'Sabtu',
            'Minggu'
        );

        $bulan = array(
            '', //0
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember'
        );
        $split       = explode('-', $tanggal);
        $tgl_indo = $split[2] . ' ' . $bulan[(int)$split[1]] . ' ' . $split[0];

        if ($cetak_hari) {
            $num = date('N', strtotime($tanggal));
            return $hari[$num] . ', ' . $tgl_indo;
        }
        return $tgl_indo;
    }
}
