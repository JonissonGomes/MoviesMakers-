<?php

session_start();
include_once '../includes/header.php';
include_once '../includes/mensagem.php';

?>
<!-- NavBar -->
	 <nav>
    <div style="background-color:#006064;" class="nav-wrapper">
    <div class="center-align">
      <a href="../index.php" class="center hide-on-med-and-down">M O V I E M A K E R S</a>
  </div>
   </div>
  </nav>
	<!-- Layout de entrada -->
	<h2 class="center-align">Conectar-se:</h2>
	<br>
	<div class="container">
    <form class="col s2" method="POST" action="action/login.php">
      <div class="container">
      <strong><label>Insira seu mail: </strong>
        <div class="input-field col s12">
          <label for="email">Email</label>
          <input id="form-log-email" type="email" class="validate">
          <i>Ex: email@email.com</i>
        </div>
      </div>
      <div class="container">
     <strong> <label>Insira sua senha: </strong>
        <div class="input-field col s12">
          <label for="password">Senha</label>
          <input id="form-log-password" type="password" class="validate">
          <p></p>
      <div class="center-align">
      <button class="waves-effect waves-light btn
      "> <input style="border: none; background: none; color: white;" class="left-align" type="submit" value="Entrar"></button>
     <button class="waves-effect waves-light btn"><input style="border: none; background: none; color: white;" class="left-align" type="submit" value="Esqueci minha senha"></button>
      </div>
        </div>
      </div>
      </label>
    </form>
	    <!-- Perguntas mais frequentes -->
    <br>
    <div class="center-align">Não tem conta ainda?
    	<a href="cadastro.php"><button style="font-size: 10px;" class="waves-effect waves-light btn-small"> Criar conta</button></a> <p>
    <a href="recuperar.php"><button class="btn disabled"> Perguntas mais frequentes </button></a>
    	</div>
  </div>
		<!-- Rodapé da página -->

<?php 
include_once '../includes/footer.php'
?>