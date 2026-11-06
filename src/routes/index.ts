import { Router } from 'express';
import { asyncHandler as h } from '../controllers/helpers';
import * as a from '../controllers/albumsController';
import { getMoods } from '../controllers/moodsController';

const router = Router();

router.get('/moods', h(getMoods));

router.get('/albums', h(a.getAlbums));
router.post('/albums', h(a.createAlbum));
router.get('/albums/mood/:moodId', h(a.getAlbumsByMood)); // must come before /albums/:albumId
router.get('/albums/:albumId', h(a.getAlbum));
router.put('/albums/:albumId', h(a.updateAlbum));
router.delete('/albums/:albumId', h(a.deleteAlbum));

router.get('/albums/:albumId/mood', h(a.getEffectiveMood));
router.put('/albums/:albumId/mood', h(a.setDefaultMood));
router.put('/albums/:albumId/personal-mood', h(a.setPersonalMood));
router.delete('/albums/:albumId/personal-mood', h(a.deletePersonalMood));

export default router;
