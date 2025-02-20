<?php

namespace Tests\Unit;

use App\Models\Address;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanteApiTest extends TestCase
{
    use RefreshDatabase;

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
}
