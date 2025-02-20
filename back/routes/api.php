<?php

use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\API\ReservationController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PlanteController;


Route::withoutMiddleware([VerifyCsrfToken::class])
->group(function () {
    Route::apiResource('users', UserController::class);
    Route::apiResource('plantes', PlanteController::class);
    Route::apiResource('comments', CommentController::class);
    Route::apiResource('reservations', ReservationController::class);

    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
