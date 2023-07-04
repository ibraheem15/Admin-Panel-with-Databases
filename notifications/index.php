<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

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
        $sql = "INSERT INTO notifications(id,user_id,message,created_at) VALUES (null,:user_id,:message,:created_at)";
        // $sql = "INSERT INTO notifications(id,user_id,message,created_at) VALUES (null,1,'test','2021-05-05')";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':user_id', $data->user_id);
        $stmt->bindParam(':message', $data->message);
        $stmt->bindParam(':created_at', $data->created_at);
        if ($stmt->execute()) {
            echo json_encode(array('message' => 'Data inserted successfully'));

            //send notification
        } else {
            echo json_encode(array('message' => 'Data insertion failed'));
        }
        break;

    case 'GET':
        $sql = "SELECT * FROM notifications";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        header('Content-Type: application/json');
        echo json_encode($result);
        break;

    case 'DEFAULT':
        echo "default";
        break;
}
