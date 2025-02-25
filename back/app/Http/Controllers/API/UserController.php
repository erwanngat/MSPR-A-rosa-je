<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();

        if(!$users){
            return response()->json([['error' => 'No users found'], 404]);
        }

        return response()->json($users, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => bcrypt($request->password)
        ]);

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $user = User::find($id);

        if(!$user){
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => bcrypt($request->password)
        ]);

        return response()->json($user, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        User::destroy($id);
        return response()->json(null, 204);
    }

    public function getUserPlantes(int $id){
        $user = User::find($id);
        if(!$user){
            return response()->json(['error' => 'User not found'], 404);
        }
        return response()->json($user->plantes, 200);
    }

    public function getUserAdresses(int $id){
        $user = User::find($id);
        if(!$user){
            return response()->json(['error' => 'User not found'], 404);
        }

        $plantes = $user->plantes;

        if(!$plantes){
            return response()->json(['error' => 'Plantes not found'], 404);
        }

        $addresses = [];
        foreach($plantes as $plante){
            if($plante->address){
                $addresses[$plante->address->id] = $plante->address;
            }
        }

        if(!$addresses){
            return response()->json(['error' => 'Adresses not found'], 404);
        }

        return response()->json($addresses, 200);
    }
}
