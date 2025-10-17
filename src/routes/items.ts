import { IncomingMessage, ServerResponse } from "http";
import { getItems, getItemById, addItem, updateItem, deleteItem } from "../controller/items";
import { ResponseHandler, ValidationHelper } from "../utils/responses";
// https://localhost:4000/items
export const itemsRoute = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith("/items")) {
    const parts = req.url.split("/");
    const id = parts[2] ? parseInt(parts[2]) : undefined;
    if (req.method === "GET" && !id) {
      const items = getItems();
      ResponseHandler.success(res, items, "Items retrieved successfully");
      return;
    }
    if (req.method === "GET" && id) {
      if (!ValidationHelper.isValidId(id)) {
        ResponseHandler.badRequest(res, "Invalid item ID");
        return;
      }
      const item = getItemById(id);
      if (!item) {
        ResponseHandler.notFound(res, "Item not found");
        return;
      }
      ResponseHandler.success(res, item, "Item retrieved successfully");
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
          
          if (!ValidationHelper.isValidString(name)) {
            ResponseHandler.badRequest(res, "Name is required and must be a non-empty string");
            return;
          }
          
          if (!ValidationHelper.isValidNumber(quantity)) {
            ResponseHandler.badRequest(res, "Quantity is required and must be a non-negative number");
            return;
          }
          
          if (!ValidationHelper.isValidBoolean(purchasedStatus)) {
            ResponseHandler.badRequest(res, "Purchase status is required and must be a boolean");
            return;
          }
          
          const newItem = addItem(name, quantity, purchasedStatus);
          ResponseHandler.created(res, newItem, "Item created successfully");
        } catch (error) {
          ResponseHandler.badRequest(res, "Invalid JSON payload");
        }
      });
      return;
    }
    if (req.method === "PUT" && id) {
      if (!ValidationHelper.isValidId(id)) {
        ResponseHandler.badRequest(res, "Invalid item ID");
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
              ResponseHandler.badRequest(res, `Field '${key}' is not allowed for updates`);
              return;
            }
            
            if (key === 'name' && !ValidationHelper.isValidString(value)) {
              ResponseHandler.badRequest(res, "Name must be a non-empty string");
              return;
            }
            
            if (key === 'quantity' && !ValidationHelper.isValidNumber(value)) {
              ResponseHandler.badRequest(res, "Quantity must be a non-negative number");
              return;
            }
            
            if (key === 'purchasedStatus' && !ValidationHelper.isValidBoolean(value)) {
              ResponseHandler.badRequest(res, "Purchased status must be a boolean");
              return;
            }
            
            validUpdates[key] = value;
          }
          
          const updatedItem = updateItem(id, validUpdates);
          if (!updatedItem) {
            ResponseHandler.notFound(res, "Item not found");
            return;
          }
          
          ResponseHandler.success(res, updatedItem, "Item updated successfully");
        } catch (error) {
          ResponseHandler.badRequest(res, "Invalid JSON payload");
        }
      });
      return;
    }
    if (req.method === "DELETE" && id) {
      if (!ValidationHelper.isValidId(id)) {
        ResponseHandler.badRequest(res, "Invalid item ID");
        return;
      }
      
      const deleted = deleteItem(id);
      if (!deleted) {
        ResponseHandler.notFound(res, "Item not found");
        return;
      }
      
      ResponseHandler.noContent(res);
      return;
    }
    ResponseHandler.methodNotAllowed(res, "Method not allowed on /items");
    return;
  }
 
};