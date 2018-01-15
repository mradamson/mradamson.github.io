<?php

$username = 'test2';
$password = 'c8gmrkkhwf7k';


if (!function_exists('curl_init')){
    die('Sorry cURL is not installed!');
}
// OK cool - then let's create a new cURL resource handle
$ch = curl_init();

// Now set some options (most are optional)

$Url = $_GET['url'];

// Set URL to download
curl_setopt($ch, CURLOPT_URL, $Url);

//Set a referer
curl_setopt($ch, CURLOPT_REFERER, "http://www.example.org/yay.htm");

//User agent
curl_setopt($ch, CURLOPT_USERAGENT, "MozillaXYZ/1.0");

//Include header in result? (0 = yes, 1 = no)
curl_setopt($ch, CURLOPT_HEADER, 0);

// Should cURL return or print out the data? (true = return, false = print)
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);

// Timeout in seconds
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// Download the given URL, and return output
$output = curl_exec($ch);

// Close the cURL resource, and free system resources
curl_close($ch);

header('Content-Type: application/json');
//echo json_encode($output);
echo $output;



?>
