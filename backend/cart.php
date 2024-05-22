<?php
// Aporte Jeremy Poveda
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET,POST,DELETE,PUT");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Conexión con la mini-base de datos
$server = "localhost";
$user = "root";
$password = "";
$database = "mundo_nintendo";

$conexionBD = new mysqli($server, $user, $password, $database);

// Verificar la conexión
if ($conexionBD->connect_error) {
    die("Conexión fallida: " . $conexionBD->connect_error);
}
//Fin  Aporte Jeremy Poveda




// Aporte Kevin Roldan
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Obtener los valores del JSON
    $usuario_id = intval($data['usuario_id']);
    $producto_id = intval($data['producto_id']);
    $cantidad = intval($data['cantidad']);

    // Consulta de seleccion
    $existingRecordQuery = "SELECT * FROM carrito WHERE producto_id = $producto_id AND usuario_id = $usuario_id";
    $existingRecordResult = mysqli_query($conexionBD, $existingRecordQuery);

    if (mysqli_num_rows($existingRecordResult) > 0) {
        // Si existe, actualizar la cantidad
        $updateQuery = "UPDATE carrito SET cantidad = cantidad + $cantidad WHERE producto_id = $producto_id AND usuario_id = $usuario_id";
        if (mysqli_query($conexionBD, $updateQuery)) {
            echo json_encode(["success" => 1, "message" => "Cantidad actualizada correctamente"]);
        } else {
            echo json_encode(["success" => 0, "message" => "Error al actualizar cantidad"]);
        }
    } else {
        // Si no existe, realizar la inserción
        $insertQuery = "INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES ($usuario_id, $producto_id, $cantidad)";
        if (mysqli_query($conexionBD, $insertQuery)) {
            echo json_encode(["success" => 1, "message" => "Datos agregados correctamente al carrito"]);
        } else {
            echo json_encode(["success" => 0, "message" => "Error al agregar datos al carrito"]);
        }
    }
}


if (isset($_GET["findShoppingCart"])) {
    $userID = $_GET["findShoppingCart"];
    $sqlProducts = mysqli_query($conexionBD, "SELECT * FROM carrito WHERE usuario_id = $userID");
    if (mysqli_num_rows($sqlProducts) > 0) {
        $products = mysqli_fetch_all($sqlProducts, MYSQLI_ASSOC);
        echo json_encode($products);
        exit();
    } else {
        echo json_encode(["success" => 0]);
    }

}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['usuario_id'])) {
    // Obtener el usuario_id que se desea eliminar
    $usuario_id_a_eliminar = $_GET['usuario_id'];


    // Sentencia SQL para eliminar los registros relacionados con el usuario_id
    $deleteQuery = "DELETE FROM carrito WHERE usuario_id = $usuario_id_a_eliminar";

    // Ejecutar la sentencia de eliminación
    if ($conexionBD->query($deleteQuery) === TRUE) {
        echo json_encode(["success" => 1, "message" => "Registros eliminados correctamente"]);
    } else {
        echo json_encode(["success" => 0, "message" => "Error al eliminar registros: " . $conexionBD->error]);
    }
} else {
    echo json_encode(["success" => 0, "message" => "No se proporcionó el parámetro usuario_id o no se utilizó una solicitud DELETE"]);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $dataUpdate = json_decode(file_get_contents('php://input'), true);

    $carrito_id = intval($dataUpdate['id']);
    $cantidad = intval($dataUpdate['cantidad']);


    $putQuery = "UPDATE  carrito SET cantidad = $cantidad WHERE  id=$carrito_id ";

    if (mysqli_query($conexionBD, $putQuery)) {
        echo json_encode(["success" => 1, "message" => "Datos actualizados correctamente al carrito"]);
    } else {
        echo json_encode(["success" => 0, "message" => "Error al actualizar datos al carrito"]);
    }
}




// Fin de aporte Kevin Roldán

?>