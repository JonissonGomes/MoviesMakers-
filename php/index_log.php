<?php 
	include_once'action/connect.php'; 
	include_once'../includes/header.php';
?>

	<nav>
		<div style="background-color:#006064;" class="nav-wrapper">
			<div class="center-align">
				<a href="../index.php" class="left">M O V I E M A K E R S</a>
			</div>
		</div>
	</nav>

	<!-- seleciona os filmes ordenados pela quantidade de pessoas que os adicionaram -->
	<?php
		$sql = $conexao -> prepare("SELECT *, (select count(*) FROM users_movies WHERE movie_id = movies.id) count_users FROM movies order by count_users desc, name");
		$sql -> execute();
		$dados_us_mv = $sql -> fetch(PDO::FETCH_ASSOC);
		// var_dump($dados_us_mv);
	?>

<!-- 	<?php foreach ($dados_us_mv as $dados_users_movies): ?>
		<?php echo $dados_users_movies."<br/>"; ?>
	<?php endforeach ?>

	<?php foreach ($dados_us_mv as $dados_users_movies): ?>
		<tr>
			<td><?= $dados_users_movies ?></td>
		</tr>
	<?php endforeach ?> -->
	
	<div class="section">
		<div class="row">
			<br>
			<div class="col s12 m5">
	          	<div class="icon-block">
	          	<br><br>
	            <h2 class="center black-text"><i class="material-icons large">subscriptions</i></h2>
	            <h5 class="center">Os mais assistidos</h5>
	            <p class="center">veja os filmes mais assistidos pela galera.</p>
	        	</div>
        	</div>
			<div class="col s12 m6">
				<div class="carousel carousel-slider center">
					<?php foreach ($dados_us_mv as $dados_users_movies): ?>
						<div class="carousel-item #607d8b blue-grey white-text" href="#one!">
							<h2><?= $dados_users_movies ?></h2>
							<p class="white-text"></p>
						</div>
					<?php endforeach ?>
				</div>
			</div>
		</div>
	</div>

	<hr>

	<!-- lista todos os filmes, priorizando os que o usuário 2 já assistiu, seguido pelos não assistidos, seguido pelos não marcados -->
	<?php 
		$sqli = $conexao -> prepare("SELECT movies.*, users_movies.watched watched FROM movies left join users_movies on users_movies.movie_id = movies.id and users_movies.user_id = 2 order by coalesce(users_movies.watched, 2), movies.name");
		$sqli -> execute();
		$dados_mv = $sqli -> fetch(PDO::FETCH_ASSOC);
		// var_dump($dados_mv);
	 ?>

<!-- 	<?php foreach ($dados_mv as $dados_movies): ?>
		<?php echo $dados_movies."<br/>"; ?>
	<?php endforeach ?>

	<?php foreach ($dados_mv as $dados_movies): ?>
		<tr>
			<td><?= $dados_movies ?></td>
		</tr>
	<?php endforeach ?> -->
	<div class="section">
		<div class="row">
			<br>
			<div class="col s12 m5">
	          	<div class="icon-block">
	          	<br><br>
	            <h2 class="center black-text"><i class="material-icons large">video_library</i></h2>
	            <h5 class="center">Filmes</h5>
	            <p class="center">Lista de todos os filmes.</p>
	        	</div>
        	</div>
			<div class="col s12 m6">
				<div class="carousel carousel-slider center">
					<?php foreach ($dados_mv as $dados_movies): ?>
						<div class="carousel-item #607d8b blue-grey white-text" href="#one!">
							<h2><?= $dados_movies ?></h2>
							<p class="white-text"></p>
						</div>
					<?php endforeach ?>
				</div>
			</div>
		</div>
	</div>

<?php 
	include_once'../includes/footer.php';
?>