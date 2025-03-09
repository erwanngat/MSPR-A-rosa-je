<?php

namespace Tests\Unit;

use App\Models\Address;
use App\Models\Comment;
use App\Models\Plante;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_list_all_users()
    {
        User::factory()->count(3)->create();
        $response = $this->actingAs(User::factory()->create())->getJson('/api/users');
        $response->assertStatus(200)->assertJsonCount(4);
    }
    public function test_it_can_create_a_user()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'phone_number' => '0634567890',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];
        $response = $this->actingAs(User::factory()->create())->postJson('/api/users', $userData);
        $response->assertStatus(201)->assertJsonStructure(['id', 'name', 'email', 'phone_number']);
        $this->assertDatabaseHas('users', ['email' => 'johndoe@example.com']);
    }
    public function test_it_can_show_a_user()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->getJson("/api/users/{$user->id}");
        $response->assertStatus(200)->assertJson(['id' => $user->id]);
    }
    public function test_it_returns_404_if_user_not_found()
    {
        $response = $this->actingAs(User::factory()->create())->getJson('/api/users/9999');
        $response->assertStatus(404);
    }
    public function test_it_can_update_a_user()
    {
        $user = User::factory()->create();
        $updatedData = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone_number' => '9876543210',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ];
        $response = $this->actingAs($user)->putJson("/api/users/{$user->id}", $updatedData);
        $response->assertStatus(200)->assertJson(['name' => 'Updated Name']);
        $this->assertDatabaseHas('users', ['email' => 'updated@example.com']);
    }
    public function test_it_can_delete_a_user()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->deleteJson("/api/users/{$user->id}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_can_get_user_plante(){
        $plante = Plante::factory()->create();
        $response = $this->actingAs($plante->user)->getJson("/api/users/{$plante->user->id}/plantes");
        $response->assertStatus(200)->assertJsonFragment(['name' => $plante->name]);
    }

    public function test_cannot_get_plante_from_non_existent_user(){
        $response = $this->actingAs(User::factory()->create())->getJson("/api/users/9999/plantes");
        $response->assertStatus(404)->assertJsonFragment(['error' => 'User not found']);
    }

    public function test_cannot_get_non_exisstent_plante_from_user(){
        $user = User::factory()->create();
        $response = $this->actingAs($user)->getJson("/api/users/$user->id/plantes");
        $response->assertStatus(404)->assertJsonFragment(['error' => 'No plantes found for this user']);
    }

    public function test_can_get_user_addresses(){
        $plante = Plante::factory()->create();
        $response = $this->actingAs($plante->user)->getJson("/api/users/{$plante->user->id}/addresses");
        $response->assertStatus(200)->assertJsonFragment(['country' => $plante->address->country]);
    }

    public function test_cannot_get_user_addresses_from_non_existent_user(){
        $response = $this->actingAs(User::factory()->create())->getJson("/api/users/9999/addresses");
        $response->assertStatus(404)->assertJsonFragment(['error' => 'User not found']);
    }

    public function test_cannot_get_user_addresses_if_no_plantes_found(){
        $user = User::factory()->create();
        $response = $this->actingAs($user)->getJson("/api/users/$user->id/addresses");
        $response->assertStatus(404)->assertJsonFragment(['error' => 'No plantes found for this user']);
    }

    public function test_user_has_many_comments(){
        $user = User::factory()->create();
        $comment = Comment::factory()->create(['user_id' => $user->id]);
        $this->assertTrue($user->comments->contains($comment));
    }

    public function test_user_has_many_owner_reservation(){
        $user = User::factory()->create();
        $reservation = Reservation::factory()->create(['owner_user_id' => $user->id]);
        $this->assertTrue($user->ownerReservations->contains($reservation));
    }

    public function test_user_has_many_gardener_reservation(){
        $user = User::factory()->create();
        $reservation = Reservation::factory()->create(['gardener_user_id' => $user->id]);
        $this->assertTrue($user->gardenerReservations->contains($reservation));
    }
}
