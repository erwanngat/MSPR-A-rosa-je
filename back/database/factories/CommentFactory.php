<?php

namespace Database\Factories;

use App\Models\Plante;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'comment' => 'Commentaire',
            'user_id' => User::factory(),
            'plante_id' => Plante::factory(),
        ];
    }
}
