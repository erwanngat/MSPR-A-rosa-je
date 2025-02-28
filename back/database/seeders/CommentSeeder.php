<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('comments')->insert([
            'comment' => 'commentaire num 1',
            'user_id' => 2,
            'plante_id' => 2,
        ]);
        DB::table('comments')->insert([
            'comment' => 'commentaire num 2',
            'user_id' => 2,
            'plante_id' => 2,
        ]);
    }
}
