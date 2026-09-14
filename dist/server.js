import app from "./app";
import { logger } from "./utils/logger";
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`🚀 Server started on port ${PORT} | ENV: ${config.NODE_ENV}`);
});
//# sourceMappingURL=server.js.map
