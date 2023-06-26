<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

// include 'DBConnect.php';
include '../DBConnect.php';

$db = new DbConnect;
$conn = $db->connect();

//get form data
$data = json_decode(file_get_contents("php://input"));
print_r($data);

//insert data into database
$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        $sql = "INSERT INTO category(id,name,description) VALUES (null,:namee,:description)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':namee', $data->namee);
        $stmt->bindParam(':description', $data->description);
        if ($stmt->execute()) {
            echo json_encode(array('message' => 'Data inserted successfully'));
        } else {
            echo json_encode(array('message' => 'Data insertion failed'));
        }
        break;

    case 'GET':
        $sql = "SELECT * FROM category";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case 'PUT':
        $data = (file_get_contents("php://input"));
        $stmt = $conn->prepare("UPDATE `users` SET `username` = :username, `password` = :password WHERE `id` = :id");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':id', $id);
        $username = $_POST['username'];
        $password = $_POST['password'];
        $id = $_GET['id'];
        $stmt->execute();
        break;
    case 'DELETE':
        $data = (file_get_contents("php://input"));
        $stmt = $conn->prepare("DELETE FROM `users` WHERE `id` = :id");
        $stmt->bindParam(':id', $id);
        $id = $_GET['id'];
        $stmt->execute();
        break;
    default:
        echo "Method not allowed";
        break;
}
