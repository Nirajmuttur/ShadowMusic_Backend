import express from 'express';
import { getPlayList, getPlayListTracks } from '../controller/playListController.ts';
import { spotifyAuthMiddelware } from '../controller/authController.ts';

const router = express.Router();

/**
 * @swagger
 * components:
 *    schemas:
 *      Playlist: 
 *          type: object
 *          properties: 
 *              id:  
 *                  type: number 
 *              name:  
 *                  type: string
 *              images: 
 *                  type: array
 * 
 *      PlaylistTrack:
 *          type: object
 *          properties:
 *              name: 
 *                  type: string
 *              artist:
 *                  type: array
 *              image: 
 *                  type: object
 *                  additionalProperties:
 *                     $ref: '#components/schemas/Image'
 *      
 * 
 *      Image: 
 *          type: object
 *          properties:
 *              height: 
 *                  type: number
 *              url: 
 *                  type: string
 *              width: 
 *                  type: number
 *                                               
 */
/**
 * @swagger
 * /api/getPlayList:
 *   get:
 *     description: Get playlists
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#components/schemas/Playlist'
 */
router.route('/getPlayList').get(spotifyAuthMiddelware, getPlayList)

/**
 * @swagger
 * /api/playlists/{playlistId}/tracks:
 *   get:
 *     description: Get playlists Track
 *     parameters:
 *          - in: path
 *            name: playlistId
 *            required: true
 *            description: Playlist id
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#components/schemas/PlaylistTrack'
 */
router.route('/playlists/:playlistId/tracks').get(spotifyAuthMiddelware, getPlayListTracks)

export default router