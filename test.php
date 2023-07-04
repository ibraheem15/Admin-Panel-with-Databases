<?php
require __DIR__ . '../../vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

class MyWebSocket implements MessageComponentInterface
{
    public function onOpen(ConnectionInterface $conn)
    {
        // Handle new WebSocket connection
        // echo "New connection opened" . PHP_EOL;
        echo "New connection opened " . PHP_EOL;
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        // Handle received WebSocket message
        echo "Received message: " . $msg . PHP_EOL;

        // Send a response back to the client
        $from->send("Hello, client! I received your message: " . $msg);

       
    }

    public function onClose(ConnectionInterface $conn)
    {
        // Handle WebSocket connection closed
        echo "Connection closed" . PHP_EOL;
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        // Handle WebSocket error
        echo "Error occurred: " . $e->getMessage() . PHP_EOL;
        $conn->close();
    }
}

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new MyWebSocket()
        )
    ),
    8010 // Adjust the port number if necessary
);

$server->run();

// print_r($server);
