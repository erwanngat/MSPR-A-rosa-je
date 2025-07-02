<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Messageries extends Model
{
    protected $fillable = ['message', 'user_id_sender', 'user_id_receiver'];

    public function userSender(){
        return $this->belongsTo(User::class, 'user_id_sender');
    }
    public function userReceiver(){
        return $this->belongsTo(User::class, 'user_id_receiver');
    }
}
