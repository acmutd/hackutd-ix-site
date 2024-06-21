import { auth, firestore } from 'firebase-admin';
import { NextApiRequest, NextApiHandler, NextApiResponse } from 'next';
import initializeApi from '../../../lib/admin/init';

initializeApi();
const db = firestore();
const TICKET_COLLECTIONS = '/tickets';
const REGISTRATION_COLLECTION = '/registrations';

async function getUserId(token: string) {
  if (!token) return null;
  const payload = await auth().verifyIdToken(token);
  const snapshot = await firestore()
    .collection(REGISTRATION_COLLECTION)
    .where('id', '==', payload.uid)
    .get();
  if (snapshot.empty) return null;
  return payload.uid;
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const userToken = req.headers['authorization'] as string;
  const userId = await getUserId(userToken);

  const snapshot = await firestore()
    .collection(TICKET_COLLECTIONS)
    .where('ticketCreator.id', '==', userId)
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
    case 'GET': {
      return handleGetRequest(req, res);
    }
    default: {
      return res.end();
    }
  }
}
