import axios, { AxiosResponse } from "axios";
import { NextFunction, Request, Response } from "express";
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

export const syncPlayList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
    const playlists: any[] = [];

    for (const item of response.data.items) {
      const images = await Promise.all(item.images.map(async (image: Image) => {
        const filter = { url: image.url };
        const update = {
          $setOnInsert: {
            height: image.height,
            width: image.width
          }
        };
        const options = { upsert: true, new: true };
        return await ImageModel.findOneAndUpdate(filter, update, options);
      }))
      const playlistData: PlayList = {
        spotifyPlayListId: item.id,
        images: images.map(({ _id }) => _id),
        name: item.name,
      };
      playlists.push({
        updateOne: {
          filter: { spotifyPlayListId: playlistData.spotifyPlayListId },
          update: playlistData,
          upsert: true
        }
      });
    }
    await Playlist.bulkWrite(playlists);
    const allPlaylists = await Playlist.find({}).populate('images');
    return res.status(201).json(
      new ApiResponse(200, allPlaylists)
    )
  }
  else {
    throw new ApiError(response.status, "Something went wrong")
  }

});

export const syncPlayListTracks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
    const playList = await Playlist.findOne({ spotifyPlayListId: playlistId });
    const playlistTracksToUpdate: any[] = [];
    for (const item of response.data.items) {

      const artistsPromises = await Promise.all(item.track.artists.map(async (artist: Artist) => {
        const filter = { spotifyArtistId: artist.id };
        const update = { $setOnInsert: { name: artist.name } };
        const options = { upsert: true, new: true };
        const savedArtist = await Artists.findOneAndUpdate(filter, update, options);
        return savedArtist?._id;
      }))

      const imageIds = await Promise.all(item.track.album.images.map(async (image: Image) => {
        const filter = { url: image.url };
        const update = { $setOnInsert: { height: image.height, width: image.width } };
        const options = { upsert: true, new: true };
        const savedImage = await ImageModel.findOneAndUpdate(filter, update, options);
        return savedImage?._id;
      }));

      const playlistTrackData = {
        spotifyTrackId: item.track.id,
        name: item.track.name + "-" + item.track.artists[0].name,
        artist: artistsPromises,
        albums: imageIds,
        playlistId: playList?._id
      };

      playlistTracksToUpdate.push({
        updateOne: {
          filter: { spotifyTrackId: playlistTrackData.spotifyTrackId },
          update: playlistTrackData,
          upsert: true
        }
      });
    };

    await PlayListTrackModel.bulkWrite(playlistTracksToUpdate);
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