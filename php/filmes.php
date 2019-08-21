<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Cadastro de Filmes</title>
	<style>
	</style>
	 <!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

    <!-- Compiled and minified JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="../materialize/css/materialize.css">
            
</head>
<body  class="#e8f5e9 green lighten-5">
	<nav>
    <div style="background-color:#006064;" class="nav-wrapper">
    <div class="center-align">
      <a href="index.php" class="left">M O V I E M A K E R S</a>
      <ul class="right hide-on-med-and-down">
        
      </ul>
  </div>
    </div>
  </nav>

<div class="center">
	<h1 class="green-text text-darken-2">Cadastro de Filmes</h1>


	<h6><i class="material-icons left"></i>O Rei Leão - Aventura - 2019</h6> 
	
	<img src="oreileao.jpg" height="300px"> 

	<p position:relative; >Traído e exilado de seu reino, o leãozinho Simba precisa descobrir como crescer e retomar seu destino como herdeiro real nas planícies da savana africana.</p>

	
	<a class="waves-effect waves-light btn"><i class="material-icons left">queue_play_next</i>Quero Ver</a>
	<a class="waves-effect waves-light btn"><i class="material-icons left">personal_video</i>Já Assisti</a>
	<a class="waves-effect waves-light btn"><i class="material-icons left">favorite</i>Curtir</a>

	
	<div class="row">
    <form class="col s12"> <br>
      <div style="margin-left: 33%;" class="row center">
        <div class="input-field col s6 ">
        	<textarea id="textarea1" class="materialize-textarea"></textarea>
          <label for="textarea1"><i class="material-icons left">textsms</i>Comente:</label>
          <button type="submit" name="enviar" class="btn"> <i class="material-icons left">chevron_right</i>Enviar</button>
        </div>
      </div>
    </form>
  </div>
            
  </div>

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

	
</body>
</html>