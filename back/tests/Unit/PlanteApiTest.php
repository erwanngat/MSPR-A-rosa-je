<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanteApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_plante(){
        $user = User::factory()->create();

        $planteData = [
            'name' => 'Plante',
            'address_id' => 1
        ];

        $response = $this->actingAs($user)->postJson('/api/plantes', $planteData);
        $response->assertStatus(201);
        $response->assertJsonFragment(['name' => 'Plante']);
    }
}
