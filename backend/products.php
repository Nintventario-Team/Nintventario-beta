<?php
// Aporte Jeremy Poveda
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET,POST");
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
// Consulta todos los items de la tabla solicitada de la base de datos.
if (isset($_GET["findAll"])) {
    $sqlProductos = mysqli_query($conexionBD, "SELECT * FROM productos");
    if (mysqli_num_rows($sqlProductos) > 0) {
        $productos = mysqli_fetch_all($sqlProductos, MYSQLI_ASSOC);
        echo json_encode($productos);
        exit();
    } else {
        // Código para indicar que no se pudo realizar la consulta.
        echo json_encode(["success" => 0]);
    }
}
// Fin de aporte Jeremy Poveda

// Aporte Jorge Mawyin

// Obtener lista de productos más vendidos
if (isset($_GET["findMostSold"])) {
    $sqlQuery = "
        SELECT
            p.id AS id,
            p.nombre AS nombre,
            p.descripcion,
            p.precio,
            p.detalles,
            p.cantidad AS cantidad,
            p.tipo,
            p.url_imagen,
            p.fecha_ingreso,
            SUM(hc.cantidad) AS total_vendido
        FROM
            productos p
        JOIN
            historial_compras hc ON p.id = hc.producto_id
        GROUP BY
            p.id
        ORDER BY
            total_vendido DESC";

    $result = mysqli_query($conexionBD, $sqlQuery);
    $productos = $result ? mysqli_fetch_all($result, MYSQLI_ASSOC) : [];
    if (count($productos) < 4) {
        $sqlProductos = mysqli_query($conexionBD, "SELECT * FROM productos ORDER BY cantidad ASC LIMIT 12");
    if (mysqli_num_rows($sqlProductos) > 0) {
        $productos = mysqli_fetch_all($sqlProductos, MYSQLI_ASSOC);
        echo json_encode($productos);
        exit();
    } else {
        // Código para indicar que no se pudo realizar la consulta.
        echo json_encode(["success" => 0]);
    }
    }
    echo json_encode($productos ?: ["success" => 0, "message" => "No se encontraron productos más vendidos."]);
    exit();
}

// Obtener los productos con fecha de ingreso reciente
if (isset($_GET["findByNews"])) {
    $sqlProductos = mysqli_query($conexionBD, "SELECT * FROM productos ORDER BY fecha_ingreso DESC LIMIT 12");
    if (mysqli_num_rows($sqlProductos) > 0) {
        $productos = mysqli_fetch_all($sqlProductos, MYSQLI_ASSOC);
        echo json_encode($productos);
        exit();
    } else {
        // Código para indicar que no se pudo realizar la consulta.
        echo json_encode(["success" => 0]);
    }
}

// Obtener los productos más vendidos
if (isset($_GET["findLeast"])) {
    $sqlProductos = mysqli_query($conexionBD, "SELECT * FROM productos ORDER BY cantidad ASC LIMIT 12");
    if (mysqli_num_rows($sqlProductos) > 0) {
        $productos = mysqli_fetch_all($sqlProductos, MYSQLI_ASSOC);
        echo json_encode($productos);
        exit();
    } else {
        // Código para indicar que no se pudo realizar la consulta.
        echo json_encode(["success" => 0]);
    }
}
// Fin aporte jorge Mawyin

// Aporte Kevin Roldan


// Obtener productos por tipo y/o rango de precio

if (isset($_GET["findByID"]) || isset($_GET["findByType"]) || isset($_GET["findByPriceRange"]) || isset($_GET["findByName"]) || isset($_GET["findByNew"])|| isset($_GET["findByLeast"])) {
    $sqlConditions = [];

    // Verificar si se está filtrando por tipo
    if (isset($_GET["findByType"])) {
        $tipo = $_GET["findByType"];
        $sqlConditions[] = "tipo = '$tipo'";
    }

    if (isset($_GET["findByID"])) {
        $id = $_GET["findByID"];
        $sqlConditions[] = "id = '$id'";

    }

    // Fin de aporte Kevin Roldán

    // Aporte Jorge Mawyin

    // Verificar si se está filtrando por nombre
    if (isset($_GET["findByName"])) {
        $nombre = $_GET["findByName"];
        $nombre = "%".$nombre."%";
        $sqlConditions[] = "nombre LIKE '$nombre'";
    }

    // Verificar si se está filtrando por rango de precio
    if (isset($_GET["findByPriceRange"])) {
        $minPrice = isset($_GET['minPrice']) ? $_GET['minPrice'] : null;
        $maxPrice = isset($_GET['maxPrice']) ? $_GET['maxPrice'] : null;

        $sqlConditions[] = "precio BETWEEN $minPrice AND $maxPrice";
    }

    // Verificar si se está filtrando por novedades
    if (isset($_GET["findByNew"])){
        $sqlConditions[] = "ORDER BY fecha_ingreso DESC LIMIT 12";
    }

    // Verificar si se está filtrando por novedades
    if (isset($_GET["findByLeast"])){
        $sqlConditions[] = "ORDER BY cantidad ASC LIMIT 12";
    }

    // Construir la consulta SQL con las condiciones
    $sqlQuery = "SELECT * FROM productos";

    if (!empty($sqlConditions)) {
        if(strpos(implode(" ", $sqlConditions), "ORDER") !== false){
            $sqlQuery .= " WHERE " . implode(" ", $sqlConditions);
        }else{
            $sqlQuery .= " WHERE " . implode(" AND ", $sqlConditions);
        }
    }

    // Ejecutar la consulta SQL
    $result = mysqli_query($conexionBD, $sqlQuery);

    if ($result) {
        if (mysqli_num_rows($result) > 0) {
            $productos = mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode($productos);
            exit();
        } else {
            echo json_encode(["success" => 0, "message" => "No se encontraron productos con los filtros especificados."]);
            exit();
        }
    } else {
        echo json_encode(["success" => 0, "message" => "Error en la consulta SQL"]);
        exit();
    }
}
// Fin de aporte Jorge Mawyin


?>
