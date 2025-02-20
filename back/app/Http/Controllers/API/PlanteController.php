<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Plante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PlanteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $plantes = Plante::all();

        if(!$plantes){
            return response()->json([['error' => 'No plants found'], 404]);
        }

        return response()->json($plantes, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:100',
            'address_id' => 'required|integer|exists:addresses,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $plante = Plante::create([
            'name' => $request->name,
            'user_id' => auth()->id(),
            'address_id' => $request->adress_id
        ]);

        return response()->json($plante, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $plante = Plante::find($id);

        if(!$plante){
            return response()->json([['error' => 'Plante not found'], 404]);
        }

        return response()->json($plante);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Plante $plante)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:100',
            'address_id' => 'required|integer|exists:addresses,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $plante->update([
            "name" => $request->name,
            "user_id" => auth()->id(),
            "address_id" => $request->adress_id,
        ]);

        return response()->json($plante, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Plante $plante)
    {
        $plante->delete();
        return response()->json(null, 204);
    }
}
