import {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from "express";
import http from "http";
import cookieSession from "cookie-session";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import compression from "compression";
import { config } from "./config";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import applicationRoutes from "./routes";
import { CustomerError, IErrorResponse } from "./shared/globals/error-handler";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import Logger from "bunyan";

const PORT = 5000;
const logger: Logger = config.createLogger("Server");

export class ChatServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddlerware(this.app);
    this.startServer(this.app);
    this.errorHandler(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: "session",
        keys: [`${config.Secret_Key1}`, `${config.Secret_Key2}`],
        maxAge: 24 * 7 * 60 * 60,
        secure: config.Node_Env !== "development",
      })
    );
    app.use(hpp());
    app.use(helmet());

    app.use(
      cors({
        origin: `${config.Client_Url}`,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "PUT", "OPTIONS", "DELETE"],
      })
    );
  }
  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true, limit: "50mg" }));
    app.use(morgan("dev"));
  }
  private routesMiddlerware(app: Application): void {
    applicationRoutes(app);
  }
  private errorHandler(app: Application): void {
    app.use((req: Request, response: Response) => {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `${req.originalUrl} not found.` });
    });

    app.use(
      (
        err: IErrorResponse,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        if (err instanceof CustomerError) {
          res.status(err.statusCode).json(err.serializeErrors());
          return;
        }

        next();
      }
    );
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocket(httpServer);
      this.startHttpServer(httpServer);
      this.socketConnections(socketIO);
    } catch (error) {
      logger.error(error);
    }
  }
  private async createSocket(http: http.Server): Promise<Server> {
    const io: Server = new Server(http, {
      cors: {
        origin: config.Client_Url,
        methods: ["GET", "POST", "PUT", "PUT", "OPTIONS", "DELETE"],
      },
    });

    const pubClient = createClient({ url: config.Redis_Url });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient, subClient]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(http: http.Server): void {
    http.listen(PORT, () => logger.info(`Http is listening to Port ${PORT}`));
  }

  private socketConnections(io: Server): void {}
}
