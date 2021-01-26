module.exports = {
  type: "mysql",
  host: process.env.RDS_HOSTNAME || "localhost",
  username: process.env.RDS_USERNAME || "root",
  password: process.env.RDS_PASSWORD || "1234",
  port: process.env.RDS_PORT || 3306,
  database: "bookmarking" || "todo",
  synchronize: true,
  timezone: "+09:00",
  logging: false,
  entities: ["entity/**/*.js", "src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
