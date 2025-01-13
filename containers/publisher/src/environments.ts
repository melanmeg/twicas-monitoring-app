import "./dotenv.js";

export class Config {
  static readonly RABBITMQ_URL: string = process.env.RABBITMQ_URL!;

  static readonly RABBITMQ_PORT: string = process.env.RABBITMQ_PORT!;

  static readonly RABBITMQ_USER: string = process.env.RABBITMQ_USER!;

  static readonly RABBITMQ_PASSWORD: string = process.env.RABBITMQ_PASSWORD!;

  static readonly PORT_NUM: number = parseInt(process.env.PORT_NUM!, 10);
}
