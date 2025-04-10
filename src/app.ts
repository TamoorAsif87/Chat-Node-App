import express, { Express } from "express";
import { ChatServer } from "./setupServer";
import databaseConnection from "./setupDatabase";
import { config } from "./config";

class Application {
  public initialize(): void {
    this.loadConfigs();
    databaseConnection();
    const app: Express = express();
    const server = new ChatServer(app);
    server.start();
  }

  private loadConfigs(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.initialize();
