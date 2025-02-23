<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class EmailVerifiedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $domains = [
            'botaniste.org',
            'botaniste.fr',
            'botaniste.com',
            'botanisteofficiel.com'
        ];

        foreach ($domains as $domain) {
            DB::table('email_verified')->insert([
                'end_email' => $domain,
            ]);
        }
    }
}
