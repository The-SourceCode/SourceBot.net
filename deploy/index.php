<?php
include 'secret.php';

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

if ($secret != $receivedSecret){
  unauthenticatedUser();
  return;
}

success();

function unauthenticatedUser(){
  header('HTTP/1.0 403 Forbidden');
}

function success(){
  $commands = array('git -C .. pull');
  foreach($commands as $command){
    shell_exec("$command 2>&1");
  }
}

