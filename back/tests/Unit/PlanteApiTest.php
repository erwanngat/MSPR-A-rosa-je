<?php

namespace Tests\Unit;

use App\Models\Address;
use App\Models\Comment;
use App\Models\Plante;
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
            'user_id' => $user->id,
            'address_id' => $address->id
        ]);

        $planteData = [
            'name' => 'PlanteUpdate',
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
}
