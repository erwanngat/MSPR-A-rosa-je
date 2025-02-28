<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comments = Comment::all();
        if($comments->isEmpty()){
            return response()->json(['error' => 'No comments found'], 404);
        }
        return response()->json($comments, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommentRequest $request)
    {
        $comment = Comment::create([
            'comment' => $request->comment,
            'user_id' => auth()->id(),
            'plante_id' => $request->plante_id
        ]);

        return response()->json($comment, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $comment = Comment::find($id);

        if(!$comment){
            return response()->json(['error' => 'Comment not found'], 404);
        }

        return response()->json($comment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommentRequest $request, Comment $comment)
    {
        $comment->update([
            'comment' => $request->comment,
            'user_id' => auth()->id(),
            'plante_id' => $request->plante_id
        ]);

        return response()->json($comment, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        Comment::destroy($id);
        return response()->json(null, 204);
    }
}
