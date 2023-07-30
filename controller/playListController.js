import axios from "axios";

export const getPlayList = async (req, res) => {
  let auth = req.headers.authorization;
  let access_token = auth.split(" ");
  let userId = req.params.userId;
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
};

export const getPlayListTracks = async (req, res) => {
  let auth = req.headers.authorization;
  let access_token = auth.split(" ");
  let playlistId = req.params.playlistId;
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
    return res.status(200).json(getPlayListTracks.data);
  }
};
