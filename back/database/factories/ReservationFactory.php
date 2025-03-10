<?php

namespace Database\Factories;

use App\Models\Plante;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'plante_id' => Plante::factory(),
            'owner_user_id' => User::factory(),
            'gardener_user_id' => User::factory(),
            'start_date' => fake()->date(),
            'end_date' => fake()->date()
        ];
    }
}
