<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Menu;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        DB::table('menus')->truncate();

        $menus = [
            // Front
            ['name' => 'Masuk Admin', 'url' => 'dashboard/login', 'route' => 'front.auth.login-dashboard', 'component' => 'front/auth/LoginDashboard', 'shown' => false, 'middleware' => 'guest'],

            ['middleware' => 'auth', 'children' => [
                ['name' => 'Home', 'url' => '/', 'route' => 'front.home', 'component' => 'front/home/Index'],
                ['name' => 'Detail Produk', 'url' => '/produk/{uuid}', 'route' => 'front.produk', 'component' => 'front/produk/Index'],
                ['name' => 'Keranjang', 'url' => '/keranjang', 'route' => 'front.keranjang', 'component' => 'front/keranjang/Index'],
                ['name' => 'Pesanan', 'url' => '/pesanan', 'route' => 'front.pesanan', 'component' => 'front/pesanan/Index'],
                ['name' => 'Akun', 'url' => '/akun', 'route' => 'front.akun', 'component' => 'front/akun/Index'],
                ['name' => 'Edit Profile', 'url' => '/akun/edit', 'route' => 'front.akun.edit', 'component' => 'front/akun/Edit'],

                ['middleware' => 'role:admin,cabang,kurir', 'children' => [
                    ['name' => 'Overview', 'url' => 'dashboard', 'route' => 'dashboard', 'component' => 'dashboard/Index', 'icon' => 'las la-th-large fs-1'],
                    ['name' => 'Tracking', 'url' => 'dashboard/tracking', 'route' => 'dashboard.tracking', 'component' => 'dashboard/tracking/Index', 'icon' => 'las la-globe fs-1'],
                ]],

                ['middleware' => 'role:admin,cabang', 'children' => [
                    ['name' => 'Transaksi', 'url' => 'dashboard/transaksi', 'route' => 'dashboard.transaksi', 'component' => 'dashboard/transaksi/Index', 'icon' => 'las la-cart-arrow-down fs-1'],
                ]],

                ['middleware' => 'role:admin', 'children' => [
                    ['name' => 'Data', 'url' => 'dashboard/data', 'route' => 'dashboard.data', 'component' => 'dashboard/data/Index', 'icon' => 'las la-archive fs-1', 'children' => [
                        ['name' => 'Produk', 'url' => 'dashboard/data/produk', 'route' => 'dashboard.data.produk', 'component' => 'dashboard/data/produk/Index', 'icon' => ''],
                        ['name' => 'Satuan Barang', 'url' => 'dashboard/data/satuan-barang', 'route' => 'dashboard.data.satuan-barang', 'component' => 'dashboard/data/satuan-barang/Index', 'icon' => ''],
                        ['name' => 'Opsi Pengiriman', 'url' => 'dashboard/data/opsi-pengiriman', 'route' => 'dashboard.data.opsi-pengiriman', 'component' => 'dashboard/data/opsi-pengiriman/Index', 'icon' => ''],
                        ['name' => 'Tarif Kurir', 'url' => 'dashboard/data/tarif-kurir', 'route' => 'dashboard.data.tarif-kurir', 'component' => 'dashboard/data/tarif-kurir/Index', 'icon' => ''],
                        ['name' => 'Banner', 'url' => 'dashboard/data/banner', 'route' => 'dashboard.data.banner', 'component' => 'dashboard/data/banner/Index', 'icon' => ''],
                    ]],

                    ['name' => 'User', 'url' => 'dashboard/user', 'route' => 'dashboard.user', 'component' => 'dashboard/user/Index', 'icon' => 'las la-users fs-1', 'children' => [
                        ['name' => 'Cabang', 'url' => 'dashboard/user/cabang', 'route' => 'dashboard.user.cabang', 'component' => 'dashboard/user/cabang/Index', 'icon' => ''],
                        ['name' => 'Kurir', 'url' => 'dashboard/user/kurir', 'route' => 'dashboard.user.kurir', 'component' => 'dashboard/user/kurir/Index', 'icon' => ''],
                        ['name' => 'Customer', 'url' => 'dashboard/user/customer', 'route' => 'dashboard.user.customer', 'component' => 'dashboard/user/customer/Index', 'icon' => ''],
                    ]],
                ]],

            ]],
        ];

        foreach ($menus as $menu) {
            if (!isset($menu['name'])) {
                $this->seedChildren($menu['children'], 0, $menu['middleware']);
            } else {
                $data = Menu::create(collect($menu)->except(['children'])->toArray());
                if (isset($menu['children'])) {
                    @$this->seedChildren($menu['children'], $data->id, $menu['middleware']);
                }
            }
        }
    }

    private function seedChildren($menus, $parent_id, $parent_middleware = '') {
        foreach ($menus as $menu) {
            @$middleware = rtrim($parent_middleware . '|' . $menu['middleware'], '|');
            if (!isset($menu['name'])) {
                $this->seedChildren($menu['children'], $parent_id, $middleware);
            } else {
                $menu['parent_id'] = $parent_id;
                $menu['middleware'] = $middleware;
                $data = Menu::create(collect($menu)->except(['children'])->toArray());
                if (isset($menu['children'])) {
                    $this->seedChildren($menu['children'], $data->id, $middleware);
                }
            }
        }
    }
}
