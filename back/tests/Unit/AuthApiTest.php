<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register()
    {
        Role::create(['name' => 'botaniste', 'guard_name' => 'web']);
        Role::create(['name' => 'user', 'guard_name' => 'web']);
        $userData = [
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'phone_number' => '0634567890',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/register', $userData);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'user' => ['id', 'name', 'email', 'phone_number'],
            'token',
            'role',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'johndoe@example.com',
        ]);
    }

    public function test_registration_fails_with_invalid_data()
    {
        $userData = [
            'name' => '',
            'email' => 'not-an-email',
            'phone_number' => '',
            'password' => '123',
            'password_confirmation' => '456',
        ];

        $response = $this->postJson('/api/register', $userData);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'email', 'phone_number', 'password']);
    }

    public function test_user_can_login()
    {
        Role::create(['name' => 'botaniste', 'guard_name' => 'web']);
        Role::create(['name' => 'user', 'guard_name' => 'web']);
        $user = User::factory()->create([
            'email' => 'johndoe@example.com',
            'password' => Hash::make('password123'),
        ]);

        $user->assignRole('user');

        $loginData = [
            'email' => 'johndoe@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/login', $loginData);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'user',
            'token',
            'role',
        ]);
    }

    public function test_login_fails_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'johndoe@example.com',
            'password' => Hash::make('password123'),
        ]);

        $loginData = [
            'email' => 'johndoe@example.com',
            'password' => 'wrongpassword',
        ];

        $response = $this->postJson('/api/login', $loginData);

        $response->assertStatus(401);
        $response->assertJson([
            'message' => 'Invalid credentials',
        ]);
    }
}
