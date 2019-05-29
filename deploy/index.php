<?php
include 'secret.php';

$body = file_get_contents('php://input');
$hashedSecret = "sha1=" . hash_hmac("sha1", $body, $secret, $raw_output=false);

$query = "GitHub-Hookshot/";
$userAgent = $_SERVER['HTTP_USER_AGENT'];

if (!substr($userAgent, 0, strlen($query)) === $query){
  unauthenticatedUser();
  return;
}

$receivedSecret = $_SERVER['HTTP_X_HUB_SIGNATURE'];

if (!isset($receivedSecret)){
  unauthenticatedUser();
  return;
}

if ($hashedSecret != $receivedSecret){
  unauthenticatedUser();
  return;
}

success();

function unauthenticatedUser(){
  header('HTTP/1.0 403 Forbidden');
}

function success(){
  $commands = array('git -C .. pull', 'git -C .. checkout production', 'systemctl sourcebot-leaderboard restart');
  foreach($commands as $command){
    shell_exec("$command 2>&1");
  }
}

