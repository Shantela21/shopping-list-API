import { createServer, IncomingMessage, ServerResponse } from "http";
import { itemsRoute } from "./routes/items";
const PORT = 4000;
const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  console.log(req.url, "url");
  if (req.url?.startsWith("/items")) {
    // route handler
    itemsRoute(req, res);
  } else {
    //  send only one response
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Items not found!" }));
  }
};
const server = createServer(requestListener);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});