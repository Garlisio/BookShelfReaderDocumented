<h1 align="center">Bookshelf</h1>
<p align="center"><img alt="Bookshelf Logo" src="https://github.com/Nayanbv02/LND-BookShelf-Nayan/blob/main/img/Bookshelf.png?raw=true"/></p> 

## Table of Contents:
---
- [Description](#description)
- [Installation](#installation)
- [E/R_Diagram](#e/r_diagram)
- [Use_Case_Diagram](#use_case_diagram)
- [Features](#features)
- [Database_Structure](#database_structure)
- [System_Architecture](#system_architecture)
- [Main_Endpoints](#main_endpoints)
- [Authentication](#authentication)
- [User_Manual](#user_manual)
- [Author](#author)

## Description

Bookshelf is a React application designed for book enthusiasts and casual readers alike. 

Users can log in to save their favorite or pending books in the library, keeping them all in one place, locally and quickly.

In short: *one library to rule them all*.

---

## Installation

To get started, ensure you have **Node.js** installed on your system. Then follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/Nayanbv02/React-BookshelfReader
    cd React-BookshelfReader

2. Install the dependencies:
    ```bash
    npm install

3. Run the application locally:
    ```bash
    npm run dev

---

## E/R_Diagram

<p align="center"><img alt="E/R Diagram" src="https://cdn.discordapp.com/attachments/765658882453536768/1338588847780659303/image.png?ex=67aba183&is=67aa5003&hm=67ea1eb918fbd2aaf87d74d3a88497bf15ff6486e62357570f14ece2292b931b&"/></p> 

---

## Use_Case_Diagram

<p align="center"><img alt="UseCase" src="https://cdn.discordapp.com/attachments/765658882453536768/1338589122184613989/image.png?ex=67aba1c4&is=67aa5044&hm=242fd5a4e7dfde30c6e4f2cc19868d5c77693f156cd74edb0867ca4107fb9ab2&"/></p> 

---

## Features

User Management: Create, update, retrieve, and delete users.

Book Management: Add, edit, mark as favorite, and delete PDF books.

Bookmarks: Add and manage bookmarks for specific books.

Authentication: JWT token generation for secure CRUD operations.

---

## Database_Structure

Users: id (PK), name, email, password
Books: book_id (PK), pdf_name, pdf_path, favorite, last_page, user_name (FK)
Bookmarks: bookmark_id (PK), page_number, color, date, book_id (FK)

---

## System_Architecture

Frontend: React (user interface).
Backend: Spring Boot (RESTful API).
Database: MySQL (data persistence management).

---

## Main_Endpoints

1. Users

   GET /api/users - Retrieve all users
   POST /api/users - Create a user
   PUT /api/users/{id} - Update a user
   DELETE /api/users/{id} - Delete a user

2. Books

   GET /api/books - List all books
   POST /api/books - Add a book
   PUT /api/books/{book_id} - Edit a book
   DELETE /api/books/{book_id} - Delete a book

3. Bookmarks

   GET /api/bookmarks - View all bookmarks
   POST /api/bookmarks/book/{book_id} - Create a bookmark
   PUT /api/bookmarks/{bookmark_id} - Edit a bookmark
   DELETE /api/bookmarks/{bookmark_id} - Delete a bookmark

---

## Authentication

Login: POST /login (Generates JWT token upon credential validation).
Register: POST /register (Creates a new user in the database).

---

## User_Manual

Registration: Create an account with your name, email, and password.
Book Management: Add PDF books, mark them as favorites, or delete the ones you no longer need.
Bookmarks: Add bookmarks on specific pages with color and date.
Security: Sessions are protected using JWT tokens.

---

## Authors

Nayan Betancor Vallejo
Diego Ferrer Rojas