<?php

use App\Http\Controllers\AlamatController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\JenisPembayaranController;
use App\Http\Controllers\KategoriBarangController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\KomplainController;
use App\Http\Controllers\LayananOngkirController;
use App\Http\Controllers\OngkirController;
use App\Http\Controllers\OpsiPengirimanController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\PenerimaController;
use App\Http\Controllers\PengirimanController;
use App\Http\Controllers\PengirimController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\SatuanBarangController;
use App\Http\Controllers\TarifKurirController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth'])->group(function () {
    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::post('', [DashboardController::class, 'index']);
        Route::post('delivered', [DashboardController::class, 'delivered']);
        Route::post('revenue', [DashboardController::class, 'revenue']);
        Route::post('export', [DashboardController::class, 'export']);
        Route::get('menu', [DashboardController::class, 'menu']);
    });

    Route::group(['prefix' => 'pengiriman'], function () {
        Route::get('show', [PengirimanController::class, 'show']);
        Route::post('paginate', [PengirimanController::class, 'paginate']);
        Route::post('store', [PengirimanController::class, 'store']);
        Route::get('{uuid}/edit', [PengirimanController::class, 'edit']);
        Route::post('{uuid}/update', [PengirimanController::class, 'update']);
        Route::delete('{uuid}/destroy', [PengirimanController::class, 'destroy']);

        Route::get('resi', [PengirimanController::class, 'cetakResi']);
        Route::post('resi', [PengirimanController::class, 'cetakResi']);
        Route::post('export', [PengirimanController::class, 'export']);
    });

    Route::group(['prefix' => 'komplain'], function () {
        Route::get('show', [KomplainController::class, 'show']);
        Route::post('paginate', [KomplainController::class, 'paginate']);
        Route::post('store', [KomplainController::class, 'store']);
        Route::get('{uuid}/edit', [KomplainController::class, 'edit']);
        Route::post('{uuid}/update', [KomplainController::class, 'update']);
    });

    Route::group(['prefix' => 'tracking'], function () {
        Route::get('show', [TrackingController::class, 'show']);
        Route::post('paginate', [TrackingController::class, 'paginate']);
        Route::post('store', [TrackingController::class, 'store']);
        Route::get('{uuid}/edit', [TrackingController::class, 'edit']);
        Route::post('{uuid}/update', [TrackingController::class, 'update']);
        Route::delete('{uuid}/destroy', [TrackingController::class, 'destroy']);
    });

    Route::group(['prefix' => 'keuangan'], function () {
        Route::get('show', [PembayaranController::class, 'show']);
        Route::post('paginate', [PembayaranController::class, 'paginate']);
        Route::post('store', [PembayaranController::class, 'store']);
        Route::get('{uuid}/edit', [PembayaranController::class, 'edit']);
        Route::post('{uuid}/update', [PembayaranController::class, 'update']);
        Route::delete('{uuid}/destroy', [PembayaranController::class, 'destroy']);

        Route::post('export', [PembayaranController::class, 'export']);
    });

    Route::group(['prefix' => 'data', 'middleware' => 'role:admin'], function () {
        Route::group(['prefix' => 'produk'], function () {
            Route::post('estimasi-harga', [ProdukController::class, 'estimasiHarga']);
            Route::get('show', [ProdukController::class, 'show'])->withoutMiddleware(['role:admin']);
            Route::post('paginate', [ProdukController::class, 'paginate'])->withoutMiddleware(['role:admin']);
            Route::get('{uuid}', [ProdukController::class, 'detail'])->withoutMiddleware(['role:admin']);
            Route::post('store', [ProdukController::class, 'store']);
            Route::get('{uuid}/edit', [ProdukController::class, 'edit']);
            Route::post('{uuid}/update', [ProdukController::class, 'update']);
            Route::delete('{uuid}/destroy', [ProdukController::class, 'destroy']);
        });

        Route::group(['prefix' => 'satuan-barang'], function () {
            Route::get('show', [SatuanBarangController::class, 'show']);
            Route::post('paginate', [SatuanBarangController::class, 'paginate']);
            Route::post('store', [SatuanBarangController::class, 'store']);
            Route::get('{uuid}/edit', [SatuanBarangController::class, 'edit']);
            Route::post('{uuid}/update', [SatuanBarangController::class, 'update']);
            Route::delete('{uuid}/destroy', [SatuanBarangController::class, 'destroy']);
        });

        Route::group(['prefix' => 'opsi-pengiriman'], function () {
            Route::get('show', [OpsiPengirimanController::class, 'show']);
            Route::post('paginate', [OpsiPengirimanController::class, 'paginate']);
            Route::post('store', [OpsiPengirimanController::class, 'store']);
            Route::get('{uuid}/edit', [OpsiPengirimanController::class, 'edit']);
            Route::post('{uuid}/update', [OpsiPengirimanController::class, 'update']);
            Route::delete('{uuid}/destroy', [OpsiPengirimanController::class, 'destroy']);
        });

        Route::group(['prefix' => 'tarif-kurir'], function () {
            Route::get('show', [TarifKurirController::class, 'show']);
            Route::post('paginate', [TarifKurirController::class, 'paginate']);
            Route::post('store', [TarifKurirController::class, 'store']);
            Route::get('{uuid}/edit', [TarifKurirController::class, 'edit']);
            Route::post('{uuid}/update', [TarifKurirController::class, 'update']);
            Route::delete('{uuid}/destroy', [TarifKurirController::class, 'destroy']);
        });

        Route::group(['prefix' => 'banner'], function () {
            Route::get('show', [BannerController::class, 'show'])->withoutMiddleware(['role:admin']);
            Route::post('paginate', [BannerController::class, 'paginate']);
            Route::post('store', [BannerController::class, 'store']);
            Route::get('{uuid}/edit', [BannerController::class, 'edit']);
            Route::post('{uuid}/update', [BannerController::class, 'update']);
            Route::delete('{uuid}/destroy', [BannerController::class, 'destroy']);
        });
    });

    Route::group(['prefix' => 'user', 'middleware' => 'role:admin'], function () {
        Route::get('show', [UserController::class, 'show'])->withoutMiddleware('role:admin');
        Route::post('paginate', [UserController::class, 'paginate']);
        Route::post('store', [UserController::class, 'store']);
        Route::get('{uuid}/edit', [UserController::class, 'edit']);
        Route::post('{uuid}/update', [UserController::class, 'update']);
        Route::delete('{uuid}/destroy', [UserController::class, 'destroy']);
    });

    Route::middleware(['auth'])->group(function () {
        Route::group(['prefix' => 'keranjang'], function () {
            Route::get("/", [KeranjangController::class, 'index']);
            Route::post("/", [KeranjangController::class, 'store']);
            Route::post("/{type}", [KeranjangController::class, 'update']);
            Route::delete("/{uuid}", [KeranjangController::class, 'destroy']);
        });

        Route::group(['prefix' => 'alamat'], function () {
            Route::get("/", [AlamatController::class, 'index']);
            Route::post("/", [AlamatController::class, 'store']);
            Route::put("/", [AlamatController::class, 'update']);
            Route::delete("/{uuid}", [AlamatController::class, 'destroy']);
        });

        Route::post("checkout", [CheckoutController::class, "post"]);
    });
});
