import axios from "axios";
import { Request, Response } from "express";
import  PlayList from './../types/playList'
export const getPlayList = async (req: Request, res: Response) => {
  let auth = req.headers.authorization;
  let access_token: string[] | undefined = auth?.split(" ");
  if (access_token) {
    const getPlayList = await axios.get(
      `${process.env.SPOTIFY_URL}/me/playlists`,
      {
        headers: {
          Authorization: `Bearer ${access_token[1]}`,
        },
      }
    );
    if (getPlayList.status === 401) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    } else {
      return res.status(200).json(getPlayList.data);
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export const getPlayListTracks = async (req: Request, res: Response) => {
  let auth = req.headers.authorization;
  let access_token = auth?.split(" ");
  let playlistId = req.params.playlistId;
  if (access_token) {
    const getPlayListTracks = await axios.get(
      `${process.env.SPOTIFY_URL}/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${access_token[1]}`,
        },
      }
    );
    if (getPlayListTracks.status === 401) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    } else {
      let trackNames = getPlayListTracks?.data.items.map((item: PlayList) => {
        return item.track.name + "-" + item.track.artists[0].name;
      });
      return res.status(200).json(trackNames);
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};