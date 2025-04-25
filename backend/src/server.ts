import app from "./app";
import EnvConfig from "./config/envconfig";

const PORT: number = EnvConfig.httpPort();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
