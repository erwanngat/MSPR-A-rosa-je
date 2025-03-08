<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['comment', 'user_id', 'plante_id'];
    public function author(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function plante(){
        return $this->belongsTo(Plante::class, 'plante_id');
    }
}
