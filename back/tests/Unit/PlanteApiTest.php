<?php

namespace Tests\Unit;

use App\Models\Address;
use App\Models\Comment;
use App\Models\Plante;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class PlanteApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_all_plants()
    {
        $plante = Plante::factory()->create();
        $plante2 = Plante::factory()->create();
        $response = $this->actingAs($plante->user)->getJson('/api/plantes');
        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => $plante->name]);
        $response->assertJsonFragment(['name' => $plante2->name]);
    }
    public function test_no_plants_found()
    {
        $response = $this->actingAs(User::factory()->create())->getJson('/api/plantes');
        $response->assertStatus(404);
        $response->assertJson(['error' => 'No plants found']);
    }
    public function test_user_can_view_a_single_plante()
    {
        $plante = Plante::factory()->create();
        $response = $this->actingAs($plante->user)->getJson("/api/plantes/{$plante->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'name' => $plante->name,
            'user_id' => $plante->user->id,
            'address_id' => $plante->address->id,
        ]);
    }
    public function test_user_cannot_view_non_existent_plante()
    {
        $response = $this->actingAs(User::factory()->create())->getJson("/api/plantes/999");
        $response->assertStatus(404);
        $response->assertJson(['error' => 'Plante not found']);
    }
    public function test_user_can_create_plante(){
        $user = User::factory()->create();
        $address = Address::factory()->create();
        $planteData = [
            'name' => 'Plante',
            'description' => 'Plante description',
            'image' => UploadedFile::fake()->image('plante.jpg'),
            'address_id' => $address->id
        ];

        $response = $this->actingAs($user)->postJson('/api/plantes', $planteData);
        $response->assertStatus(201);
        $response->assertJsonFragment(['name' => 'Plante']);
    }
    public function test_user_can_update_plante(){
        $plante = Plante::factory()->create();
        $planteData = [
            'name' => 'PlanteUpdate',
            'description' => 'Plante description',
            'image' => UploadedFile::fake()->image('plante.jpg'),
            'address_id' => $plante->address->id
        ];
        $response = $this->actingAs($plante->user)->putJson("/api/plantes/{$plante->id}", $planteData);
        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'PlanteUpdate']);
    }
    public function test_user_can_delete_a_plante()
    {
        $plante = Plante::factory()->create();
        $response = $this->actingAs($plante->user)->deleteJson("/api/plantes/{$plante->id}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('plantes', [
            'id' => $plante->id,
        ]);
    }
    public function test_user_can_get_all_comments_of_a_plante()
    {
        $comment = Comment::factory()->create();
        $comment2 = Comment::create([
            'comment' => 'Second comment',
            'user_id' => $comment->author->id,
            'plante_id' => $comment->plante->id,
        ]);
        $response = $this->actingAs($comment->author)->getJson("/api/plantes/{$comment->plante->id}/comments");
        $response->assertStatus(200);
        $response->assertJsonFragment(['comment' => $comment->comment]);
        $response->assertJsonFragment(['comment' => $comment2->comment]);
    }
    public function test_user_cannot_get_comments_from_non_existent_plante(){
        $user = User::factory()->create();
        $response = $this->actingAs($user)->getJson("/api/plantes/9999/comments");
        $response->assertStatus(404);
        $response->assertJson(['error' => 'Plante not found']);
    }
    public function test_user_cannot_see_non_existent_comments_of_a_plante(){
        $plante = Plante::factory()->create();
        $response = $this->actingAs($plante->user)->getJson("/api/plantes/{$plante->id}/comments");
        $response->assertStatus(404);
        $response->assertJson(['error' => 'No comments found for this plante']);
    }
    public function test_user_can_get_all_reservations_of_a_plante()
    {
        $reservation = Reservation::factory()->create();
        $reservation = Reservation::create([
            'plante_id' => $reservation->plante->id,
            'owner_user_id' => $reservation->owner->id,
            'gardener_user_id' => $reservation->gardener->id,
            'start_date' => '2025-09-01',
            'end_date' => '2025-09-10'
        ]);
        $response = $this->actingAs($reservation->gardener)->getJson("/api/plantes/{$reservation->plante->id}/reservations");
        $response->assertStatus(200);
        $response->assertJsonFragment(['start_date' => $reservation->start_date]);
        $response->assertJsonFragment(['start_date' => '2025-09-01']);
    }
    public function test_user_cannot_get_reservations_from_non_existent_plante(){
        $response = $this->actingAs(User::factory()->create())->getJson("/api/plantes/9999/reservations");
        $response->assertStatus(404);
        $response->assertJson(['error' => 'Plante not found']);
    }
    public function test_user_cannot_see_non_existent_reservations_of_a_plante(){
        $plante = Plante::factory()->create();
        $response = $this->actingAs($plante->user)->getJson("/api/plantes/{$plante->id}/reservations");
        $response->assertStatus(404)->assertJson(['error' => 'No reservations found for this plante']);
    }
    public function test_user_can_get_all_plantes_without_gardener(){
        $plante = Plante::factory()->create();
        $reservation = Reservation::create([
            'plante_id' => $plante->id,
            'owner_user_id' => $plante->user->id,
            'start_date' => '2025-09-01',
            'end_date' => '2025-09-10'
        ]);
        $response = $this->actingAs($plante->user)->getJson("/api/withoutgardener/plantes/reservations");
        $response->assertStatus(200)->assertJsonFragment(['name' => $plante->name]);
    }

    public function test_user_cannot_get_plante_with_gardener(){
        $plante = Plante::factory()->create();
        $response = $this->actingAs($plante->user)->getJson("/api/withoutgardener/plantes/reservations");
        $response->assertStatus(404)->assertJson(['error' => 'Reservation with empty gardener not found']);
    }

    public function test_plante_belongs_to_an_user(){
        $plante = Plante::factory()->create();
        $this->assertEquals($plante->user->id, $plante->user->id);
    }
}
