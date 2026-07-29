import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBnJJbKkBPPzjhJLkmT2zcuMfXO2n0T6vg",
  authDomain: "expoguide2026.firebaseapp.com",
  projectId: "expoguide2026",
  storageBucket: "expoguide2026.firebasestorage.app",
  messagingSenderId: "784740858575",
  appId: "1:784740858575:web:b80b36dd5d38126dcb95ba",
  measurementId: "G-XEZBRMFSLT",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  logEvent(analytics, eventName, params);
}

export function trackPageView(pageName: string) {
  logEvent(analytics, "page_view", { page_title: pageName });
}

export function trackPavilionView(pavilionName: string, country: string) {
  logEvent(analytics, "select_content", {
    content_type: "pavilion",
    item_id: pavilionName,
    country,
  });
}

export function trackChatStarted() {
  logEvent(analytics, "chat_started");
}

export function trackInterestSelected(interest: string) {
  logEvent(analytics, "interest_selected", { interest });
}
