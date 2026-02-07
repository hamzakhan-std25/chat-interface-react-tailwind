import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithRedirect,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider
} from "firebase/auth";
import { toast } from "react-hot-toast"
import { auth } from "../firebase";

// Helper to check if the user is on a mobile device
const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  if (isMobile()) {
    toast.error("google btn clicked");
    return signInWithRedirect(auth, provider);
  }
  return signInWithPopup(auth, provider);
}

export async function loginWithGithub() {
  const provider = new GithubAuthProvider();
  if (isMobile()) {
    toast.error("github btn clicked");
    return signInWithRedirect(auth, provider);
  }
  return await signInWithPopup(auth, provider);
}

export function logout() {
  return signOut(auth);
}
