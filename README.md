# 🛍️ Product Catalog App

> A small full-stack product catalog: a public storefront with search, an image carousel and flip cards, an admin page to manage products, and an Express REST API backed by SQLite.

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?logo=sqlite&logoColor=white)

---

## 📖 Overview

**Product Catalog App** shows a catalog of electronics to visitors and lets an administrator create, edit and delete products from a separate page. The backend is an Express server that exposes a JSON API and stores everything in a local SQLite file, so there is no database to install: the file is created and filled with sample products the first time the app starts.

The frontend is plain HTML, CSS and JavaScript (no framework, no build step) served by the same Express server.

---

## ✨ Features

**Public catalog (`/`)**

- 🃏 **Flip cards** — each product shows its image and name; on hover the card flips to show the description, the price and whether it is on sale
- 🔎 **Live search** — filters the products by name as you type
- 🪟 **Detail modal** — click a product to see its image, description and price
- 🎠 **Image carousel** — an auto-playing carousel built from the product images, with [Splide](https://splidejs.com/)
- 🍔 **Hamburger menu** — responsive navigation; the layout adapts to mobile, tablet and desktop widths
- 🏢 **About section** — the footer shows the company's mission, vision and team members, read from the API

**Admin page (`/admin.html`)**

- ➕ **Create and edit products** — name, description, price and image, with an image preview
- 🏷️ **Sale flag** — mark a product as "on sale" with a checkbox
- 🗑️ **Delete products** — with a confirmation prompt
- ✏️ **Edit the About section** — mission, vision and team members

**Backend**

- 🔌 **REST API** with Express for products and company information
- 🗄️ **SQLite storage** through `better-sqlite3`; tables are created automatically and seeded with sample data on first run
- ⚙️ **Configuration through `.env`** (port, database path and an optional MongoDB connection)

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Server | Express 4 |
| Database | SQLite (`better-sqlite3`) |
| Frontend | HTML, CSS and JavaScript, no framework |
| Carousel | Splide 4, loaded from a CDN |
| Configuration | `dotenv` |
| Optional | MongoDB connection through Mongoose (see [Notes on MongoDB](#notes-on-mongodb)) |

---

## 🏗️ Architecture

```
┌─────────────────────────┐
│ Browser                 │
│  index.html  admin.html │
└────────────┬────────────┘
             │ fetch (JSON)
┌────────────▼────────────┐
│ Express server          │
│  /api/productos         │
│  /api/company-info      │
│  static files (public/) │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│ SQLite (db/sqlite.js)   │
│  products               │
│  company_info           │
│  integrantes            │
└─────────────────────────┘
```

Product images are stored in the `imagen` column of the `products` table. The sample products point to files in `public/assets/`; products created from the admin page store the image itself as a base64 data URL.

### API

| Method | Route | What it does |
|---|---|---|
| `GET` | `/api/productos` | List all products |
| `POST` | `/api/productos` | Create a product |
| `PUT` | `/api/productos/:id` | Update a product (`404` if it doesn't exist) |
| `DELETE` | `/api/productos/:id` | Delete a product (`404` if it doesn't exist) |
| `GET` | `/api/company-info` | Mission, vision and team members (`null` if empty) |
| `POST` | `/api/company-info` | Replace the mission, vision and team members |

A product looks like this:

```json
{
  "id": 3,
  "nombre": "Teclado mecanico",
  "descripcion": "Teclado con luces RGB especial para juegos",
  "imagen": "assets/3.jpg",
  "precio": 56,
  "rebaja": true
}
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or higher
- npm
- SQLite is included through the `better-sqlite3` npm package, so there is nothing else to install

### Installation

```bash
# Clone the repository
git clone https://github.com/jsowl044/catalogo-productos.git
cd catalogo-productos

# Install dependencies
npm install
```

### Environment Variables

Every variable is optional. To change the defaults, copy `.env.example` to `.env` and edit it (the `.env` file is ignored by git, so credentials never end up in the repository):

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Port the server listens on |
| `SQLITE_DB_PATH` | `db/products.db` | Where the SQLite file is created |
| `MONGO_URI` | *(unset)* | MongoDB connection string. If unset, the MongoDB connection is skipped |

> **Never commit a real connection string.** Keep it in `.env` and use a database user with its own password.

### Running the App

```bash
npm start
```

The app will be available at `http://localhost:3000` (the catalog) and `http://localhost:3000/admin.html` (the admin page). On the first run the SQLite database is created automatically and filled with a few sample products.

---

## 📁 Project Structure

```
server.js                    Express app: middleware, routes, optional MongoDB connection
db/sqlite.js                 SQLite connection, table creation and sample data
routes/productosRouter.js    Products API
routes/companyInfoRouter.js  Company information API
models/                      Mongoose schemas (not used by the routes yet)
public/index.html            Public catalog
public/admin.html            Admin page
public/js/                   Frontend scripts for each page
public/css/                  Styles
public/assets/               Sample product images and icons
.env.example                 Template for the optional environment variables
```

---

## 📝 Notes on MongoDB

The project started with MongoDB in mind, and the repository still contains Mongoose schemas for products and company information in `models/`. The API does not use them: products and company information are stored in SQLite. If you set `MONGO_URI`, the server connects to that database, which is a starting point for moving the data there; without it, the connection is skipped.

---

## ⚠️ Known Limitations

This project was built to practice a full-stack workflow, not to run in production. Before using it for anything real:

- **There is no real authentication.** The login form in the menu only checks that the username and password fields are not empty, and the API accepts create, update and delete requests from anyone.
- Images are saved as base64 text inside the database and the form limits them to 1 MB. A file storage service would scale better.
- The carousel library loads from a CDN, so the carousel needs an internet connection.
- Search only matches product names, and the catalog has no pagination.
- The social media links in the footer are placeholders.
- There are no automated tests.

## 🗺️ Roadmap

- [ ] Real authentication and protected admin routes
- [ ] Server-side validation of product data
- [ ] Image upload to file storage instead of base64
- [ ] Search by price and filter by sale
- [ ] Pagination for large catalogs
- [ ] Automated tests
- [ ] Deployment pipeline

---

## 👥 Authors

Built by Julian Agudelo and Jaziel Garcia.
