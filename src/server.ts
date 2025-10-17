import { createServer, IncomingMessage, ServerResponse } from "http";
import { itemsRoute } from "./routes/items";
import { ResponseHandler } from "./utils/responses";
const PORT = 4000;
const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  console.log(req.url, "url");
  if (req.url?.startsWith("/items")) {
    // route handler
    itemsRoute(req, res);
  } else {
    //  send only one response
    ResponseHandler.notFound(res, "Route not found");
  }
};
const server = createServer(requestListener);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});