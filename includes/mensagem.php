<?php
//sessao
session_start();
?>
<?php if(isset($_SESSION['mensagem'])): ?>
	<script>
		//mensagem que mostra quando foi cadastrado com sucesso ou nao. MATERIALISE
		window.onload = function (){
			M.toast({html: '<?php echo $_SESSION['mensagem']; ?>'});
		};
	</script>
	<?php unset($_SESSION['mensagem']); ?>
<?php endif; ?>