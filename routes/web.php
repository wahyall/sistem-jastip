<?php

use App\Http\Controllers\MenuController;
use App\Http\Controllers\PengirimanController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return redirect('dashboard');
// });

MenuController::generateRoute();

require __DIR__ . '/auth.php';
