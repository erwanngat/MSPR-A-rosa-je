<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $addresses = Address::all();

        if(!$addresses){
            return response()->json([['error' => 'No addresses found'], 404]);
        }

        return response()->json($addresses, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAddressRequest $request)
    {
        $address = Address::create([
            'country' => $request->country,
            'city' => $request->city,
            'zip_code' => $request->zip_code,
            'street' => $request->street,
            'additional_address_details' => $request->additional_address_details
        ]);

        return response()->json($address, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $address = Address::find($id);

        if(!$address){
            return response()->json([['error' => 'Address not found'], 404]);
        }

        return response()->json($address);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAddressRequest $request, Address $address)
    {
        $address->update([
            'country' => $request->country,
            'city' => $request->city,
            'zip_code' => $request->zip_code,
            'street' => $request->street,
            'additional_address_details' => $request->additional_address_details
        ]);

        return response()->json($address, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Address $address)
    {
        $address->delete();
        return response()->json(null, 204);
    }
}
