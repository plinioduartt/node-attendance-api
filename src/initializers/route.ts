import express, { Router } from "express";
import attendancesRouter from "../routes/attendances/attendances.route";
import administratorsRouter from "../routes/users/administrators.route";
import attendantsRouter from "../routes/users/attendants.route";
import customersRouter from "../routes/users/customers.route";

const routes: Router = express.Router();

routes.use(express.json());

routes.use([
    administratorsRouter,
    attendantsRouter,
    customersRouter,
    attendancesRouter
]);

if (process.env.NODE_ENV !== "test") {
    console.info('All routes has been initialized succesfully.');
}

export default routes;
