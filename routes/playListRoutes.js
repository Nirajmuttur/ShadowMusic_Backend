import express from 'express';
import { getPlayList,getPlayListTracks } from '../controller/playListController.js';

const router = express.Router();

router.route('/getPlayList').get(getPlayList)
router.route('/playlists/:playlistId/tracks').get(getPlayListTracks)

export default router