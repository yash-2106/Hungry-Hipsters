# The Hungry Hipsters

The Hungry Hipsters is a server-rendered food-ordering web application. Users can discover dishes, create an account, log in, select a dish, place an order with a quantity and delivery address, view an order confirmation, follow a simulated delivery tracker, and submit feedback.

The application is built with Node.js, Express, EJS templates, and MySQL. It also includes a Docker configuration for containerized deployment.

## Problem Statement

Ordering food often involves separate experiences for browsing a menu, registering an account, placing an order, and sharing feedback. The Hungry Hipsters brings these interactions together in one web application with a simple, visually focused interface.

## Objectives

- Provide a welcoming landing page for the food-ordering service.
- Allow users to register and log in securely.
- Display dishes retrieved from a MySQL database.
- Let users select a dish, choose a quantity, and provide a delivery address.
- Save order and feedback details in the database.
- Show order confirmation and a simulated order-progress experience.

## Technologies and Tools

- **Runtime:** Node.js
- **Backend:** Express 5
- **Templating:** EJS
- **Database:** MySQL, accessed through `mysql2`
- **Authentication utilities:** `bcryptjs` for password hashing and `uuid` for user IDs
- **Middleware:** `cors`, `morgan`, `dotenv`
- **Frontend:** HTML, CSS, vanilla JavaScript, and Bootstrap via CDN
- **Containerization:** Docker with the Node.js 18 base image
- **Development:** Nodemon

## Key Features

### Landing page

The home page includes:

- Hero section with the “Delicious Delivered” message
- Links to sign-up, login, about, and contact sections
- Dine-out restaurant carousel with external restaurant links
- About-us and contact sections
- Team presentation and site footer

### User registration and login

- Registration accepts a username, email, password, and password confirmation.
- Passwords are hashed with `bcryptjs` before being stored.
- Login checks the submitted username and compares the password with the stored hash.
- Successful login redirects to the dish menu.

### Dish browsing and search

- Menu data is loaded from the MySQL `dishes` table.
- Dish cards show an image, title, price, and location.
- The menu includes a client-side search field that highlights a matching dish.

### Ordering

- Users can open a dish detail page.
- Users can specify quantity and delivery address.
- The application calculates the total price and stores the order in the `detail` table.
- An order confirmation page displays the dish, quantity, total price, delivery address, and order time.

### Order tracking

The order-tracking page provides a simulated progression through:

1. Preparing the order
2. Packing the meal
3. Out for delivery
4. Delivered

The stages advance on the client according to fixed timers; this is a visual simulation rather than live delivery-status data.

### Feedback

Users can submit their name, email, and feedback message. The submission is saved to the `feedback` table and followed by a thank-you page that returns the user to the menu.

## Project Architecture

The application uses a straightforward server-rendered architecture:

1. `server.js` configures Express, middleware, routes, the EJS view engine, static assets, and the MySQL connection.
2. Route handlers query or update MySQL tables.
3. EJS templates render HTML responses.
4. Static images are served from `public/`.

### Folder Structure

```text
Hungry-Hipsters/
├── controllers/
│   └── testControllers.js       # Example controller for the test route
├── routes/
│   └── testroutes.js            # Example test route
├── public/
│   └── Images/                  # Logos, food images, backgrounds, and team images
├── views/
│   ├── home.ejs                 # Landing page
│   ├── Sign_Up.ejs             # Registration form
│   ├── login.ejs                # Login form
│   ├── main.ejs                 # Dish listing and search
│   ├── show.ejs                 # Dish details and order form
│   ├── c.ejs                    # Order confirmation
│   ├── order-tracking.ejs       # Simulated delivery tracker
│   ├── feedback.ejs             # Feedback form
│   ├── thankyou.ejs             # Feedback confirmation
│   └── cart.ejs                 # Inactive, commented-out cart prototype
├── .dockerignore
├── Dockerfile
├── package.json
├── package-lock.json
└── server.js                    # Express application entry point
```

### Database Tables Used by the Application

The server expects a MySQL database containing tables with the following fields:

- `sign_up_details`: `id`, `fullname`, `email`, `password`
- `dishes`: dish data including `title`, `price`, `location`, and `image_url`
- `detail`: order data including `title`, `quantity`, `price`, `order_time`, and `address`
- `feedback`: `name`, `email`, and `fdbck`

The repository does not include SQL migration or seed files, so these tables must be created and populated separately.

## Installation and Setup

### Prerequisites

- Node.js 18 or later
- npm
- MySQL server or a reachable MySQL-compatible database
- Docker, if using the containerized setup

### 1. Clone the repository

```bash
git clone https://github.com/yash-2106/Hungry-Hipsters.git
cd Hungry-Hipsters
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local `.env` file and provide the database connection values:

```env
PORT=8080
DB_HOST=localhost
DB_NAME=hungry_hipsters
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_PORT=3306
```

Do not commit real credentials. The application reads these values with `dotenv`.

### 4. Prepare the database

Create the tables expected by `server.js`, then add dish records to the `dishes` table. The repository currently does not provide a schema or seed script, so the exact SQL setup is deployment-specific.

## Running the Project

### Development mode

```bash
npm run server
```

This starts the application with Nodemon.

### Standard mode

```bash
npm start
```

Open [http://localhost:8080](http://localhost:8080), or use the port configured through `PORT`.

### Docker

Build and run the image:

```bash
docker build -t hungry-hipsters .
docker run --env-file .env -p 8080:8080 hungry-hipsters
```

The included `Dockerfile` uses Node.js 18 and starts the server with `node server.js`. If a deployment platform supplies a different port, configure the container and port mapping to match its `PORT` value.

## Application Routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/` | Render the landing page |
| `GET` | `/Sign_Up` | Render the registration form |
| `POST` | `/Sign_Up` | Register a user |
| `GET` | `/Login` | Render the login form |
| `POST` | `/Login` | Authenticate a user |
| `GET` | `/main` | Load and render dishes |
| `GET` | `/show/:title` | Render a selected dish |
| `GET` | `/place/:title/:price` | Save an order and render confirmation |
| `GET` | `/order-tracking` | Render the simulated tracker |
| `GET` | `/feedback` | Render the feedback form |
| `POST` | `/feedback` | Save feedback and render thank-you page |

## Screenshots

Add current screenshots of the running application in this section:

```text
[Screenshot placeholder: Landing page]
[Screenshot placeholder: Sign-up or login page]
[Screenshot placeholder: Dish menu]
[Screenshot placeholder: Dish details and order form]
[Screenshot placeholder: Order confirmation]
[Screenshot placeholder: Order tracking]
```

## Team Members

The repository identifies **Yash Shah** as the project author in `package.json`.

The landing page also presents Sanjeev Kapoor, Vikas Khanna, and Ranveer Brar in its “Meet Our Team” section. Their relationship to the software project is not otherwise documented in the repository.

## Future Scope

Potential improvements consistent with the current application include:

- Add database schema and seed scripts for repeatable setup.
- Add session-based authentication and route protection for authenticated actions.
- Replace the simulated tracker with persisted, server-driven order statuses.
- Add a functional cart with quantity updates and item removal.
- Add payment processing rather than displaying cash/UPI as an informational note.
- Add order history and user-specific order lookup.
- Add input validation, duplicate-account handling, and clearer user-facing error pages.
- Add automated tests and a configured test database.
- Move inline styles and scripts into reusable frontend assets.
- Add structured deployment documentation and production configuration guidance.

## Project Status

The repository contains a working prototype with the core browsing, authentication, ordering, feedback, and simulated tracking flows. There is currently no configured automated test suite (`npm test` exits with “Error: no test specified”).
