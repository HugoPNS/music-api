import { Request, Response } from 'express';
import * as moods from '../daos/moodsDAO';

export async function getMoods(_req: Request, res: Response) {
  res.json(await moods.readAll());
}
