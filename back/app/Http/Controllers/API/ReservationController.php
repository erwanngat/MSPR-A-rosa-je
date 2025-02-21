<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservations = Reservation::all();

        if(!$reservations){
            return response()->json([['error' => 'No users found'], 404]);
        }

        return response()->json($reservations, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReservationRequest $request)
    {
        $reservation = Reservation::create([
            'owner_user_id' => $request->owner_id,
            'gardener_user_id' => $request->gardener_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date
        ]);

        return response()->json($reservation, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $reservation = Reservation::find($id);

        if(!$reservation){
            return response()->json([['error' => 'Reservation not found'], 404]);
        }

        return response()->json($reservation, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRequest $request, Reservation $reservation)
    {
        $reservation->update([
            'owner_user_id' => $request->owner_id,
            'gardener_user_id' => $request->gardener_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date
        ]);

        return response()->json($reservation, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return response()->json(null, 204);
    }
}
