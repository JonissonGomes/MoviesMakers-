<!DOCTYPE html>
<html lang="pt-br">
<head>
	<meta charset="UTF-8">
	<title>Entrar na minha conta</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
</head>
<body>
<!-- NavBar -->
	 <nav>
    <div style="background-color:#006064;" class="nav-wrapper">
    <div class="center-align">
      <a href="index.php" class="center hide-on-med-and-down">M O V I E M A K E R S</a>
  </div>
   </div>
  </nav>
	<!-- Layout de entrada -->
	<h2 class="center-align">Conectar-se:</h2>
	<br>
	<div class="container">
    <form class="col s2" method="POST" action="#">
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
      <a href="recuperar.php"><button style="font-size: 11px;" class="btn-flat disabled"> Esqueci minha senha </button></a>
      </div>
        </div>
      </div>
      </label>
    </form>
</body>
</html>
