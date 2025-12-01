import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5QOE00mNoDe03HN3B1Rrs__xUBjC7gO0",
  authDomain: "imdb-clone-akhi.firebaseapp.com",
  projectId: "imdb-clone-akhi",
  storageBucket: "imdb-clone-akhi.firebasestorage.app",
  messagingSenderId: "443182275102",
  appId: "1:443182275102:web:33c2eec8a9fac5edb3ec0f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
