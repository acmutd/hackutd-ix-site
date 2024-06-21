import { firestore } from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import initializeApi from '../../../lib/admin/init';

initializeApi();
const db = firestore();
const TICKET_COLLECTIONS = '/tickets';

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const doc = await db.collection(TICKET_COLLECTIONS).add({
    ...req.body,
    ticketClaimer: {
      id: '',
      firstName: '',
      lastName: '',
    },
    completed: false,
  });
  return res.json({
    ticketId: doc.id,
  });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'POST': {
      return handlePostRequest(req, res);
    }
    default: {
      return res.end();
    }
  }
}
