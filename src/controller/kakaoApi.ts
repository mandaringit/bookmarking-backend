import axios from "axios";
import { RequestHandler } from "express";

export const searchBooks: RequestHandler<
  any,
  any,
  any,
  { query: string }
> = async (req, res, next) => {
  const { query } = req.query;
  const response = await axios.get("https://dapi.kakao.com/v3/search/book", {
    headers: {
      Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
    },
    params: {
      query,
    },
  });

  return res.status(200).send(response.data);
};
