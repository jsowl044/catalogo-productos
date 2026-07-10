# 🛍️ Product Catalog App

> A full-stack product catalog system built with **Express**, **Node.js**, **MongoDB**, and **SQLite** — combining a flexible product database with lightweight structured storage for site content.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Product%20Data-47A248?logo=mongodb&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Site%20Content-003B57?logo=sqlite&logoColor=white)
![Status](https://img.shields.io/badge/status-active%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📖 Overview

**Product Catalog App** is a web application for managing and displaying a catalog of products, including image uploads and sale/promotion flags. It's built on a **polyglot persistence architecture**: MongoDB handles the flexible, evolving structure of product data, while SQLite manages lightweight, structured content like the site footer — keeping each database doing what it's best at.

---

## ✨ Features

- 🖼️ **Product Management** — Add products with images, descriptions, and pricing
- 🏷️ **Sale Flagging** — Mark any product as "on sale" with a simple toggle, making promotions easy to manage
- 🗂️ **Polyglot Persistence** — MongoDB for flexible, schema-less product data; SQLite for fast, structured site content (footer)
- 🍔 **Responsive Hamburger Navigation** — Clean, mobile-friendly menu system
- 🔐 **Authentication UI** — Front-end login/menu scaffold is complete and ready for backend integration (see [Roadmap](#-roadmap))
- ⚡ **Lightweight Stack** — No heavy front-end framework required; built with plain Express-rendered views for speed and simplicity

---

## 🧱 Tech Stack

| Layer               | Technology                          |
|---------------------|--------------------------------------|
| Runtime              | Node.js                             |
| Framework            | Express.js                          |
| Product Database     | MongoDB                             |
| Site Content Database| SQLite                              |
| Frontend             | HTML, CSS, JavaScript (no framework)|
| Image Uploads        | Multer *(update if you're using something else)* |

---

## 🏗️ Architecture

```
┌────────────────────┐
│      Client         │
│ (Hamburger menu,    │
│  catalog views)      │
└─────────┬────────────┘
          │
┌─────────▼────────────┐
│   Express.js Server   │
└───────┬───────┬───────┘
        │       │
┌───────▼───┐ ┌─▼─────────┐
│  MongoDB   │ │  SQLite    │
│ Product    │ │ Footer /   │
│ Catalog    │ │ Site Data  │
└────────────┘ └────────────┘
```

Using two databases side by side lets the app store product data flexibly (documents that can vary as the catalog grows) while keeping simple, structured content in a lightweight file-based database — no extra infrastructure needed for small, static pieces like the footer.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm
- A running MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- SQLite3 (bundled via npm package, no separate install needed)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/product-catalog
SQLITE_DB_PATH=./data/footer.db
```

### Running the App

```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## 📁 Project Structure

```
├── config/           # Database connections (MongoDB & SQLite)
├── models/           # MongoDB schemas / SQLite table definitions
├── routes/           # Express route handlers
├── public/           # Static assets (CSS, JS, uploaded images)
├── views/            # Server-rendered templates
├── .env
└── server.js
```

> Adjust this tree to match your actual folder layout.

---

## 🗺️ Roadmap

- [ ] Complete backend authentication (login/session handling)
- [ ] Protected admin routes for catalog management
- [ ] Product search and filtering
- [ ] Pagination for large catalogs
- [ ] Automated tests
- [ ] Deployment pipeline

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/<your-username>/<your-repo>/issues) or open a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/<your-username>)
