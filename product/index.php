<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");


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
        $sql = "INSERT INTO product(id,name,price,description,category_id) VALUES (null,:name,:price,:description,:category_id)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':price', $data->price);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':category_id', $data->category_id);
        if ($stmt->execute()) {
            echo json_encode(array('message' => 'Data inserted successfully'));
        } else {
            echo json_encode(array('message' => 'Data insertion failed'));
        }
        break;

    case 'GET':
        $sql = "SELECT * FROM product";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM product WHERE id = :id");
        $stmt->bindParam(':id', $id);
        if ($stmt->execute()) {
            echo json_encode(array('message' => 'Data deleted successfully'));
        } else {
            echo json_encode(array('message' => 'Data deletion failed'));
        }
        break;
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        $id = $_GET['id'];
        $name =  $data->name;
        $description = $data->description;
        $price = $data->price;
        $category_id = $data->category_id;


        $stmt = $conn->prepare("UPDATE product SET name = :name,price = :price,description = :description,category_id = :category_id WHERE id= :id");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':price', $price);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':category_id',$category_id);
        $stmt->execute();

        break;
}
