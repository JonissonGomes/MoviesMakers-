<?php 

function getConnection(){

	$host = "localhost";
	$bd = "moviesmakers";
	$usr = "root";
	$pass = "ifpe";
	//essa senha depende de qual maquina vc ta acessando o bd 

	try{
		$connect = new PDO("mysql:host=".$host.";dbname=".$bd, $usr, $pass);
		return $connect;
	} catch(PDOException $e){
		return "Deu merda e:<br>" . $e->getMessage();
	}

}

$conexao = getConnection();


 ?>