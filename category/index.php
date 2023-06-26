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
        // $data = json_decode(file_get_contents("php://input"));

        // // Prepare the base query
        // $query = "UPDATE category SET name = :name, description = :description";

        // // Check if the ID is provided
        // if (!empty($data->id)) {
        //     $query .= " WHERE id = :id";
        // }

        // // Check if the old name is provided
        // if (!empty($data->oldname)) {
        //     if (strpos($query, 'WHERE') === false) {
        //         $query .= " WHERE name = :oldname";
        //     } else {
        //         $query .= " OR name = :oldname";
        //     }
        // }

        // $stmt = $conn->prepare($query);
        // $stmt->bindParam(':name', $data->name);
        // $stmt->bindParam(':description', $data->description);

        // // Bind ID parameter if provided
        // if (!empty($data->id)) {
        //     $stmt->bindParam(':id', $data->id);
        // }

        // // Bind old name parameter if provided
        // if (!empty($data->oldname)) {
        //     $stmt->bindParam(':oldname', $data->oldname);
        // }

        // $stmt->execute();
        
        $data = json_decode(file_get_contents("php://input"));
        $id = $_GET['id'];
        $name =  $data->name;
        $description = $data->description;

        $stmt = $conn->prepare("UPDATE category SET name = :name, description = :description WHERE id = :id");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        break;

    case 'DELETE':
        //get id from .delete("http://localhost/api/category/index.php?id=" + id)
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM category WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        break;
    default:
        echo "Method not allowed";
        break;
}
