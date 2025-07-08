const SECRET: string = process.env.JWT_SECRET as string;
if (!SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}
export { SECRET };
