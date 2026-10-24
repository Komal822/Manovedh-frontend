# Manovedh – Consent, Profile & Wellness Dashboard

## Included flow
- Existing consent flow and two-step profile flow are retained.
- First successful profile save opens Wellness Check.
- Wellness Check includes mood selection, expression note and Start Activity.
- Four sequential reflection stages: Observe & Describe, Read & Express, Think & Reflect, Act & Grow.
- Completing the four stages opens an activity-complete modal with Continue Activities and Go to Dashboard.
- Continue Activities opens Voice Phonation with seven Devanagari prompts (आ, ई, ऊ, ए, ओ, म, ह), microphone recording controls and progress.
- Completing all seven prompts opens the final completion modal.
- Go to Dashboard opens the welcome modal on first visit, with Start First Check-in and Explore Dashboard First actions.
- Responsive sidebar, mobile navigation and dashboard shell.

## Run
```bash
npm install
npm run dev
```

## Important integration notes
This source archive originally contained only the consent/profile React flow. It did not contain the production dashboard, Firebase setup, Firebase Authentication, Firestore rules, or a voice-analysis service. Therefore this implementation uses localStorage for demo progress and profile persistence. It does not claim to save data to Firebase or perform clinical/AI voice analysis.

The microphone control requests browser microphone permission and records audio locally in the active browser session. No recording is uploaded or analyzed. Add the project's Firebase client configuration, authenticated UID-based Firestore services, security rules, and a verified voice-analysis API before production deployment.
