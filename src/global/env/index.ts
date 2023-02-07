import development from "./dev";
import production from "./pro";

const envMap = {
  development,
  production,
};

const mode = (process.env.NODE_ENV as keyof typeof envMap) || "development";
const env = envMap[mode];

export default env;
