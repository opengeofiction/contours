<?php

ini_set('display_errors', 1);
require_once dirname(__FILE__)."/vendor/autoload.php";

$client = new \GuzzleHttp\Client(['verify' => false]);
$tileServer = 'https://tile.opengeofiction.net';
$path = $_SERVER['QUERY_STRING'];
$tileUri = $tileServer . $path;
$res = $client->get($tileUri);
$body = $res->getBody();
header('Content-type: application/octet-stream');
echo $body;




