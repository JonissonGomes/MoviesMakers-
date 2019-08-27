<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Cadastro de Filmes</title>
	<!-- Biblioteca exportada CSS via web  -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

  <!-- Biblioteca exportada JavaScript via web -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
  <!-- fontes de texto -->
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
	<nav>
    <div style="background-color:#006064;" class="nav-wrapper">
      <div class="center-align">
        <a href="index.php" class="left">M O V I E M A K E R S</a>
        <ul class="right hide-on-med-and-down">

        </ul>
      </div>
    </div>
  </nav>
<!-- Inputs do cadastro de filmes -->
  <h1 class="green-text text-darken-2">Cadastro de Filmes</h1>
  <!-- Formulario de entrada -->
<fieldset>
  <form class="col s12">
    <div class="row">
      <div class="row">
        <div class="input-field col s2">
          <input id="first_name" type="text" class="validate">
          <label for="first_name">Nome do Filme</label>
        </div>
      </div>
      <!--  -->
       <div class="row">
      <div class="input-field col s2">
        <input id="last_name" type="date" class="validate">
        <label for="last_name">Data de Lançamento</label>
      </div>
       </div>
      <!--  -->

      <div class="row">
        <div class="input-field col s2">
          <input id="name" type="text" class="validate">
          <label for="name">Nome do Filme em Inglês</label>
        </div>
      </div>
      <!--  -->

      <div class="row">
        <div class="input-field col s2">
          <input id="director" type="text" class="validate">
          <label for="director">Direção</label>
        </div>
      </div>
      <!--  -->
      <div class="row">
        <div class="input-field col s2">
          <input id="genre" type="text" class="validate">
          <label for="genre">Gênero</label>
        </div>
      </div>
      <!--  -->
      <div class="row">
        <div class="input-field col s2">
          <input id="synopsis" type="text" class="validate">
          <label for="synopsis">Sinopse</label>
        </div>
      </div>
      <!--  -->
      <a class="waves-effect waves-light btn"><i class="material-icons left">chevron_right</i>Registrar</a>
    </form>
  </fieldset>
<br>
<footer class="page-footer">
      <div class="container">
        <div class="row">
          <div class="col l6 s12">
            <h5 class="white-text">Moviemakers</h5>
            <p class="grey-text text-lighten-4">Você pode entrar em contato conosco utlizando os recursos listados:</p>
          </div>
          <div class="col l4 offset-l2 s12">
            <h5 class="white-text">Links</h5>
            <ul>
              <li><a class="grey-text text-lighten-3" href="cadastro.php">Crie sua conta grátis</a></li>
              <li><a class="grey-text text-lighten-3" href="#">Fale conosco</a></li>
              <li><a class="grey-text text-lighten-3" href="#!">Perguntas recentes</a></li>
              <li><a class="grey-text text-lighten-3" href="sobre.php">Sobre</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div style="background-color: black;" class="footer-copyright">
        <div class="container">
          © 2019 Moviemakers Copyright
          <a class="white-text text-lighten-4 right" href="#!">Suporte</a>
        </div>
      </div>
    </footer> 
