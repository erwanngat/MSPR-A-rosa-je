<?php

namespace Tests\Unit;

use App\Models\Address;
use App\Models\Comment;
use App\Models\Plante;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Spatie\Permission\Models\Role;

class CommentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_all_comments()
    {
        $comment = Comment::factory()->create();
        $comment2 = Comment::create([
            'comment' => 'Deuxième commentaire',
            'user_id' => $comment->author->id,
            'plante_id' => $comment->plante->id,
        ]);
        $response = $this->actingAs($comment->author)->getJson('/api/comments');
        $response->assertStatus(200)->assertJsonFragment(['comment' => $comment->comment]);
        $response->assertJsonFragment(['comment' => 'Deuxième commentaire']);
    }

    public function test_no_comments_found()
    {
        Comment::truncate();
        $response = $this->actingAs(User::factory()->create())->getJson('/api/comments');
        $response->assertStatus(404)->assertJson(['error' => 'No comments found']);
    }

    public function test_user_can_view_a_single_comment()
    {
        $comment = Comment::factory()->create();
        $response = $this->actingAs($comment->author)->getJson("/api/comments/{$comment->id}");
        $response->assertStatus(200)->assertJsonFragment(['comment' => $comment->comment]);
    }

    public function test_user_cannot_view_non_existent_comment()
    {
        $response = $this->actingAs(User::factory()->create())->getJson('/api/comments/999');
        $response->assertStatus(404)->assertJson(['error' => 'Comment not found']);
    }

    public function test_user_can_create_comment()
    {
        Role::create(['name' => 'botaniste', 'guard_name' => 'web']);
        $plante = Plante::factory()->create();
        $plante->user->AssignRole('botaniste');
        $commentData = [
            'comment' => 'Nouveau commentaire',
            'plante_id' => $plante->id,
        ];
        $response = $this->actingAs( $plante->user)->postJson('/api/comments', $commentData);
        $response->assertStatus(201)->assertJsonFragment(['comment' => 'Nouveau commentaire']);
    }

    public function test_user_can_update_comment()
    {
        $comment = Comment::factory()->create();
        Role::create(['name' => 'botaniste', 'guard_name' => 'web']);
        $comment->author->AssignRole('botaniste');
        $commentData = [
            'comment' => 'Commentaire mis à jour',
            'plante_id' => $comment->plante->id,
        ];
        $response = $this->actingAs($comment->author)->putJson("/api/comments/{$comment->id}", $commentData);
        $response->assertStatus(200)->assertJsonFragment(['comment' => 'Commentaire mis à jour']);
    }

    public function test_user_can_delete_a_comment()
    {
        $comment = Comment::factory()->create();
        $response = $this->actingAs($comment->author)->deleteJson("/api/comments/{$comment->id}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_comment_belongs_to_an_author(){
        $user = User::factory()->create();
        $comment = Comment::factory()->create(['user_id' => $user->id]);
        $this->assertEquals($user->id, $comment->author->id);
    }

    public function test_comment_belongs_to_a_plante(){
        $plante = Plante::factory()->create();
        $comment = Comment::factory()->create(['plante_id' => $plante->id]);
        $this->assertEquals($plante->id, $comment->plante->id);
    }
}
