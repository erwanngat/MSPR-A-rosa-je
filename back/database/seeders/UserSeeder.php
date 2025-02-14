<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'user1',
            'email' => 'user@test.com',
            'phone_number' => '0011223344',
            'password' => 'user123456',
        ]);
        DB::table('users')->insert([
            'name' => 'botaniste',
            'email' => 'botaniste@test.com',
            'phone_number' => '0011223344',
            'password' => 'bot123456',
        ]);
    }
}
