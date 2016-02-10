<?php
/**
 * Created by PhpStorm.
 * User: cocan
 * Date: 10/02/2016
 * Time: 14:08
 */

if(!empty($_POST['data']))
{
    $data = $_POST['data'];
    $fname = "newDatabase.xml";

    $file = fopen($fname, "w");
    fwrite($file, $data);
    fclose($file);
}
else
{
    $data = "test";
    $fname = "newDatabase.xml";

    $file = fopen($fname, "w");
    fwrite($file, $data);
    fclose($file);
}