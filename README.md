# Expense Manager

An application to manage and track your expenses efficiently.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [License](#license)

## Installation

To install all the dependencies listed in the `package.json` file, run the following command in your project directory:

```bash
npm install
```
Make sure the following dependencies are listed in your package.json file:
```json
"dependencies": {
    "connect-flash": "^0.1.1",
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "ejs": "~2.6.1",
    "express": "~4.16.1",
    "express-session": "^1.18.0",
    "http-errors": "~1.6.3",
    "mongoose": "^8.2.3",
    "morgan": "~1.9.1",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "passport-local-mongoose": "^8.0.0"
}
```

## Usage
To start the application, use the following command:
```bash
npm start
```
Then open your browser and navigate to http://localhost:3000 to access the Expense Manager application.

## Dependencies

This project uses the following dependencies:

- **connect-flash**: `^0.1.1` - Middleware for providing flash messages, used for notifications and alerts within the app.
- **cookie-parser**: `~1.4.4` - Parses cookies attached to the client request object, essential for handling session cookies.
- **debug**: `~2.6.9` - A tiny debugging utility modeled after Node.js core's debugging technique.
- **ejs**: `~2.6.1` - Embedded JavaScript templating for rendering dynamic content on the server side.
- **express**: `~4.16.1` - A fast, unopinionated, minimalist web framework for Node.js, forming the backbone of the application.
- **express-session**: `^1.18.0` - Session middleware for Express, used to manage user sessions.
- **http-errors**: `~1.6.3` - Creates HTTP errors for use in the application.
- **mongoose**: `^8.2.3` - MongoDB object modeling tool designed to work in an asynchronous environment, providing a straightforward schema-based solution to model your application data.
- **morgan**: `~1.9.1` - HTTP request logger middleware for Node.js, used for logging requests to the application.
- **passport**: `^0.7.0` - Simple, unobtrusive authentication for Node.js, used for managing user authentication.
- **passport-local**: `^1.0.0` - Passport strategy for authenticating with a username and password.
- **passport-local-mongoose**: `^8.0.0` - Mongoose plugin for simplifying the integration of Passport with Mongoose, providing a way to store user information securely.
