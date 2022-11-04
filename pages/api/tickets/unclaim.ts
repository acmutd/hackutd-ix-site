import { firestore } from 'firebase-admin';
import { NextApiRequest, NextApiHandler, NextApiResponse } from 'next';
import initializeApi from '../../../lib/admin/init';

initializeApi();
const db = firestore();
const TICKET_COLLECTIONS = '/tickets';

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { ticketId } = req.body;
  await db.collection(TICKET_COLLECTIONS).doc(ticketId).update({
    'ticketClaimer.id': '',
    'ticketClaimer.firstName': '',
    'ticketClaimer.lastName': '',
  });
  return res.json({
    msg: 'Ticket update completed',
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
