import { RequestHandler } from "express";
import axios from "axios";
import convert from "xml-js";

export const getBookExist: RequestHandler = async (req, res, next) => {
  const { isbn } = req.query;
  const { data: xml } = await axios.get(
    "http://data4library.kr/api/bookExist",
    {
      params: {
        authKey: process.env.LIBRARY_AUTH_KEY,
        libCode: 146018,
        isbn13: isbn,
      },
    }
  );

  const jsonConverted = convert.xml2json(xml, {
    compact: true,
    spaces: 4,
    ignoreDeclaration: true,
  });
  return res.status(200).send(jsonConverted);
};
