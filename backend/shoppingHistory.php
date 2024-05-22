<?php
// Aporte Jeremy Poveda
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET,POST,DELETE");
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

//Aporte Jorge Mawyin
if (isset($_GET["findAll"])) {
    $sqlProductos = mysqli_query($conexionBD, "SELECT * FROM historial_compras");
    if (mysqli_num_rows($sqlProductos) > 0) {
        $productos = mysqli_fetch_all($sqlProductos, MYSQLI_ASSOC);
        echo json_encode($productos);
        exit();
    } else {
        // Código para indicar que no se pudo realizar la consulta.
        echo json_encode(["success" => 0]);
    }
}


//Fin aporte Jorge Mawyin

//Aporte Kevin Roldan
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Obtener los valores del JSON
    $usuario_id = intval($data['usuario_id']);
    $producto_id = intval($data['producto_id']);
    $cantidad = intval($data['cantidad']);
    $precio_total = floatval($data['precio_total']); // Asegúrate de usar floatval para valores decimales

    // Consulta de inserción con consulta preparada
    $insertQuery = "INSERT INTO historial_compras (usuario_id, producto_id, cantidad, precio_total) VALUES (?, ?, ?, ?)";
    
    $stmt = mysqli_prepare($conexionBD, $insertQuery);

    // Vincular parámetros
    mysqli_stmt_bind_param($stmt, "iiid", $usuario_id, $producto_id, $cantidad, $precio_total);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => 1, "message" => "Datos agregados correctamente al carrito"]);
    } else {
        echo json_encode(["success" => 0, "message" => "Error al agregar datos al carrito"]);
    }

    // Cerrar la declaración
    mysqli_stmt_close($stmt);
}

//Fin aporte Kevin Roldan
