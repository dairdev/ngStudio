<?php
include_once ('connection.php');
try {
	$stmt = $con->query('show databases');
	echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch(PDOException $e){
	die($e->getMessage());
}
?>
