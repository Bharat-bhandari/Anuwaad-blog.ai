import prismaClient from "../config/dbConfig";
import AsyncHandler from "../utils/asyncHandler";

export const getParentBlog = AsyncHandler(async (req, res) => {
  const { id, lang } = req.params;

  if (lang === "en") {
    const blog = await prismaClient.blog.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (blog) {
      res.render("blogView", {
        blog: {
          title: blog.title,
          content: blog.content,
          user: blog.user,
          imageUrl: blog.image,
        },
        language: "en",
      });
    }
  } else {
    const translation = await prismaClient.blogTranslation.findFirst({
      where: {
        language: lang,
        blogId: id,
      },
      include: {
        blog: {
          include: { user: true },
        },
      },
    });

    if (translation) {
      res.render("blogView", {
        blog: {
          title: `Translation (${lang}) of ${translation.blog.title}`,
          content: translation.content,
          user: translation.blog.user,
          imageUrl: translation.blog.image,
        },
        language: lang,
      });
    }
  }
});
