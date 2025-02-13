<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    public function owner(){
        return $this->belongsTo(User::class, 'onwer_user_id');
    }

    public function gardener(){
        return $this->belongsTo(User::class, 'gardener_user_id');
    }
}
