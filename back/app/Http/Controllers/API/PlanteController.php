<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePlanteRequest;
use App\Http\Requests\UpdatePlanteRequest;
use App\Models\Plante;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PlanteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $plantes = Plante::all();

        if($plantes->isEmpty()){
            return response()->json(['error' => 'No plants found'], 404);
        }

        return response()->json($plantes, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePlanteRequest $request)
    {
        $path = null;
        if($request->hasFile('image')){
            $path = $request->file('image')->store('plantes', 'public');
            $path = asset('storage/' . $path);
        }
        $plante = Plante::create([
            'name' => $request->name,
            'image' => $path,
            'user_id' => auth()->id(),
            'address_id' => $request->address_id
        ]);

        if($request->description){
            $plante->description = $request->description;
        }

        return response()->json($plante, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $plante = Plante::find($id);

        if(!$plante){
            return response()->json(['error' => 'Plante not found'], 404);
        }

        return response()->json($plante, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePlanteRequest $request, Plante $plante)
    {
        $path = null;
        if($request->hasFile('image')){
            if($plante->image) {
                Storage::disk('public')->delete($plante->image);
            }
            $path = $request->file('image')->store('plantes', 'public');
            $plante->image = $path;
        }
        $plante->update([
            'name' => $request->name,
            'user_id' => auth()->id(),
            'address_id' => $request->address_id,
        ]);

        if($request->description){
            $plante->description = $request->description;
        }

        return response()->json($plante, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        Plante::destroy($id);
        return response()->json(null, 204);
    }

    public function getPlanteComments(int $id){
        $plante = Plante::find($id);

        if (!$plante) {
            return response()->json(['error' => 'Plante not found'], 404);
        }

        return response()->json($plante->comments, 200);
    }

    public function getPlanteReservation(int $id){
        $plante = Plante::find($id);
        if (!$plante) {
            return response()->json(['error' => 'Plante not found'], 404);
        }

        return response()->json($plante->reservations, 200);
    }

    public function getAllPlantesWithoutGardener(){
        $reservations = Reservation::all();

        $plantes = [];
        foreach ($reservations as $reservation) {
            if ($reservation->gardener_user_id == null) {
                $plantes[] = $reservation->plante;
            }
        }

        if (!$plantes) {
            return response()->json(['error' => 'Reservation not found with empty gardener'], 404);
        }

        return response()->json($plantes, 200);
    }
}
