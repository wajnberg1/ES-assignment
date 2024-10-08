import { Router, Request, Response, NextFunction } from 'express';
import { Client } from '@elastic/elasticsearch';

const router = Router();
const client = new Client({
  node: 'https://4516ac02d97c4bc9ab7475cc7aad374b.us-central1.gcp.cloud.es.io:443',
  auth: {
      apiKey: 'bzJHZFlwSUJ4V1MyTmVpNTMwcm06NjkzcDdubzRTN1M0WmNyeTNhM1N1dw=='
  }
});


// Fetch data from elasticsearch
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  
  
  if (req.body.id === undefined)
	throw new Error('id is missing');
	
  
  try {
    const id: string = req.body.id?.toString() || '';
	
	const response = await client.update({
			index: 'streets',
			id: id,
			body: {
				doc: {
					isDismissed: true
				}
			}
		})
	if (response) {
	  res.status(202).send("The request has been accepted for processing.");
	} else {
		throw new Error('The elasticsearch update failed');
	}
  } catch (error) {    
    next(error); // Pass the error to the error-handling middleware
  }
});

export default router;