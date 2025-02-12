<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Plante;
use Illuminate\Http\Request;

class PlanteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $plantes = Plante::all();

        return response()->json($plantes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|max:100',
        ]);

        $plante = Plante::create([
            'name' => $request->name,
            'user_id' => $request->userId
        ]);

        return response()->json($plante, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Plante $plante)
    {
        return response()->json($plante);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Plante $plante)
    {
        $this->validate($request, [
            'name' => 'required|max:100',
        ]);

        $plante->update([
            "name" => $request->name,
        ]);

        return response()->json();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Plante $plante)
    {
        $plante->delete();

        return response()->json();
    }
}
