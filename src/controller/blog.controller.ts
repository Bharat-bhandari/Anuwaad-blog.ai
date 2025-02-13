import prismaClient from "../config/dbConfig";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import AsyncHandler from "../utils/asyncHandler";

type BlogPayload = {
  lang: string;
  title: string;
  desc: string;
  image?: string;
};

type CreateBlogPayload = BlogPayload[];

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
          title: translation.title,
          content: translation.content,
          user: translation.blog.user,
          imageUrl: translation.blog.image,
        },
        language: lang,
      });
    }
  }
});

export const addBlogs = AsyncHandler(async (req, res) => {
  const blogData: CreateBlogPayload = req.body.data;

  const userId = "1491ffd2-a439-4b57-8255-8506f07b2ce6";
  const englishEntry = blogData[0];

  if (!englishEntry) {
    throw new ApiError(400, "No English (en) entry provided.");
  }

  const translationEntries = blogData.filter((item) => item.lang !== "en");

  const parentData = {
    title: englishEntry.title,
    content: englishEntry.desc,
    image: englishEntry.image ?? "",
    userId: userId, // the user who owns this blog
    isDraft: false,
    translations: {
      create: translationEntries.map((item) => ({
        language: item.lang,
        title: item.title, // if you keep separate translation title
        content: item.desc,
      })),
    },
  };

  const newBlog = await prismaClient.blog.create({
    data: parentData,
    include: {
      translations: true, // so we can see them in the returned object
    },
  });

  res.status(200).json(new ApiResponse(200, {}, "Blog added successfully"));
});
