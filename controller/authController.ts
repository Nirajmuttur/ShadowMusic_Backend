import querystring from "querystring";
import axios from "axios";
import { Request, Response } from "express";
function generateRandomString(length: number) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export const authenticate = (req: Request, res: Response) => {
  var state = generateRandomString(16);
  var scope = "user-read-private user-read-email";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URL,
        state: state,
      })
  );
};

export const redirect = async (req: Request, res: Response) => {
  var code: string = <string>req.query.code || "";
  var state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    const spotifyResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URL,
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.SPOTIFY_CLIENT_ID +
                ":" +
                process.env.SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const userDetails = await axios.get(`${process.env.SPOTIFY_URL}/me`, {
      headers: {
        Authorization: `Bearer ${spotifyResponse.data.access_token}`,
      },
    });
    let data = {
      token: spotifyResponse.data,
      userDetails: userDetails.data,
    };
    return res.status(200).json(data);
  }
};
