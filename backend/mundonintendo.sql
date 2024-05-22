-- Creación de la mini base de datos de mundo nintendo
CREATE DATABASE IF NOT EXISTS mundo_nintendo;
USE mundo_nintendo;

-- Tabla productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(200),
    precio DECIMAL(10, 2) NOT NULL, -- 10 Números a la izquierda, y 2 decimales.
    detalles VARCHAR(300),
    cantidad INT,
    tipo VARCHAR(50),
    url_imagen VARCHAR(255),
    fecha_ingreso  DATE
);

-- Tabla Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    unique(correo)
);

-- Tabla Carrito
CREATE TABLE IF NOT EXISTS carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
	usuario_id int,
    producto_id int,
    cantidad int,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);


-- Tabla Historial de create
CREATE TABLE IF NOT EXISTS historial_compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    producto_id INT,
    cantidad INT,
    precio_total DECIMAL(10, 2),
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

INSERT INTO usuarios (nombre, correo, contrasena)
VALUES ('Jorge Mawyin', 'jmawyin@espol.edu.ec', '12345678'),
('Jeremy Poveda', 'jrpoveda@espol.edu.ec', 'abcdefgh'),
('Kevin Roldan', 'kroldan@espol.edu.ec', '87654321');
INSERT INTO productos (nombre, descripcion, precio, detalles, cantidad, tipo, url_imagen, fecha_ingreso)
VALUES
('The Legend of Zelda: Breath of the Wild', 'Aventura épica en el reino de Hyrule', 59.99, 'Consola: Nintendo Switch, Género: Aventura', 100, 'videojuego', 'https://i.imgur.com/TEmSMxl.png', '2022-01-15'),
('Cyberpunk 2077', 'Acción y aventura en un mundo futurista', 49.99, 'Consola: PS4, Género: Acción', 75, 'videojuego', 'https://i.imgur.com/EyOFGIS.png', '2022-02-20'),
('FIFA 22', 'Simulación de fútbol con gráficos realistas', 54.99, 'Consola: PS4, Género: Deporte', 120, 'videojuego', 'https://i.imgur.com/yl9Pe40.jpg', '2022-03-10'),
('Super Mario Odyssey', 'Acompaña a Mario en una aventura alrededor del mundo', 49.99, 'Consola: Nintendo Switch, Género: Aventura', 80, 'videojuego', 'https://i.imgur.com/EAE3O30.jpg', '2022-04-05'),
('Assassins Creed Valhalla', 'Explora la era vikinga y forja tu propio camino', 59.99, 'Consola: Xbox One, Género: Acción', 90, 'videojuego', 'https://i.imgur.com/cylW7Ey.jpg', '2022-05-18'),
('NBA 2K22', 'Simulación de baloncesto con realismo asombroso', 59.99, 'Consola: PS5, Género: Deporte', 110, 'videojuego', 'https://i.imgur.com/yF9Y0lE.jpg', '2022-06-22'),
('Minecraft', 'Construye y explora mundos infinitos', 29.99, 'Consola: PS4, Género: Aventura', 150, 'videojuego', 'https://i.imgur.com/wkjvfNL.png', '2022-07-30'),
('Call of Duty: Warzone', 'Experimenta la intensidad de la guerra moderna', 0.00, 'Consola: PS3, Género: Acción', 200, 'videojuego', 'https://i.imgur.com/7CS3zzB.png', '2022-08-15'),
('Rocket League', 'Fútbol con coches y mucha acción', 19.99, 'Consola: PS4, Género: Deporte', 70, 'videojuego', 'https://i.imgur.com/agARzf4.jpg', '2022-09-09'),
('Red Dead Redemption 2', 'Explora el salvaje oeste en una épica historia', 39.99, 'Consola: Xbox One, Género: Acción', 85, 'videojuego', 'https://i.imgur.com/5vH4hqg.jpg', '2022-10-21'),
('The Sims 4', 'Crea y controla personas en un mundo virtual', 39.99, 'Consola: Xbox One, Género: Simulación', 120, 'videojuego', 'https://i.imgur.com/TNeBCOQ.jpg', '2022-11-11'),
('Gran Turismo 7', 'Simulador de carreras con gráficos espectaculares', 59.99, 'Consola: PS5, Género: Deporte', 80, 'videojuego', 'https://i.imgur.com/YUbIsSJ.jpg', '2022-12-05'),
('Mortal Kombat 11', 'Brutales peleas con personajes icónicos', 44.99, 'Consola: PS4, Género: Lucha', 100, 'videojuego', 'https://i.imgur.com/hKfHs55.jpg', '2023-01-17'),
('Animal Crossing: New Horizons', 'Crea tu isla paradisíaca y vive la vida', 49.99, 'Consola: Nintendo Switch, Género: Simulación', 95, 'videojuego', 'https://i.imgur.com/OnwcNsH.jpg', '2023-02-28'),
('Fortnite', 'Battle Royale con construcción y estilo único', 10.00, 'Consola: PS4, Género: Acción', 250, 'videojuego', 'https://i.imgur.com/k56AXcg.jpg', '2023-03-15'),
('Spider-Man: Miles Morales', 'Aventura superheroica en el universo de Spider-Man', 49.99, 'Consola: PS5, Género: Aventura', 70, 'videojuego', 'https://i.imgur.com/qnkuPCH.png', '2023-04-20'),
('F1 2021', 'Experimenta la emoción de la Fórmula 1', 59.99, 'Consola: PS5, Género: Deporte', 65, 'videojuego', 'https://i.imgur.com/Qp4trIs.jpg', '2023-05-30'),
('The Witcher 3: Wild Hunt', 'Aventura épica con monstruos y magia', 29.99, 'Consola: Xbox One, Género: Aventura', 110, 'videojuego', 'https://i.imgur.com/H5FTg3T.jpg', '2023-06-22'),
('Overwatch', 'Combate en un shooter en equipo con héroes únicos', 39.99, 'Consola: PS4, Género: Acción', 90, 'videojuego', 'https://i.imgur.com/9i0gVhC.jpg', '2023-07-14'),
('Final Fantasy VII Remake', 'Revive la épica historia de Cloud y Sephiroth', 49.99, 'Consola: PS4, Género: RPG', 75, 'videojuego', 'https://i.imgur.com/ugXHGWx.jpg', '2023-08-25'),
('Funko Pop Lionel Messi', 'Figura coleccionable de Lionel Messi', 69.99, 'Personaje: Lionel Messi, Material: Vinilo', 50, 'funko', 'https://i.imgur.com/ptuxDuy.jpeg', '2023-08-26'),
('Funko Pop Pikachu', 'Figura coleccionable de Pikachu', 19.99, 'Personaje: Pikachu, Material: Vinilo', 50, 'funko', 'https://i.imgur.com/7DizXYQ.png', '2023-02-15'),
('Funko Pop Stitch', 'Figura coleccionable de Stitch', 39.99, 'Personaje: Stitch, Material: Vinilo', 50, 'funko', 'https://i.imgur.com/8AyA0z4.jpg', '2023-03-20'),
('Funko Pop Goku Super Saiyajin', 'Figura coleccionable de Goku Super Saiyajin', 19.99, 'Personaje: Goku Super Saiyajin, Material: Vinilo', 50, 'funko', 'https://i.imgur.com/NdFmMST.png', '2024-04-10'),
('Funko Pop Inosuke Hashibira', 'Figura coleccionable de Inosuke Hashibira', 15.99, 'Personaje: Inosuke Hashibira, Material: Vinilo', 50, 'funko', 'https://i.imgur.com/2gRdbzO.png', '2024-01-26'),
('Figura Coleccionable Zenitsu', 'Figura detallada de Zenitsu de Demon Slayer', 29.99, 'Personaje: Zenitsu, Material: PVC/Plástico', 30, 'figura', 'https://i.imgur.com/rilUBZa.jpeg', '2024-05-15'),
('Figura Coleccionable Luffy', 'Figura detallada de Luffy de One Piece', 29.99, 'Personaje: Luffy, Material: PVC/Plástico', 30, 'figura', 'https://i.imgur.com/VUwmJcl.jpeg', '2022-06-01'),
('Figura Coleccionable Sasuke', 'Figura detallada de Sasuke de Naruto', 49.99, 'Personaje: Sasuke, Material: PVC/Plástico', 30, 'figura', 'https://i.imgur.com/WcZ47kM.png', '2022-06-15'),
('Figura Coleccionable Nobara Kugisaki', 'Figura detallada de Nobara Kugisaki de Jujutsu Kaisen', 9.99, 'Personaje: Nobara Kugisaki, Material: PVC/Plástico', 30, 'figura', 'https://i.imgur.com/GAxUe9U.png', '2022-07-01'),
('Figura Coleccionable Deku', 'Figura detallada de Deku de My Hero Academia', 49.99, 'Personaje: Deku, Material: PVC/Plástico', 30, 'figura', 'https://i.imgur.com/47FyaVI.png', '2022-07-15'),
('Consola PS4', 'Sony PlayStation 4, sistema de entretenimiento en casa', 299.99, 'Modelo: PS4, Capacidad: 500 GB', 100, 'consola', 'https://i.imgur.com/OoURzTP.png', '2023-08-01'),
('Consola Xbox One', 'Microsoft Xbox One, sistema de juegos y multimedia', 249.99, 'Modelo: Xbox One, Capacidad: 500 GB', 100, 'consola', 'https://i.imgur.com/SrQKbQv.jpeg', '2023-08-15'),
('Consola Xbox Series X', 'Microsoft Xbox Series X, la nueva generación de juegos', 499.99, 'Modelo: Xbox Series X, Capacidad: 1 TB', 100, 'consola', 'https://i.imgur.com/HWSkqp0.png', '2022-09-01'),
('Consola Nintendo Switch', 'Nintendo Switch, consola híbrida para juegos en casa y portátiles', 299.99, 'Modelo: Switch, Capacidad: 32 GB', 100, 'consola', 'https://i.imgur.com/jSDkz7c.jpeg', '2022-09-15'),
('Consola PS5', 'Sony PlayStation 5, la última consola de juegos de Sony', 499.99, 'Modelo: PS5, Capacidad: 825 GB', 100, 'consola', 'https://i.imgur.com/gYhNJl3.png', '2023-10-01');
