<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Messageries extends Model
{
    protected $fillable = ['message', 'user_id_sender', 'user_id_receiver'];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
