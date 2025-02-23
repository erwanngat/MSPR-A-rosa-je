<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use function Livewire\store;

class Plante extends Model
{
    protected $fillable = ['name', 'description', 'image', 'user_id', 'address_id'];
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function comments(){
        return $this->hasMany(Comment::class);
    }

    public function address(){
        return $this->belongsTo(Address::class);
    }

    public function reservations(){
        return $this->hasMany(Reservation::class);
    }

    public function getImageUrlAttribute(){
        return $this->image ? env('APP_URL') . Storage::url($this->image) : null;
    }
}
