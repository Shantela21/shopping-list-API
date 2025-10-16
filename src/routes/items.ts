import { IncomingMessage, ServerResponse } from "http";
import { getItems, getItemById, addItem } from "../controller/items";
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
          const { name, quantity, category } = JSON.parse(body);
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
          if (!category || typeof category !== "string") {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "Category is required" }));
            return;
          }
          const newItem = addItem(name, quantity, category);
          res.writeHead(201, { "content-type": "application/json" });
          res.end(JSON.stringify(newItem));
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