<?php

namespace Tests\Unit;

use App\Models\Address;
use App\Models\Plante;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_all_reservations()
    {
        $reservation = Reservation::factory()->create();
        $reservation1 = Reservation::factory()->create();
        $response = $this->actingAs($reservation->owner)->getJson('/api/reservations');
        $response->assertStatus(200)->assertJsonFragment(['start_date' => $reservation->start_date]);
        $response->assertJsonFragment(['start_date' => $reservation1->start_date]);
    }

    public function test_no_reservations_found()
    {
        $response = $this->actingAs(User::factory()->create())->getJson('/api/reservations');
        $response->assertStatus(404)->assertJson(['error' => 'No reservations found']);
    }

    public function test_user_can_view_a_single_reservation()
    {
        $reservation = Reservation::factory()->create();
        $response = $this->actingAs($reservation->owner)->getJson("/api/reservations/{$reservation->id}");
        $response->assertStatus(200)->assertJsonFragment(['start_date' => $reservation->start_date]);
    }

    public function test_user_cannot_view_non_existent_reservation()
    {
        $response = $this->actingAs(User::factory()->create())->getJson('/api/reservations/999');
        $response->assertStatus(404)->assertJson(['error' => 'Reservation not found']);
    }

    public function test_user_can_create_reservation()
    {
        $reservationData = [
            'plante_id' => Plante::factory()->create()->id,
            'owner_user_id' => User::factory()->create()->id,
            'gardener_user_id' => User::factory()->create()->id,
            'start_date' => '2025-06-01',
            'end_date' => '2025-06-15'
        ];
        $response = $this->actingAs( User::factory()->create())->postJson('/api/reservations', $reservationData);
        $response->assertStatus(201)->assertJsonFragment(['start_date' => '2025-06-01']);
    }

    public function test_user_can_update_reservation()
    {
        $reservation = Reservation::factory()->create();
        $updatedData = [
            'plante_id' => $reservation->plante->id,
            'owner_user_id' => $reservation->owner->id,
            'gardener_user_id' => $reservation->gardener->id,
            'start_date' => '2025-08-01',
            'end_date' => '2025-08-15'
        ];
        $response = $this->actingAs($reservation->owner)->putJson("/api/reservations/{$reservation->id}", $updatedData);
        $response->assertStatus(200)->assertJsonFragment(['start_date' => '2025-08-01']);
    }

    public function test_user_can_delete_reservation()
    {
        $reservation = Reservation::factory()->create();
        $response = $this->actingAs($reservation->owner)->deleteJson("/api/reservations/{$reservation->id}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('reservations', ['id' => $reservation->id]);
    }

    public function test_reservation_belongs_to_owner(){
        $user = User::factory()->create();
        $reservation = Reservation::factory()->create(['owner_user_id' => $user->id]);
        $this->assertEquals($user->id, $reservation->owner->id);
    }

    public function test_reservation_belongs_to_gardener(){
        $user = User::factory()->create();
        $reservation = Reservation::factory()->create(['gardener_user_id' => $user->id]);
        $this->assertEquals($user->id, $reservation->gardener->id);
    }
}
