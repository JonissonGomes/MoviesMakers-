<style>
    body{

    }
    .container{
    	width: 100%;
    	height: 100%;
    	display: flex;
    	justify-content: center;
    	align-items: center;
    	min-height: 100ch;
    }
    .box{
    	display: flex;
    	justify-content: center;
    	flex-flow: wrap column;
    	width: 550px;
    	height: 650px;
    	border: 1px solid #000;
    	padding: 40px 40px;
    	box-shadow: 4px 4px 4px #000;

    }
    </style>
</head>

<?php
	include '../includes/header.php';
?>
<body>

	 <nav>
    <div style="background-color:#006064;" class="nav-wrapper">
    <div class="center-align">
      <a href="index.php" class="center hide-on-med-and-down">M O V I E M A K E R S</a>
  </div>
   </div>
</nav>

<div class="container">
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
</body>
</html>