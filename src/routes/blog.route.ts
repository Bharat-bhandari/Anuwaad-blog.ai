import { Router } from "express";
import { login, register } from "../controller/auth.controller";
import { addBlogs, getParentBlog } from "../controller/blog.controller";

const router = Router();

router.route("/:id/:lang").get(getParentBlog);
router.route("/add-blog").post(addBlogs);

export default router;
