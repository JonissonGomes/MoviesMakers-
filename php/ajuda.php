<?php
include '../includes/header.php' ;
?>

<nav>
    <div style="background-color:#006064;" class="nav-wrapper">
    <div class="center-align">
      <a href="index.php" class="left">INÍCIO</a>
      <a href="index.php" class="center">M O V I E M A K E R S</a>
      <ul class="right hide-on-med-and-down">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        
      </ul>
  </div>
    </div>
  </nav>
<!-- NavBar -->
   <!-- <nav>
    <div style="background-color:#006064;" class="nav-wrapper">
    <div class="center-align">
      <a href="index.php" class="center hide-on-med-and-down">M O V I E M A K E R S</a>
  </div>
  </div>
  </nav> -->
  <!-- Layout de entrada -->
  <h2 class="center-align">Ajuda</h2>
  <br>
  <form> 
        <!-- Dropdown Trigger -->

      </ul>
       <div class="container">
      <form class="col s2" method="POST" action="#">
      <div class="container">
      
      <div class="center-align">
      <center>Bem vindo à Ferramenta de Ajuda do MOVIEMAKERS.Aqui você pode encontrar resposta para as dúvidas mais comuns dos usuários.</center>
      </div>
      <br>

      <!-- filtro de busca por categoria -->
      <select name="opcao_filtro">               
           <option value="titulo">Título</option>
           <option value="autor">Autor</option>
           <option value="genero">Gênero</option>
           <option value="indice">Sinopse</option>
      </select>
      <!-- <i class="material-icons">pageview</i> -->
        <input required="" type="search" name="query" id="query" placeholder="Pesquisar" aria-label="Pesquisar">
        <button class="btn waves-effect waves-light" type="submit" name="action">Ir
        <i class="material-icons right">send</i>
      </button>
        
    
        </div>
        </div>
        </div>
        </label>
        </form>
        
<!-- Rodapé da página -->

<?php 
include_once '../includes/footer.php'
?>


