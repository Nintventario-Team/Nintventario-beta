## Project Presentation
You can access the project presentation video, which shows a demonstration (in English) of our software system showing the running software components and their compliance with functional and non-functional requirements, here.

[![Project Presentation](https://img.youtube.com/vi/sleJBA5K3Nw/0.jpg)](https://youtu.be/sleJBA5K3Nw)

## User Guide for Navigating and Using the Website

First, open your web browser and enter the URL of the web page displayed in Firebase which is the following:

[https://nintventario.web.app](https://nintventario.web.app)

Once the page loads, users will be on the main interface of our application. Below you will see how to use the basic functionalities of the website:

### Page Navigation

Use the navigation menu, located at the top of the main page, to explore different parts of the application. The sections available to browse are: "Inicio", "Categorias", "Blog", "Login", and "Search Cart". There is also the "Contacto" section that is not yet implemented for the delivery of this report:

![Home Page Web](images%20for%20guides/Pagina%20principal.png)

### "Inicio"

Here you will find the first visual impression of the website where there is a banner and below are the products that are in greatest demand among customers accompanied by miniatures of the products with direct links to add them to the cart. The latest products added to our inventory are also presented:

![Best Selling Products](images%20for%20guides/Productos%20mas%20bendidos.png)

![Product Details Display](images%20for%20guides/detalles%20del%20producto.png)

### Categorias

Being on this category we will find a Dropdown of Categories where we will have:

- **"TODOS"**: A link that directs to a page where all available products are displayed without filtering by specific category.
- **"VIDEO JUEGOS"**: Link that shows products that are video games.
- **"FUNKO POPS"**: Page dedicated to products from the Funko Pops category.
- **"CONSOLAS"**: Video game console products, including latest generation consoles and previous models.
- **"COLECCIONABLES"**: Section that contains collectible products such as figures, limited editions, or items of interest to collectors.
- **"ACCESORIOS"**: Products related to accessories for video games or other electronic products are shown here.

![Dropdown of Categories](images%20for%20guides/categorias%20.png)

![Example of Categories Section](images%20for%20guides/ejemplo%20categorias.png)

### Blog

Space where articles, news, product reviews, and relevant content for users are published. Each blog post includes images and detailed text:

![Blog Section](images%20for%20guides/seccion%20blog.png)

### Login

You enter here by clicking on the person icon in the navigation bar. It will redirect us to the login section where the login form will be found for registered users to access their personal accounts:

![Login Section](images%20for%20guides/seccion%20LonIn.png)

When you log in, the user is redirected to the main window and clicking the person icon again in the navigation bar will display the user's profile data:

![Login Demonstration](images%20for%20guides/demostracion%20inicio%20de%20sesion.png)

![User Profile](images%20for%20guides/vista%20de%20perfil.png)

If you do not have an account, you can click the Register button so that new users can create accounts on your website:

![Registration Section](images%20for%20guides/seccion%20registro.png)

### Shopping Cart

This section is accessed by clicking on the cart icon in the navigation bar. Here users can see the products they have selected to purchase. At the moment, only the storage of products and the change in purchase quantities corresponding to the maximum in inventory is implemented:

![Shopping Cart Section](images%20for%20guides/seccion%20carrito.png)

### Search Bar

Clicking on the magnifying glass icon in the navigation bar will display a bar where users can write the name of any product they are looking for and upon clicking ENTER the user will be redirected to the 'All' category section where the products will be displayed that match the search performed:

![Search Bar](images%20for%20guides/barra%20de%20busqueda.png)

![Search Result Example](images%20for%20guides/resultados%20de%20busqueda.png)

## Installation Guide for local deyploitment

### Software Requirements:

- Python: Make sure you have Python installed on your system. You can verify it by using the following 

- Command: (python --version). If you don't have it, you can download it from the official Python website (https://www.python.org/downloads/).

![Python Version](images%20for%20guides/python%20version.png)

- Angular CLI: If you don't have it yet, install Angular CLI globally by running (npm install -g @angular/cli) in your terminal.

- XAMPP: Download and install XAMPP from the official XAMPP website (https://www.apachefriends.org/index.html).

### Hardware Requirements:

- CPU: A processor of at least 1 GHz is recommended.

- RAM: It is recommended to have at least 4 GB of RAM.

- Disk Space: Make sure you have at least 1 GB of free disk space for the project and dependencies.

### Network Requirements:

- Internet Connection: An internet connection is required to install Python and Node.js dependencies, as well as to download Angular libraries and packages.

## Installation Steps

### Clone the repository:

- Clone the repository (https://github.com/Nintventario-Team/Nintventario-beta.git) to your local machine using the following command (git clone LINK) in CMD.

### Set up the virtual environment:

- Once the repository is cloned, access it as follows (cd Nintventario-beta/backend).

![Backend path](images%20for%20guides/backend%20path.jpg)

- Once in the backend folder, create a Python virtual environment by executing:

    - On Windows: (python -m venv environment_name). Then activate the virtual environment by running ( .\env\Scripts\activate).
 
    - On Linux/macOS: (source environment_name/bin/activate).

### Install Django dependencies:

- Once you are in the virtual environment, install the requirements.txt file by running: (pip install -r requirements.txt).

- Then, check if you have the following packages by running the command (pip list)

![Pip list](images%20for%20guides/pip%20list.png)

### Configure the database:

- Start XAMPP and make sure the MySQL and Apache servers are running.

![Xampp configuration example](images%20for%20guides/xampp.png)

- Then, create a new database for your project from phpMyAdmin.

![Cretion database example](images%20for%20guides/creation%20database.png)

### Configure the Django backend:

- Go to the settings.py file in the backend/backend_nintventario configuration folder.

- Configure the connection to the MySQL database you just created with the credentials

![Credentials database example](images%20for%20guides/creadentials%20database.png)

- Perform migrations by running (python manage.py makemigrations) followed by (python manage.py migrate) in CMD.

### Insert data into MySQL:

- Once migrations are executed. In the browser, go to (http://localhost/phpmyadmin/) and enter the database you created, go to the 'custom_user_category' table, and in the SQL section, execute the category inserts found in the database_nintventario.sql file.

- Repeat the same process for the 'custom_user_product' table.

### Configure the Angular frontend:

- In another command line, navigate to the Angular frontend folder.

![Frontend path](images%20for%20guides/frontend%20database.png)

- Install dependencies by running (npm install).

### Run the project:

- In the virtual environment terminal, run (python manage.py runserver) to start the Django server.

- In the other terminal, navigate to the frontend folder and run (ng serve -o) to start the Angular development server.

- Now you should be able to access the web catalog from your browser by visiting http://localhost:4200.
