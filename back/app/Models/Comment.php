<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model
{
    use HasFactory;
    protected $fillable = ['comment', 'user_id', 'plante_id'];
    public function author(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function plante(){
        return $this->belongsTo(Plante::class, 'plante_id');
    }
}
