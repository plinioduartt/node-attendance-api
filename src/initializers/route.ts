import express, { Router } from "express";
import usersRouter from "../routes/users/users.routes";

const routes: Router = express.Router();
routes.use(usersRouter);
routes.use(express.json());

export default routes;
