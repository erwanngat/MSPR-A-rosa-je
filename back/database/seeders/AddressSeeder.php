<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('addresses')->insert([
            'country' => 'France',
            'city' => 'lyon',
            'zip_code' => '69000',
            'street' => 'rue test',
            'additional_address_details' => 'bat E',
        ]);
        DB::table('addresses')->insert([
            'country' => 'France',
            'city' => 'Villefranche',
            'zip_code' => '69400',
            'street' => 'rue test 2',
            'additional_address_details' => 'bat F',
        ]);
    }
}
