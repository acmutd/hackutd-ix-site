import { firestore } from 'firebase-admin';
import initializeApi from '../lib/admin/init';

async function main() {
  // do something here
  require('dotenv').config({
    path: './.env.local',
  });
  initializeApi();
  const db = firestore();

  const snapshot = await db.collection('/registrations').get();
  const users = [];
  snapshot.forEach((doc) => {
    users.push({
      id: doc.data().id,
      user: {
        firstName: doc.data().user.firstName,
        lastName: doc.data().user.lastName,
        permissions: doc.data().user.permissions,
      },
    });
  });
  await db.collection('/miscellaneous').doc('allusers').set({ users });
  console.log('Operation complete');
}
main();
export {};
