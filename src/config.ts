import dotenv from "dotenv";
import bunyan from "bunyan";

dotenv.config({});

class Config {
  public Database_Url: string | undefined;
  public Node_Env: string | undefined;
  public Secret_Key1: string | undefined;
  public Secret_Key2: string | undefined;
  public Jwt: string | undefined;
  public Client_Url: string | undefined;
  public Redis_Url: string | undefined;

  constructor() {
    this.Database_Url = process.env.DATABASE_URL || "";
    this.Node_Env = process.env.NODE_ENV || "";
    this.Secret_Key1 = process.env.SECRET_KEY1 || "";
    this.Secret_Key2 = process.env.SECRET_KEY2 || "";
    this.Jwt = process.env.JWT_TOKEN || "";
    this.Client_Url = process.env.CLIENT_URL || "";
    this.Redis_Url = process.env.REDIS_URL || "";
  }

  public validateConfig(): void {
    for (const [key, val] of Object.entries(this)) {
      if (val === undefined) {
        throw new Error(`value of ${key} is not defined`);
      }
    }
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: "debug" });
  }
}

export const config: Config = new Config();
