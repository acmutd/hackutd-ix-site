import { firestore } from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import initializeApi from '../../../lib/admin/init';
import { userIsAuthorized } from '../../../lib/authorization/check-authorization';

initializeApi();
const db = firestore();
const TICKET_COLLECTIONS = '/tickets';

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const userToken = req.headers['authorization'] as string;
  const isAuthorized = await userIsAuthorized(userToken, ['admin', 'super_admin']);

  if (!isAuthorized) {
    return res.status(403).json({
      msg: 'Request only available for admin',
    });
  }
  const { ticketId } = req.body;
  await db.collection(TICKET_COLLECTIONS).doc(ticketId).update({
    completed: true,
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
