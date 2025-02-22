<?php

namespace Tests\Unit;

use App\Models\Address;
use App\Models\Comment;
use App\Models\Plante;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_all_comments()
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
            'address_id' => $address->id,
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

        $response = $this->actingAs($user)->getJson('/api/comments');
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'comment' => 'Premier commentaire',
        ]);
        $response->assertJsonFragment([
            'comment' => 'Deuxième commentaire',
        ]);
    }

    public function test_no_comments_found()
    {
        $user = User::factory()->create();
        Comment::truncate();

        $response = $this->actingAs($user)->getJson('/api/comments');
        $response->assertStatus(404);
        $response->assertJson([]);
    }

    public function test_user_can_view_a_single_comment()
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
            'address_id' => $address->id,
        ]);
        $comment = Comment::create([
            'comment' => 'Test comment',
            'user_id' => $user->id,
            'plante_id' => $plante->id,
        ]);

        $response = $this->actingAs($user)->getJson("/api/comments/{$comment->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'comment' => 'Test comment',
        ]);
    }

    public function test_user_cannot_view_non_existent_comment()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/comments/999');
        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'Comment not found'
        ]);
    }

    public function test_user_can_create_comment()
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
            'address_id' => $address->id,
        ]);

        $commentData = [
            'comment' => 'Nouveau commentaire',
            'plante_id' => $plante->id,
        ];

        $response = $this->actingAs($user)->postJson('/api/comments', $commentData);
        $response->assertStatus(201);
        $response->assertJsonFragment(['comment' => 'Nouveau commentaire']);
    }

    public function test_user_can_update_comment()
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
            'address_id' => $address->id,
        ]);
        $comment = Comment::create([
            'comment' => 'Ancien commentaire',
            'user_id' => $user->id,
            'plante_id' => $plante->id,
        ]);

        $commentData = [
            'comment' => 'Commentaire mis à jour',
            'plante_id' => $plante->id,
        ];

        $response = $this->actingAs($user)->putJson("/api/comments/{$comment->id}", $commentData);
        $response->assertStatus(200);
        $response->assertJsonFragment(['comment' => 'Commentaire mis à jour']);
    }

    public function test_user_can_delete_a_comment()
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
            'address_id' => $address->id,
        ]);
        $comment = Comment::create([
            'comment' => 'Commentaire à supprimer',
            'user_id' => $user->id,
            'plante_id' => $plante->id,
        ]);

        $response = $this->actingAs($user)->deleteJson("/api/comments/{$comment->id}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('comments', [
            'id' => $comment->id,
        ]);
    }
}
