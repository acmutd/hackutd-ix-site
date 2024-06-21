import { firestore } from 'firebase-admin';
import { NextApiRequest, NextApiHandler, NextApiResponse } from 'next';
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
    'ticketClaimer.id': '',
    'ticketClaimer.firstName': '',
    'ticketClaimer.lastName': '',
  });
  return res.json({
    msg: 'Ticket update completed',
  });
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const userToken = req.headers['authorization'] as string;
  const isAuthorized = await userIsAuthorized(userToken, ['admin', 'super_admin']);

  if (!isAuthorized) {
    return res.status(403).json({
      msg: 'Request only available for admin',
    });
  }

  const snapshot = await firestore()
    .collection(TICKET_COLLECTIONS)
    .where('completed', '==', false)
    .get();

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
    case 'POST': {
      return handlePostRequest(req, res);
    }
    case 'GET': {
      return handleGetRequest(req, res);
    }
    default: {
      return res.end();
    }
  }
}
