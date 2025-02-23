<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = ['plante_id', 'owner_user_id', 'gardener_user_id', 'start_date', 'end_date'];
    public function owner(){
        return $this->belongsTo(User::class, 'onwer_user_id');
    }

    public function gardener(){
        return $this->belongsTo(User::class, 'gardener_user_id');
    }
    public function plante(){
        return $this->belongsTo(Plante::class);
    }
}
