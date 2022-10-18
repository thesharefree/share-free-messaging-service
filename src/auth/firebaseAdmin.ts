import * as firebase from 'firebase-admin';
import * as serviceAccount from './service-account.json';

const defaultApp = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://fir-auth-bd895.firebaseio.com',
});

export { defaultApp };
