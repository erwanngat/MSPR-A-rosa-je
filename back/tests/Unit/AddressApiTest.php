<?php

namespace Tests\Unit;

use App\Models\Address;
use App\Models\Plante;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddressApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_all_addresses()
    {
        $user = User::factory()->create();

        $address1 = Address::create([
            'country' => 'France',
            'city' => 'Paris',
            'zip_code' => '75000',
            'street' => 'Rue de Paris',
            'additional_address_details' => 'Appartement 12'
        ]);

        $address2 = Address::create([
            'country' => 'France',
            'city' => 'Lyon',
            'zip_code' => '69000',
            'street' => 'Rue de Lyon',
            'additional_address_details' => 'Batiment B'
        ]);

        $response = $this->actingAs($user)->getJson('/api/addresses');
        $response->assertStatus(200);
        $response->assertJsonFragment(['city' => 'Paris']);
        $response->assertJsonFragment(['city' => 'Lyon']);
    }

    public function test_no_addresses_found()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/addresses');
        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'No addresses found'
        ]);
    }

    public function test_user_can_view_a_single_address()
    {
        $user = User::factory()->create();

        $address = Address::create([
            'country' => 'France',
            'city' => 'Marseille',
            'zip_code' => '13000',
            'street' => 'Rue de Marseille',
            'additional_address_details' => 'Résidence du port'
        ]);

        $response = $this->actingAs($user)->getJson("/api/addresses/{$address->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment(['city' => 'Marseille']);
    }

    public function test_user_cannot_view_non_existent_address()
    {
        $user = User::factory()->create();
        Address::truncate();

        $response = $this->actingAs($user)->getJson('/api/addresses/999');
        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'Address not found'
        ]);
    }

    public function test_user_can_create_address()
    {
        $user = User::factory()->create();

        $addressData = [
            'country' => 'France',
            'city' => 'Toulouse',
            'zip_code' => '31000',
            'street' => 'Rue de Toulouse',
            'additional_address_details' => 'Etage 3'
        ];

        $response = $this->actingAs($user)->postJson('/api/addresses', $addressData);
        $response->assertStatus(201);
        $response->assertJsonFragment(['city' => 'Toulouse']);
    }

    public function test_user_can_update_address()
    {
        $user = User::factory()->create();

        $address = Address::create([
            'country' => 'France',
            'city' => 'Nantes',
            'zip_code' => '44000',
            'street' => 'Rue de Nantes',
            'additional_address_details' => 'Maison'
        ]);

        $updatedData = [
            'country' => 'France',
            'city' => 'Bordeaux',
            'zip_code' => '33000',
            'street' => 'Rue de Bordeaux',
            'additional_address_details' => 'Centre-ville'
        ];

        $response = $this->actingAs($user)->putJson("/api/addresses/{$address->id}", $updatedData);
        $response->assertStatus(200);
        $response->assertJsonFragment(['city' => 'Bordeaux']);
    }

    public function test_user_can_delete_address()
    {
        $user = User::factory()->create();

        $address = Address::create([
            'country' => 'France',
            'city' => 'Strasbourg',
            'zip_code' => '67000',
            'street' => 'Rue de Strasbourg',
            'additional_address_details' => 'Quartier historique'
        ]);

        $response = $this->actingAs($user)->deleteJson("/api/addresses/{$address->id}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('addresses', [
            'id' => $address->id,
        ]);
    }

    public function test_user_cannot_destroy_non_existent_address(){
        $user = User::factory()->create();
        $response = $this->actingAs($user)->deleteJson("/api/addresses/999");
        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'Address not found'
        ]);
    }

    public function test_address_has_many_plantes()
    {
        $user = User::factory()->create();
        $address = Address::create([
            'country' => 'France',
            'city' => 'Strasbourg',
            'zip_code' => '67000',
            'street' => 'Rue de Strasbourg',
            'additional_address_details' => 'Quartier historique'
        ]);
        $plante = Plante::create([
            'name' => 'Plante',
            'description' => 'Plante description',
            'user_id' => $user->id,
            'address_id' => $address->id
        ]);

        $this->assertTrue($address->plante->contains($plante));
    }
}
