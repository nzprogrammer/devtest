<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MemberTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testExample()
    {
        $this->assertTrue(true);
    }
    /**
     * A basic test.
     *
     * @return void
     */
    public function testBasic()
    {
        $response = $this->get('/');
        $response->assertSee('Members');
    }

    /**
     * Test members API json
     * @return void
     */
    public function testApi()
    {
        $this->json('GET', '/api/members')
            -> assertJson([
               'current_page' => 1
            ]);
    }


}
