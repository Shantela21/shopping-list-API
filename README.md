<img src="https://socialify.git.ci/Shantela21/shopping-list-API/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="shopping-list-API" width="640" height="320" />

## 🛒 Shopping List API

  A TypeScript-based REST API for managing shopping list items with full CRUD operations — built using Node.js and the native HTTP module (no external frameworks).

## 🚀 Features

✅ Create, Read, Update, and Delete (CRUD) shopping list items

* 🧠 Built with TypeScript  for type safety

* ⚙️ Runs on the native Node.js HTTP server (no Express)

* 🔁 Hot-reload in development using nodemon

* 📦 Simple file-based modular structure

## 📁 Project Structure
```
shopping-list-api/
├── src/
│   ├── routes/
│   │   └── items.ts         # Route handler for /items endpoint
│   ├── server.ts            # Main server file
├── package.json
├── tsconfig.json
└── README.md
``` 

## 🧩 API Endpoints
| Method | Endpoint     | Description             |
| ------ | ------------ | ----------------------- |
| GET    | `/items`     | Get all items           |
| GET    | `/items/:id` | Get a single item by ID |
| POST   | `/items`     | Add a new item          |
| PUT    | `/items/:id` | Update an item by ID    |
| DELETE | `/items/:id` | Delete an item by ID    |

**Example response:**
```
{
  "id": 1,
  "name": "Milk",
  "quantity": 2,
  "purchased": false
}
```

## ⚙️ Installation & Setup
### 1️⃣ Clone the repository
```
git clone https://github.com/Shantela21/shopping-list-API.git
```
```
cd shopping-list-API
``` 

### 2️⃣ Install dependencies
```
npm install
```
### 3️⃣ Run in development mode
```
npm run dev
```


This uses **nodemon** and ts-node for hot-reloading.

### 4️⃣ Run in production
```
npm run build
```

```
npm start
```

## 🌐 Server Information

* **Base URL**: http://localhost:4000

* **Default Port**: 4000

## 🧠 Tech Stack
| Tool       | Purpose                         |
| ---------- | ------------------------------- |
| Node.js    | Runtime environment             |
| TypeScript | Static typing                   |
| ts-node    | Run TypeScript directly         |
| Nodemon    | Auto-restart during development |

## 🧰 Scripts
| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start server in development with nodemon |
| `npm run build` | Compile TypeScript to JavaScript         |
| `npm start`     | Run compiled JavaScript server           |

## 👩🏽‍💻 Author

Developed by **Shantela Noyila**
💻 GitHub: **Shantela21**