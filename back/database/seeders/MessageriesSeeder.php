<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MessageriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('messageries')->insert([
            'message'=>'Bonjour pouvez-vous gardez ma plante ',
            'user_id_sender' => 1,
            'user_id_receiver' => 2,
        ]);

        DB::table('messageries')->insert([
            'message'=>'Bonjour oui je le peux',
            'user_id_sender' => 2,
            'user_id_receiver' => 1,
        ]);

    }
}
