import express from 'express';
import { getPlayList,getPlayListTracks } from '../controller/playListController.ts';
import { spotifyAuthMiddelware } from '../controller/authController.ts';

const router = express.Router();

router.route('/getPlayList').get(spotifyAuthMiddelware,getPlayList)
router.route('/playlists/:playlistId/tracks').get(spotifyAuthMiddelware,getPlayListTracks)

export default router