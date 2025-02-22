<?php

namespace Tests\Unit;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_all_reservations()
    {
        $user = User::factory()->create();

        $owner = User::factory()->create();
        $gardener = User::factory()->create();

        $reservation1 = Reservation::create([
            'owner_user_id' => $owner->id,
            'gardener_user_id' => $gardener->id,
            'start_date' => '2025-03-01',
            'end_date' => '2025-03-05'
        ]);

        $reservation2 = Reservation::create([
            'owner_user_id' => $owner->id,
            'gardener_user_id' => $gardener->id,
            'start_date' => '2025-04-01',
            'end_date' => '2025-04-07'
        ]);

        $response = $this->actingAs($user)->getJson('/api/reservations');
        $response->assertStatus(200);
        $response->assertJsonFragment(['start_date' => '2025-03-01']);
        $response->assertJsonFragment(['start_date' => '2025-04-01']);
    }

    public function test_no_reservations_found()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/reservations');
        $response->assertStatus(200);
        $response->assertJson([]);
    }

    public function test_user_can_view_a_single_reservation()
    {
        $user = User::factory()->create();

        $owner = User::factory()->create();
        $gardener = User::factory()->create();

        $reservation = Reservation::create([
            'owner_user_id' => $owner->id,
            'gardener_user_id' => $gardener->id,
            'start_date' => '2025-05-01',
            'end_date' => '2025-05-10'
        ]);

        $response = $this->actingAs($user)->getJson("/api/reservations/{$reservation->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment(['start_date' => '2025-05-01']);
    }

    public function test_user_cannot_view_non_existent_reservation()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/reservations/999');
        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'Reservation not found'
        ]);
    }

    public function test_user_can_create_reservation()
    {
        $user = User::factory()->create();

        $owner = User::factory()->create();
        $gardener = User::factory()->create();

        $reservationData = [
            'owner_user_id' => $owner->id,
            'gardener_user_id' => $gardener->id,
            'start_date' => '2025-06-01',
            'end_date' => '2025-06-15'
        ];
        $response = $this->actingAs($user)->postJson('/api/reservations', $reservationData);
        $response->assertStatus(201);
        $response->assertJsonFragment(['start_date' => '2025-06-01']);
    }

    public function test_user_can_update_reservation()
    {
        $user = User::factory()->create();

        $owner = User::factory()->create();
        $gardener = User::factory()->create();

        $reservation = Reservation::create([
            'owner_user_id' => $owner->id,
            'gardener_user_id' => $gardener->id,
            'start_date' => '2025-07-01',
            'end_date' => '2025-07-10'
        ]);

        $updatedData = [
            'owner_user_id' => $owner->id,
            'gardener_user_id' => $gardener->id,
            'start_date' => '2025-08-01',
            'end_date' => '2025-08-15'
        ];

        $response = $this->actingAs($user)->putJson("/api/reservations/{$reservation->id}", $updatedData);
        $response->assertStatus(200);
        $response->assertJsonFragment(['start_date' => '2025-08-01']);
    }

    public function test_user_can_delete_reservation()
    {
        $user = User::factory()->create();

        $owner = User::factory()->create();
        $gardener = User::factory()->create();

        $reservation = Reservation::create([
            'owner_user_id' => $owner->id,
            'gardener_user_id' => $gardener->id,
            'start_date' => '2025-09-01',
            'end_date' => '2025-09-10'
        ]);

        $response = $this->actingAs($user)->deleteJson("/api/reservations/{$reservation->id}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('reservations', [
            'id' => $reservation->id,
        ]);
    }
}
