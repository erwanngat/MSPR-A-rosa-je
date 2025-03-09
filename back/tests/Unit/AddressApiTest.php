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
        $address1 = Address::factory()->create();
        $address2 = Address::factory()->create();
        $response = $this->actingAs(User::factory()->create())->getJson('/api/addresses');
        $response->assertStatus(200)->assertJsonFragment(['city' => $address1->city])->assertJsonFragment(['city' => $address2->city]);
    }

    public function test_no_addresses_found()
    {
        $response = $this->actingAs(User::factory()->create())->getJson('/api/addresses');
        $response->assertStatus(404)->assertJson(['error' => 'No addresses found']);
    }

    public function test_user_can_view_a_single_address()
    {
        $address = Address::factory()->create();
        $response = $this->actingAs(User::factory()->create())->getJson("/api/addresses/{$address->id}");
        $response->assertStatus(200)->assertJsonFragment(['city' => $address->city]);
    }

    public function test_user_cannot_view_non_existent_address()
    {
        Address::truncate();
        $response = $this->actingAs(User::factory()->create())->getJson('/api/addresses/999');
        $response->assertStatus(404)->assertJson(['error' => 'Address not found']);
    }

    public function test_user_can_create_address()
    {
        $addressData = [
            'country' => 'France',
            'city' => 'Toulouse',
            'zip_code' => '31000',
            'street' => 'Rue de Toulouse',
            'additional_address_details' => 'Etage 3'
        ];
        $response = $this->actingAs(User::factory()->create())->postJson('/api/addresses', $addressData);
        $response->assertStatus(201)->assertJsonFragment(['city' => 'Toulouse']);
    }

    public function test_user_can_update_address()
    {
        $address = Address::factory()->create();
        $updatedData = [
            'country' => 'France',
            'city' => 'Bordeaux',
            'zip_code' => '33000',
            'street' => 'Rue de Bordeaux',
            'additional_address_details' => 'Centre-ville'
        ];
        $response = $this->actingAs(User::factory()->create())->putJson("/api/addresses/{$address->id}", $updatedData);
        $response->assertStatus(200)->assertJsonFragment(['city' => 'Bordeaux']);
    }

    public function test_user_can_delete_address()
    {
        $address = Address::factory()->create();
        $response = $this->actingAs(User::factory()->create())->deleteJson("/api/addresses/{$address->id}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('addresses', ['id' => $address->id]);
    }

    public function test_user_cannot_destroy_non_existent_address(){
        $response = $this->actingAs(User::factory()->create())->deleteJson("/api/addresses/999");
        $response->assertStatus(404)->assertJson(['error' => 'Address not found']);
    }

    public function test_address_has_many_plantes()
    {
        $address = Address::factory()->create();
        $plante = Plante::factory()->create(['address_id' => $address->id]);
        $this->assertTrue($address->plante->contains($plante));
    }
}
