<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DBConnect.php';

$db = new DbConnect;
$conn = $db->connect();
var_dump($conn);

//get form data
$data = json_decode(file_get_contents("php://input"));
print_r($data);

//insert data into database
$method = $_SERVER['REQUEST_METHOD'];
switch($method){
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        $sql = "INSERT INTO users(id,username, password,mobile) VALUES (null,:username, :password,:mobile)";
        $stmt = $conn->prepare($sql);
        // $stmt = $conn->prepare("INSERT INTO users (username, password,mobile) VALUES (:username, :password,123)");
        $stmt->bindParam(':username', $data->username);
        $stmt->bindParam(':password', $data->password);
        $stmt->bindParam(':mobile', $data->mobile);
        // $username = $_POST['username'];
        // $password = $_POST['password'];
        if($stmt->execute()){
            echo json_encode(array('message' => 'Data inserted successfully'));
        }else{
            echo json_encode(array('message' => 'Data insertion failed'));
        }
        break;
    case 'GET':
        $stmt = $conn->prepare("SELECT * FROM `users`");
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
