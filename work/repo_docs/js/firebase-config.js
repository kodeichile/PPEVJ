import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { browserLocalPersistence, getAuth, setPersistence } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBI-FSFigW-9gEH2qkx18IvN00HEbdaic4",
  authDomain: "recuperacion-de-correos.firebaseapp.com",
  projectId: "recuperacion-de-correos",
  storageBucket: "recuperacion-de-correos.firebasestorage.app",
  messagingSenderId: "257088486036",
  appId: "1:257088486036:web:fb989905fe893ab1d25281",
  measurementId: "G-59XB1VRJG8"
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const authPersistenceReady = setPersistence(auth, browserLocalPersistence).catch(() => null);
