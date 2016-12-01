<?php
include_once ('connection.php');
try {
	$stmt = $con->query('show tables from mysql;');
	echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch(PDOException $e){
	die($e->getMessage());
}
?>
