<?php 
  include "../includes/header.php"
?>
<style>
  .bloco{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 750px;
  }
  .box{
    border: 1px solid #000;
    width: 550px;
    height: 650px;
    /* margin: auto; */
    display: flex;
    flex-flow: wrap column;
    align-items: center;
    justify-content: center;
    box-shadow: 4px 4px 4px #000;
  }
  
</style>
  <link rel="stylesheet" href="../materialize/css/cadastro.css">
  <body>

<nav>
 <div style="background-color:#006064;" class="nav-wrapper">
 <div class="center-align">
   <a href="../index.php" class="center hide-on-med-and-down">M O V I E M A K E R S</a>
</div>
</div>
</nav>

<div class="bloco">
<div class="box">
<div class="row">
 <div class="input-field col s6">
   <input value="" id="first_name2" style="width: 400px;" type="text" class="validate">
   <label class="active" for="first_name2">Nome Completo</label>
 </div>
</div>

<div class="row">
 <div class="input-field col s12">
   <input id="email" type="email" style="width: 400px;" class="validate">
     <label for="email">Email</label>
 </div>
</div>

<div class="row">
 <div class="input-field col s12">
   <input id="confirmeemail" type="email" style="width: 400px;" class="validate">
     <label for="confirmeemail">Confirme seu Email</label>
 </div>
</div>  

<div class="row">
 <div class="input-field col s12">
    <input id="password" type="password" style="width: 400px;" class="validate">
     <label for="password">Senha</label>
  </div>
</div>

<div class="row">
 <div class="input-field col s12">
    <input id="confirmepassword" type="password" style="width: 400px;" class="validate">
     <label for="confirmepassword">Confirme sua Senha</label>
  </div>
</div>

<div class="center-align">
   <button class="waves-effect waves-light btn">
   <input style="border: none; background: none; color: white;" class="left-align" type="submit" value="Cadastrar"></button>
   <!-- <a href="recuperar.php"><button style="font-size: 11px;" class="btn-flat disabled"> Esqueci minha senha </button></a> -->
 </div>
</div>

</div>
	
<?php
  include '../includes/footer.php';
?>
