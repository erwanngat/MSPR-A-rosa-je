<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = ['country', 'city', 'zip_code', 'street', 'additional_address_details'];
    public function user(){
        return $this->belongsTo(Plante::class);
    }
}
