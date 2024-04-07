import axios, { AxiosResponse } from "axios";
import { Request, Response } from "express";
import PlayListTrack from "../types/PlayListTrack.ts";
import PlayList from "../types/PlayList.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";

export const getPlayList = asyncHandler(async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  const accessToken = auth?.split(" ")[1];
  const response: AxiosResponse<any> = await axios.get(
    `${process.env.SPOTIFY_URL}/me/playlists`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (response.status === 200) {
    const playlists: PlayList[] = response.data.items.map((item: any) => ({
      id: item.id,
      images: item.images, // Assuming item.images is an array of images
      name: item.name,
    }));

    const responseData = {
      total: response.data.total,
      playlists,
    };
    return res.status(201).json(
      new ApiResponse(200, responseData)
    )
  }
  else {
    throw new ApiError(response.status, "Something went wrong")
  }

});

export const getPlayListTracks = asyncHandler(async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  const accessToken = auth?.split(" ")[1];
  let playlistId = req.params.playlistId;
  const response: AxiosResponse<any> = await axios.get(
    `${process.env.SPOTIFY_URL}/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (response.status === 200) {
    const trackDetails:PlayListTrack[] = response.data.items.map(
      (item: PlayListTrack) => {
        return {
          name: item.track.name + "-" + item.track.artists[0].name,
          artist: item.track.artists,
          images: item.track.images,
        };
      }
    );
    return res.status(201).json(
      new ApiResponse(200, trackDetails)
    )
  }
  else {
    throw new ApiError(response.status, "Something went wrong")
  }
}
);
