const admin = require('firebase-admin');

async function main() {
  // do something here
  require('dotenv').config({
    path: './.env.local',
  });
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID,
      clientEmail: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
      privateKey: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
  const db = admin.firestore();

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
