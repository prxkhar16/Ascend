/**
 * ASCEND Firebase Service Architecture
 * 
 * To connect your live Firebase project in Phase 2:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Enable Authentication (Google Sign-In provider)
 * 3. Enable Cloud Firestore
 * 4. Create a .env.local file in the project root with your credentials:
 * 
 * VITE_FIREBASE_API_KEY=your_api_key
 * VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
 * VITE_FIREBASE_PROJECT_ID=your_project_id
 * VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
 * VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
 * VITE_FIREBASE_APP_ID=your_app_id
 */

export interface FirebaseConfigStatus {
  isConfigured: boolean;
  projectId?: string;
}

export const getFirebaseConfigStatus = (): FirebaseConfigStatus => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  return {
    isConfigured: Boolean(apiKey && projectId && apiKey !== 'your_api_key'),
    projectId: projectId || undefined,
  };
};

/**
 * Authentication interface
 * Supports seamless toggle between real Google Auth and simulated local mode
 */
export async function signInWithGoogle() {
  const status = getFirebaseConfigStatus();
  
  if (!status.isConfigured) {
    // Graceful simulated authentication for Phase 1 / Demo mode
    return {
      uid: 'ascend-usr-001',
      displayName: 'Alex Thorne',
      email: 'alex.ascend@lifeos.internal',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      isDemo: true,
    };
  }

  // Phase 2: Will invoke real firebase/auth signInWithPopup
  throw new Error('Firebase credentials detected. Initializing live auth in Phase 2.');
}
