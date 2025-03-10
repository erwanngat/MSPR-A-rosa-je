<?php

namespace Tests\Unit;

use App\Models\Address;
use App\Models\Comment;
use App\Models\Plante;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanteApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_all_plants()
    {
        $user = User::factory()->create();
        $address = Address::create([
            'country' => 'France',
            'city' => 'Lyon',
            'zip_code' => '69000',
            'street' => 'rue 1',
            'additional_address_details' => 'Bat E'
        ]);
        $plante = Plante::create([
            'name' => 'Plante',
            'description' => 'Plante description',
            'user_id' => $user->id,
            'address_id' => $address->id
        ]);
        $response = $this->actingAs($user)->getJson('/api/plantes');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'name',
                'user_id',
                'address_id',
                'created_at',
                'updated_at',
            ]
        ]);
    }
    public function test_no_plants_found()
    {
        $user = User::factory()->create();
        Plante::truncate();

        $response = $this->actingAs($user)->getJson('/api/plantes');
        $response->assertStatus(404);
        $response->assertJson(['error' => 'No plants found']);
    }
    public function test_user_can_view_a_single_plante()
    {
        $user = User::factory()->create();
        $address = Address::create([
            'country' => 'France',
            'city' => 'Lyon',
            'zip_code' => '69000',
            'street' => 'rue 1',
            'additional_address_details' => 'Bat E'
        ]);
        $plante = Plante::create([
            'name' => 'Plante Test',
            'description' => 'Plante description',
            'user_id' => $user->id,
            'address_id' => $address->id
        ]);

        $response = $this->actingAs($user)->getJson("/api/plantes/{$plante->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'name' => 'Plante Test',
            'user_id' => $user->id,
            'address_id' => $address->id,
        ]);
    }
    public function test_user_cannot_view_non_existent_plante()
    {
        $user = User::factory()->create();

        $nonExistentPlanteId = 999;

        $response = $this->actingAs($user)->getJson("/api/plantes/{$nonExistentPlanteId}");
        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'Plante not found'
        ]);
    }
    public function test_user_can_create_plante(){
        $address = Address::create([
            'country' => 'France',
            'city' => 'Lyon',
            'zip_code' => '69000',
            'street' => 'rue 1',
            'additional_address_details' => 'Bat E'
        ]);
        $user = User::factory()->create();

        $planteData = [
            'name' => 'Plante',
            'description' => 'Plante description',
            'address_id' => $address->id
        ];

        $response = $this->actingAs($user)->postJson('/api/plantes', $planteData);
        $response->assertStatus(201);
        $response->assertJsonFragment(['name' => 'Plante']);
    }
    public function test_user_can_update_plante(){
        $address = Address::create([
            'country' => 'France',
            'city' => 'Lyon',
            'zip_code' => '69000',
            'street' => 'rue 1',
            'additional_address_details' => 'Bat E'
        ]);
        $user = User::factory()->create();

        $plante = Plante::create([
            'name' => 'Plante',
            'description' => 'Plante description',
            'user_id' => $user->id,
            'address_id' => $address->id
        ]);

        $planteData = [
            'name' => 'PlanteUpdate',
            'description' => 'Plante description',
            'address_id' => $address->id
        ];

        $response = $this->actingAs($user)->putJson("/api/plantes/{$plante->id}", $planteData);
        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'PlanteUpdate']);
    }
    public function test_user_can_delete_a_plante()
    {
        $user = User::factory()->create();
        $address = Address::create([
            'country' => 'France',
            'city' => 'Lyon',
            'zip_code' => '69000',
            'street' => 'rue 1',
            'additional_address_details' => 'Bat E'
        ]);
        $plante = Plante::create([
            'name' => 'Plante Test',
            'description' => 'Plante description',
            'user_id' => $user->id,
            'address_id' => $address->id
        ]);

        $response = $this->actingAs($user)->deleteJson("/api/plantes/{$plante->id}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('plantes', [
            'id' => $plante->id,
        ]);
    }
    public function test_user_can_get_all_comments_of_a_plante()
    {
        $user = User::factory()->create();
        $address = Address::create([
            'country' => 'France',
            'city' => 'Lyon',
            'zip_code' => '69000',
            'street' => 'rue 1',
            'additional_address_details' => 'Bat E'
        ]);
        $plante = Plante::create([
            'name' => 'Plante Test',
            'description' => 'Plante description',
            'user_id' => $user->id,
            'address_id' => $address->id
        ]);
        $comment1 = Comment::create([
            'comment' => 'Premier commentaire',
            'user_id' => $user->id,
            'plante_id' => $plante->id,
        ]);
        $comment2 = Comment::create([
            'comment' => 'Deuxième commentaire',
            'user_id' => $user->id,
            'plante_id' => $plante->id,
        ]);
        $response = $this->actingAs($user)->getJson("/api/plantes/{$plante->id}/comments");
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'comment' => 'Premier commentaire',
        ]);
        $response->assertJsonFragment([
            'comment' => 'Deuxième commentaire',
        ]);
    }
    public function test_user_cannot_get_comments_from_non_existent_plante(){
        $user = User::factory()->create();
        $response = $this->actingAs($user)->getJson("/api/plantes/9999/comments");
        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'Plante not found'
        ]);
    }
    public function test_user_cannot_see_non_existent_comments_of_a_plante(){
        $user = User::factory()->create();
        $address = Address::create([
            'country' => 'France',
            'city' => 'Lyon',
            'zip_code' => '69000',
            'street' => 'rue 1',
            'additional_address_details' => 'Bat E'
        ]);
        $plante = Plante::create([
            'name' => 'Plante Test',
            'description' => 'Plante description',
            'user_id' => $user->id,
            'address_id' => $address->id
        ]);
        $response = $this->actingAs($user)->getJson("/api/plantes/{$plante->id}/comments");
        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'No comments found for this plante'
        ]);
    }
    public function test_user_can_get_all_reservations_of_a_plante()
    {
        $user = User::factory()->create();
        $gardener = User::factory()->create();
        $address = Address::create([
            'country' => 'France',
            'city' => 'Lyon',
            'zip_code' => '69000',
            'street' => 'rue 1',
            'additional_address_details' => 'Bat E'
        ]);
        $plante = Plante::create([
            'name' => 'Plante Test',
            'description' => 'Plante description',
            'user_id' => $user->id,
            'address_id' => $address->id
        ]);
        $reservation = Reservation::create([
            'plante_id' => $plante->id,
            'owner_user_id' => $user->id,
            'gardener_user_id' => $gardener->id,
            'start_date' => '2025-04-01',
            'end_date' => '2025-04-10'
        ]);
        $reservation = Reservation::create([
            'plante_id' => $plante->id,
            'owner_user_id' => $user->id,
            'gardener_user_id' => $gardener->id,
            'start_date' => '2025-09-01',
            'end_date' => '2025-09-10'
        ]);
        $response = $this->actingAs($user)->getJson("/api/plantes/{$plante->id}/reservations");
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'start_date' => '2025-04-01',
        ]);
        $response->assertJsonFragment([
            'start_date' => '2025-09-01',
        ]);
    }
    public function test_user_cannot_get_reservations_from_non_existent_plante(){
        $user = User::factory()->create();
        $response = $this->actingAs($user)->getJson("/api/plantes/9999/reservations");
        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'Plante not found'
        ]);
    }
    public function test_user_cannot_see_non_existent_reservations_of_a_plante(){
        $user = User::factory()->create();
        $address = Address::create([
            'country' => 'France',
            'city' => 'Lyon',
            'zip_code' => '69000',
            'street' => 'rue 1',
            'additional_address_details' => 'Bat E'
        ]);
        $plante = Plante::create([
            'name' => 'Plante Test',
            'description' => 'Plante description',
            'user_id' => $user->id,
            'address_id' => $address->id,
        ]);
        $response = $this->actingAs($user)->getJson("/api/plantes/{$plante->id}/reservations");
        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'No reservations found for this plante'
        ]);
    }
    public function test_user_can_get_all_plantes_without_gardener(){
        $user = User::factory()->create();
        $address = Address::create([
            'country' => 'France',
            'city' => 'Lyon',
            'zip_code' => '69000',
            'street' => 'rue 1',
            'additional_address_details' => 'Bat E'
        ]);
        $plante = Plante::create([
            'name' => 'Plante Test',
            'description' => 'Plante description',
            'user_id' => $user->id,
            'address_id' => $address->id
        ]);
        $reservation = Reservation::create([
            'plante_id' => $plante->id,
            'owner_user_id' => $user->id,
            'start_date' => '2025-09-01',
            'end_date' => '2025-09-10'
        ]);
        $response = $this->actingAs($user)->getJson("/api/withoutgardener/plantes/reservations");
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'name' => 'Plante Test',
        ]);
    }

    public function test_user_cannot_get_plante_with_gardener(){
        $user = User::factory()->create();
        $address = Address::create([
            'country' => 'France',
            'city' => 'Lyon',
            'zip_code' => '69000',
            'street' => 'rue 1',
            'additional_address_details' => 'Bat E'
        ]);
        $plante = Plante::create([
            'name' => 'Plante Test',
            'description' => 'Plante description',
            'user_id' => $user->id,
            'address_id' => $address->id,
        ]);
        $response = $this->actingAs($user)->getJson("/api/withoutgardener/plantes/reservations");
        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'Reservation with empty gardener not found'
        ]);
    }

    public function test_plante_belongs_to_an_user(){
        $user = User::factory()->create();
        $address = Address::create([
            'country' => 'France',
            'city' => 'Lyon',
            'zip_code' => '69000',
            'street' => 'rue 1',
            'additional_address_details' => 'Bat E'
        ]);
        $plante = Plante::create([
            'name' => 'Plante Test',
            'description' => 'Plante description',
            'user_id' => $user->id,
            'address_id' => $address->id,
        ]);
        $this->assertEquals($user->id, $plante->user->id);
    }
}
