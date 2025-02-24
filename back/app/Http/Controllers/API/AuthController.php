<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\EmailVerified;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
        ]);
        $emailDomain = Str::after($request->email, '@');
        $isBotaniste = EmailVerified::where('end_email', $emailDomain);
        $role = $isBotaniste ? 'botaniste' : 'user';
        $user->assignRole($role);
        auth()->login($user);
        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
            'role' => $role,
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        if (auth()->attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = auth()->user();
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
            ]);
        }
        return response()->json(['message' => 'Invalid credentials'], 401);
    }
}
