export interface IDatabaseConfigAttributes {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  port?: number | string;
  dialect?: string;
  urlDatabase?: string;
}

export interface IDatabaseConfig {
  development: {
    default: IDatabaseConfigAttributes;
    transaction: IDatabaseConfigAttributes;
  };
  test: {
    default: IDatabaseConfigAttributes;
    transaction: IDatabaseConfigAttributes;
  };
  production: {
    default: IDatabaseConfigAttributes;
    transaction: IDatabaseConfigAttributes;
  };
}
