<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('plantes')->insert([
            'name' => 'plante 1',
            'description' => 'Plante description 1',
            'image' => 'http://localhost:8080/storage/plantes/default.webp',
            'address_id' => 1,
            'user_id' => 1,
        ]);
        DB::table('plantes')->insert([
            'name' => 'plante 2',
            'description' => 'Plante description 2',
            'image' => 'http://localhost:8080/storage/plantes/default.webp',
            'address_id' => 1,
            'user_id' => 1,
        ]);
        DB::table('plantes')->insert([
            'name' => 'plante 3',
            'description' => 'Plante description 3',
            'image' => 'http://localhost:8080/storage/plantes/default.webp',
            'address_id' => 2,
            'user_id' => 2,
        ]);
    }
}
