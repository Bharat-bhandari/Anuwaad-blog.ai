import { Router } from "express";
import { login, register } from "../controller/auth.controller";
import { getParentBlog } from "../controller/blog.controller";

const router = Router();

router.route("/:id/:lang").get(getParentBlog);

export default router;
