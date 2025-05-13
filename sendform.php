<?php
if(isset($_POST['email'])) {

    // EDIT THE 2 LINES BELOW AS REQUIRED
    $email_to = "thierry.faraci13600@gmail.com";
    $email_subject = "Formulaire de contact";

    function died($error) {
        // your error code can go here
        echo "Désolé, il y a eu une erreur dans le formulaire.";
        echo "Les erreurs suivantes ont été rencontrées :<br /><br />";
        echo $error."<br /><br />";
        echo "Veuillez retourner en arrière et corriger ces erreurs.<br /><br />";
        die();
    }

    // validation expected data exists
    if(!isset($_POST['name']) ||
        !isset($_POST['email']) ||
        !isset($_POST['message'])) {
        died('Désolé, il y a eu une erreur dans le formulaire.');       
    }

    $name = $_POST['name']; // required
    $email = $_POST['email']; // required
    $message = $_POST['message']; // required

    $error_message = "";
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';

  if(!preg_match($email_exp,$email)) {
    $error_message .= 'L\'adresse email entrée ne semble pas valide.<br />';
  }

    $string_exp = "/^[A-Za-z .'-]+$/";

  if(!preg_match($string_exp,$name