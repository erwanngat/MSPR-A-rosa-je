<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservation extends Model
{
    use HasFactory;
    protected $fillable = ['plante_id', 'owner_user_id', 'gardener_user_id', 'start_date', 'end_date'];
    public function owner(){
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    public function gardener(){
        return $this->belongsTo(User::class, 'gardener_user_id');
    }
    public function plante(){
        return $this->belongsTo(Plante::class);
    }
}
