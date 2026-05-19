import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { Platform } from "react-native";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { auth } from "./config";
import { getRequiredEnv } from "@/utils/env";

const GOOGLE_WEB_CLIENT_ID = getRequiredEnv("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID");

let googleSignInConfigured = false;

function configureGoogleSignIn() {
  if (googleSignInConfigured) return;

  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });
  googleSignInConfigured = true;
}

export function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  configureGoogleSignIn();
  await GoogleSignin.signOut().catch(() => null);
  return firebaseSignOut(auth);
}

export function subscribeToAuthState(
  callback: (user: FirebaseUser | null) => void
) {
  return onAuthStateChanged(auth, callback);
}

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getIdToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export function signInWithGoogleCredential(
  idToken: string,
  accessToken?: string
) {
  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  return signInWithCredential(auth, credential);
}

export async function signInWithGoogle() {
  configureGoogleSignIn();

  if (Platform.OS === "android") {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) {
    return { cancelled: true as const };
  }

  const { idToken } = response.data;
  if (!idToken) {
    throw new Error("Google sign-in did not return an id token.");
  }

  const tokens = await GoogleSignin.getTokens().catch(() => null);
  const userCredential = await signInWithGoogleCredential(
    idToken,
    tokens?.accessToken
  );

  return { cancelled: false as const, userCredential };
}

export function isGoogleSignInCancelled(error: unknown) {
  return isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED;
}
