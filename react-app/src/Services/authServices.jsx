import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup ,
  GithubAuthProvider
} from "firebase/auth";
import { auth } from "../firebase";

export function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function loginWithGithub() {
 const provider = new GithubAuthProvider();
  return await signInWithPopup(auth, provider);
}

export function logout() {
  return signOut(auth);
}
