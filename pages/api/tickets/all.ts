import { auth, firestore } from 'firebase-admin';
import { NextApiRequest, NextApiHandler, NextApiResponse } from 'next';
import initializeApi from '../../../lib/admin/init';
import { userIsAuthorized } from '../../../lib/authorization/check-authorization';

initializeApi();
const db = firestore();
const TICKET_COLLECTIONS = '/tickets';

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const userToken = req.headers['authorization'] as string;
  const isAuthorized = await userIsAuthorized(userToken, ['admin', 'super_admin']);

  if (!isAuthorized) {
    return res.status(403).json({
      msg: 'Request only available for admin',
    });
  }

  const snapshot = await firestore().collection(TICKET_COLLECTIONS).get();

  const tickets = [];
  snapshot.forEach((doc) => {
    tickets.push({
      ...doc.data(),
      ticketId: doc.id,
    });
  });
  return res.json(tickets);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'GET': {
      return handleGetRequest(req, res);
    }
    default: {
      return res.end();
    }
  }
}
