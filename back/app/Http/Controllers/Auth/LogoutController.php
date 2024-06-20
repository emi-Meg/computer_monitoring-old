<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LogoutController extends Controller
{
    public function logout()
    {

        $user = auth()->user();
        $token = $user->tokens();

        $token->delete();

        return response()->json([
            'status'            =>          true,
            'message'           =>          "Logout successfully",
            'data'              =>          $user,
            'id'                =>          $user->id
        ], 200);
    }
}
