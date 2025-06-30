<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messageries', function (Blueprint $table) {
            $table->id();
            $table->longText('message');
            $table->foreignId('user_id_sender')->constrained('users');
            $table->foreignId('user_id_receiver')->constrained('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messageries');
    }
};
