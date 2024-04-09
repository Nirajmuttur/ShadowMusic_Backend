import axios, { AxiosResponse } from "axios";
import { Request, Response } from "express";
import PlayListTrack from "../types/PlayListTrack.ts";
import PlayList from "../types/PlayList.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import Artist from "../types/Artist.ts";
import { Playlist } from "../models/playlist.model.ts";
import Image from "../types/Image.ts";
import { ImageModel } from "../models/images.model.ts";

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
    const playlists: PlayList[] = [];
    
    for(const item of response.data.items){
      const images = await Promise.all(item.images.map(async(image:Image)=>{
        const imgModel = new ImageModel({
          height: image.height,
          url: image.url,
          width: image.width
        })
        return await imgModel.save()
        
      }))
      const playlistData = {
        spotifyPlayListId: item.id,
        images: images.map(({ _id }) => _id),
        name: item.name,
      };
      playlists.push(playlistData);
    }
    await Playlist.insertMany(playlists);
    const allPlaylists = await Playlist.find({}).populate('images');
    return res.status(201).json(
      new ApiResponse(200, allPlaylists)
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
    const trackDetails = response.data.items.map(
      (item :PlayListTrack) => {
        const artists = item.track.artists.map((artist:Artist)=>{
          return {
            id: artist.id,
            name: artist.name
          }
        })
        return {
          name: item.track.name + "-" + item.track.artists[0].name,
          artist: artists,
          images: item.track.album.images,
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
