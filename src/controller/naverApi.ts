import { RequestHandler } from "express";
import axios from "axios";

export const searchBooks: RequestHandler<
  any,
  any,
  any,
  { query: string }
> = async (req, res, next) => {
  const { query } = req.query;
  const response = await axios.get(
    "https://openapi.naver.com/v1/search/book.json",
    {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_API_ID,
        "X-Naver-Client-Secret": process.env.NAVER_API_SECRET,
      },
      params: {
        query,
      },
    }
  );

  return res.status(200).send(response.data);
};
