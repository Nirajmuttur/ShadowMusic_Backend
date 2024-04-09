import axios, { AxiosResponse } from "axios";
import { NextFunction, Request, Response } from "express";
import PlayListTrack from "../types/PlayListTrack.ts";
import PlayList from "../types/PlayList.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import Artist from "../types/Artist.ts";
import { Playlist } from "../models/playlist.model.ts";
import Image from "../types/Image.ts";
import { ImageModel } from "../models/images.model.ts";
import { Artists } from "../models/artist.model.ts";
import { PlayListTrackModel } from "../models/playlistTracks.model.ts";

export const getPlayList = asyncHandler(async (req: Request, res: Response,next:NextFunction) => {
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

export const getPlayListTracks = asyncHandler(async (req: Request, res: Response,next:NextFunction) => {
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
    const playListId = await Playlist.findOne({spotifyPlayListId:playlistId})
    const playlistTracks = await Promise.all(response.data.items.map(async(item: PlayListTrack) => {
      const artistsPromises = await Promise.all(item.track.artists.map(async (artist: Artist) => {
        // Save artists and get IDs
        const savedArtist = await new Artists({
          spotifyArtistId: artist.id,
          name: artist.name
        }).save()
        return savedArtist._id;
      }))

      const imageIds = await Promise.all(item.track.album.images.map(async (image: Image) => {
        const savedImage = await new ImageModel({
          height: image.height,
          url: image.url,
          width: image.width
        }).save()
        return savedImage._id;
      }));
      return {
        name: item.track.name + "-" + item.track.artists[0].name,
        artist: artistsPromises,
        albums: imageIds,
        playlistId: playListId?._id
      };
    }));

    await PlayListTrackModel.insertMany(playlistTracks);
    const allTracks = await PlayListTrackModel.find({}).populate('artist').populate('albums')
    return res.status(201).json(
      new ApiResponse(200, allTracks)
    )
  }
  else {
    throw new ApiError(response.status, "Something went wrong")
  }
}
);