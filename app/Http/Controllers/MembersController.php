<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use DB;

class MembersController extends Controller
{
    /**
     * Return search result of members
     * @param Request $request
     * @return LengthAwarePaginator
     */
    public function index(Request $request): LengthAwarePaginator
    {
        $firstName =  $request->input('firstname');
        $query = DB::table('members');
        if (!empty($firstName)) {
            $query->where('firstname', 'like', '%'.$firstName.'%');
        }
        $surname = $request->input('surname');
        if (!empty($surname)) {
            $query->where('surname', 'like', '%'.$surname.'%');
        }
        $email = $request->input('email');
        if (!empty($email)) {
            $query->where('email', 'like', '%'.$email.'%');
        }
        return $query->paginate(15);
    }

    /**
     * Return data for member graph
     * @return array
     */
    public function graph(): array
    {
        $years = DB::table('members')->select(
            DB::raw('count(*) ct'),
            DB::raw('YEAR(joined_date) year')
        )->groupby('year')->get();
        $response = [];
        foreach ($years as $year) {
            $response['years'][] = $year->year;
            $response['ctbyyear'][] = $year->ct;
        }
        $months = DB::table('members')->select(
            DB::raw('count(*) ct'),
            DB::raw('YEAR(joined_date) year'), DB::raw('MONTH(joined_date) month')
        )->groupby('year', 'month')->get();
        foreach ($months as $month) {
            $response['ct'][$month->year][] = [
                'count' => $month->ct,
                'month' => date(
                    "F",
                    strtotime($month->year . "-" . $month->month . "-1")
                )
            ];
        }
        return $response;
    
    }
}
