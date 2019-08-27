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

$validate = $conexao->prepare("SELECT * FROM users WHERE email = '$email'");
$validate->execute();

if ($validate->rowCount() == 0):
	$add->execute();
	$_SESSION['mensagem'] = "Cadastrado, faça seu login";
	header('Location: ../login.php');
else:
	header('Location: ../cadastro.php');
	$_SESSION['mensagem'] = "Usuário já cadastrado";
endif;



 ?>