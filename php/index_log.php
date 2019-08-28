<?php 
	include_once'../includes/header.php';
?>

	<nav>
		<div style="background-color:#006064;" class="nav-wrapper">
			<div class="center-align">
				<a href="../index.php" class="left">M O V I E M A K E R S</a>
			</div>
		</div>
	</nav>
	
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
							<h2></h2>
							<p class="white-text"></p>
						</div>
					<?php endforeach ?>
				</div>
			</div>
		</div>
	</div>

	<hr>

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
							<h2></h2>
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