<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('reservations')->insert([
            'plante_id' => 2,
            'owner_user_id' => 1,
            'gardener_user_id' => 2,
            'start_date' => '2025/02/14',
            'end_date' => '2025/02/18',
        ]);
    }
}
