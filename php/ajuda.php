<?php
include '../includes/header.php' ;
?>


<!-- NavBar -->
	 <nav>
    <div style="background-color:#006064;" class="nav-wrapper">
    <div class="center-align">
      <a href="index.php" class="center hide-on-med-and-down">M O V I E M A K E R S</a>
  </div>
  </div>
  </nav>
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
      <font>Bem-vindo à Ferramenta de Ajuda do MOVIEMAKERS. Aqui você pode encontrar resposta para as dúvidas mais comuns dos usuários.</font>
      </div>
      <br>
      <i class="material-icons">pageview</i>
      <input type="search" name="query" id="query" placeholder="Pesquisar" aria-label="Pesquisar">
      
      <!-- filtro de busca por categoria -->

      <select name="opcao_filtro">               
           <option value="titulo">Título</option>
           <option value="autor">Autor</option>
           <option value="genero">Gênero</option>
           <option value="indice">Índice</option>
        </select>
        </div>
        </div>
        </div>
        </label>
        </form>
<?php 
include_once  '../inclui/footer.php';
?>


