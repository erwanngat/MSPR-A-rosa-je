<?php

use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\API\ReservationController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PlanteController;
use App\Http\Controllers\API\AddressController;


Route::withoutMiddleware([VerifyCsrfToken::class])->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::apiResource('plantes', PlanteController::class);
    Route::apiResource('comments', CommentController::class);
    Route::apiResource('reservations', ReservationController::class);
    Route::apiResource('addresses', AddressController::class);
    Route::get('plantes/{id}/comments', [PlanteController::class, 'getPlanteComments']);
    Route::get('plantes/{id}/reservations', [PlanteController::class, 'getPlanteReservation']);
});
