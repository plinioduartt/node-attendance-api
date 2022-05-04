import application from "./initializers/application";
const PORT = process.env.PORT ?? 3000;

application.listen(PORT, () => console.info(`Server listening on port ${PORT}`));