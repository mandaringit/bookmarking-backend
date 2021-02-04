import axios from "axios";
import convert from "xml-js";

export interface LibaryResponse {
  response: {
    result: {
      hasBook: {
        _text: string;
      };
      loanAvailable: {
        _text: string;
      };
    };
  };
}

export async function getLibraryStatus(libCode: string, isbn13: string) {
  try {
    const { data: xml } = await axios.get(
      "http://data4library.kr/api/bookExist",
      {
        params: {
          authKey: process.env.LIBRARY_AUTH_KEY,
          libCode,
          isbn13,
        },
      }
    );
    console.log(xml);
    // xml -> js 변환
    const jsConverted = convert.xml2js(xml, {
      compact: true,
      ignoreDeclaration: true,
    });

    const { response } = jsConverted as LibaryResponse;
    console.log(response);
    const hasBook = response.result.hasBook._text;
    const loanAvailable = response.result.loanAvailable._text;

    return { hasBook, loanAvailable };
  } catch (e) {
    console.log(e);
  }
}
