<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePlanteRequest;
use App\Http\Requests\UpdatePlanteRequest;
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
    public function store(StorePlanteRequest $request)
    {
        $plante = Plante::create([
            'name' => $request->name,
            'user_id' => auth()->id(),
            'address_id' => $request->address_id
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
    public function update(UpdatePlanteRequest $request, Plante $plante)
    {
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
