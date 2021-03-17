import * as firebase from 'firebase';
import firebaseConfig from '../config/config'

firebase.default.initializeApp(firebaseConfig);

export default firebase;