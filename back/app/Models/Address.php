<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Address extends Model
{
    use HasFactory;
    protected $fillable = ['country', 'city', 'zip_code', 'street', 'additional_address_details'];
    public $casts = [
        'country' => 'encrypted',
        'city' => 'encrypted',
        'zip_code' => 'encrypted',
        'street' => 'encrypted',
        'additional_address_details' => 'encrypted'
    ];
    public function plante(){
        return $this->hasMany(Plante::class);
    }
}
