import { IncomingMessage, ServerResponse } from "http";
import { getItems, getItemById, addItem, updateItem } from "../controller/items";
// https://localhost:4000/items
export const itemsRoute = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith("/items")) {
    const parts = req.url.split("/");
    const id = parts[2] ? parseInt(parts[2]) : undefined;
    if (req.method === "GET" && !id) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(getItems()));
      return;
    }
    if (req.method === "GET" && id) {
      if (isNaN(id)) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "no items found" }));
        return;
      }
      const item = getItemById(id);
      if (!item) {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Item not found" }));
        return;
      }
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(item));
      return;
    }
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk: Buffer) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const { name, quantity, purchasedStatus } = JSON.parse(body);
          if (!name || typeof name !== "string") {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "Name is required" }));
            return;
          }
          if (quantity === undefined || typeof quantity !== "number") {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(
              JSON.stringify({
                error: "Quantity is required and must be a number",
              })
            );
            return;
          }
          if (!purchasedStatus || typeof purchasedStatus !== "boolean") {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "Purchase status is required" }));
            return;
          }
          const newItem = addItem(name, quantity, purchasedStatus);
          res.writeHead(201, { "content-type": "application/json" });
          res.end(JSON.stringify(newItem));
        } catch (error) {
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON payload" }));
        }
      });
      return;
    }
    if (req.method === "PUT" && id) {
      if (isNaN(id)) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid item ID" }));
        return;
      }
      let body = "";
      req.on("data", (chunk: Buffer) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const updates = JSON.parse(body);
          const allowedFields = ['name', 'quantity', 'purchasedStatus'];
          const validUpdates: any = {};
          
          // Validate and filter updates
          for (const [key, value] of Object.entries(updates)) {
            if (!allowedFields.includes(key)) {
              res.writeHead(400, { "content-type": "application/json" });
              res.end(JSON.stringify({ error: `Field '${key}' is not allowed for updates` }));
              return;
            }
            
            if (key === 'name' && (typeof value !== 'string' || value.trim() === '')) {
              res.writeHead(400, { "content-type": "application/json" });
              res.end(JSON.stringify({ error: "Name must be a non-empty string" }));
              return;
            }
            
            if (key === 'quantity' && (typeof value !== 'number' || value < 0)) {
              res.writeHead(400, { "content-type": "application/json" });
              res.end(JSON.stringify({ error: "Quantity must be a non-negative number" }));
              return;
            }
            
            if (key === 'purchasedStatus' && typeof value !== 'boolean') {
              res.writeHead(400, { "content-type": "application/json" });
              res.end(JSON.stringify({ error: "Purchased status must be a boolean" }));
              return;
            }
            
            validUpdates[key] = value;
          }
          
          const updatedItem = updateItem(id, validUpdates);
          if (!updatedItem) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "Item not found" }));
            return;
          }
          
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify(updatedItem));
        } catch (error) {
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON payload" }));
        }
      });
      return;
    }
    res.writeHead(405, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed on /items" }));
    return;
  }
};