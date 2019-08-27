<?php 
session_start();
include_once 'connect.php';


$nome = $_POST['nome'];
$senha = $_POST['senha'];
$email = $_POST['email'];

$add = $conexao->prepare("INSERT INTO users (name, email, password) VALUES (:nome, :email, :senha)");
$add->bindValue(":nome", $nome);
$add->bindValue(":email", $email);
$add->bindValue(":senha", $senha);
$add->execute();

$_SESSION['mensagem'] = "Cadastrado, faça seu login";

header('Location: ../login.php');

 ?>