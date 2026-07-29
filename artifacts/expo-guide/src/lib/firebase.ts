import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: "expoguide2026.firebaseapp.com",
  projectId: "expoguide2026",
  storageBucket: "expoguide2026.firebasestorage.app",
  messagingSenderId: "784740858575",
  appId: "1:784740858575:web:b80b36dd5d38126dcb95ba",
  measurementId: "G-XEZBRMFSLT",
};

let analytics: Analytics | null = null;

try {
  const app = initializeApp(firebaseConfig);
  isSupported().then((supported) => {
    if (supported && firebaseConfig.apiKey) {
      analytics = getAnalytics(app);
    }
  });
} catch {
  // Firebase unavailable — analytics disabled
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (!analytics) return;
  try { logEvent(analytics, eventName, params); } catch { /* silent */ }
}

export function trackPageView(pageName: string) {
  trackEvent("page_view", { page_title: pageName });
}

export function trackPavilionView(pavilionName: string, country: string) {
  trackEvent("select_content", { content_type: "pavilion", item_id: pavilionName, country });
}

export function trackChatStarted() {
  trackEvent("chat_started");
}

export function trackInterestSelected(interest: string) {
  trackEvent("interest_selected", { interest });
}
