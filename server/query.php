<?php
include_once ('connection.php');
try {
	$query = 'select * from mysql.db';
	$stmt = $con->query($query);
	echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch(PDOException $e){
	die($e->getMessage());
}
?>
