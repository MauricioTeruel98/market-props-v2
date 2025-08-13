<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('whatsapp')->nullable();
            $table->string('facebook_messenger')->nullable();
            $table->string('contact_email')->nullable();
            $table->text('whatsapp_message')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn('whatsapp');
            $table->dropColumn('facebook_messenger');
            $table->dropColumn('contact_email');
            $table->dropColumn('whatsapp_message');
        });
    }
};
