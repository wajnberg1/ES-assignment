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
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const { searchQuery, searchType } = req.query;
  
  if (searchQuery === undefined)
	throw new Error('searchQuery parameter is missing');
	
  if (searchType === undefined)
	throw new Error('searchType parameter is missing');
  
  try {
    const query: string = searchQuery?.toString() || '';
	const typeSearch: number = parseInt(searchType?.toString() || '');
	var queryObject: any;
	
	if (typeSearch === 0) {
		queryObject = {
			index: 'streets',
			body: {
				query: {
				  bool: {
				    must: [
					{
					  term: {
						'שם ראשי': query
					  }
					}
				  ],
				  must_not: [
					{
					  exists: {
                       field: 'isDismissed'
                      }
                    }
                  ]
				}
              }				
			}
		};
	}
	else if (typeSearch === 1) {
		queryObject = {
			index: 'streets',
			body: {
				query: {
				  bool: {
				    must: [
					{
					  multi_match: {
						query: query,
						type: 'best_fields'
					  }
					}
				  ],
					must_not: [
					{
					  exists: {
                       field: 'isDismissed'
                      }
                    }
                  ]
				}	
			}
		  }
		};
	}
	else if (typeSearch === 2) {
		queryObject = {
			index: 'streets',
			body: {
				query: {
				  bool: {
				    must: [
					{
					  multi_match: {
						query: query,
						type: 'best_fields',
						operator: 'and'
					  }
					}
				  ],
					must_not: [
					{
					  exists: {
                       field: 'isDismissed'
                      }
                    }
                  ]
			   }	
			}
		  }
		};
	}
	
	else {
		throw new Error('Wrong value for searchType parameter. Can only take 0,1 or 2');
	}

    const response = await client.search(queryObject);	
    res.json(response.hits.hits);
  } catch (error) {    
    next(error); // Pass the error to the error-handling middleware
  }
});

export default router;