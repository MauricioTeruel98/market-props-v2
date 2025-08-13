<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'address',
        'latitude',
        'longitude',
        'modality',
        'currency',
        'price',
        'amenities',
        'cover_image',
        'user_id',
        'whatsapp',
        'facebook_messenger',
        'contact_email',
        'whatsapp_message',
    ];

    protected $casts = [
        'amenities' => 'array',
        'price' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('order');
    }

    public function getModalityLabelAttribute(): string
    {
        return $this->modality === 'rent' ? 'Alquiler' : 'Venta';
    }

    public function getCurrencyLabelAttribute(): string
    {
        return $this->currency === 'ars' ? 'ARS' : 'USD';
    }

    public function getFormattedPriceAttribute(): string
    {
        return $this->currency === 'ars' 
            ? '$' . number_format($this->price, 0, ',', '.')
            : '$' . number_format($this->price, 2);
    }
}
