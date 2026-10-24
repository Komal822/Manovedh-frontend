export const initialPartners = [
  { id: 1, name: 'Swapnil Ingle', role: 'School and Educational', exp: '20 yrs experience', rating: '0.00 (0 rating)', status: 'Accepting clients', bestMatch: true },
  { id: 2, name: 'Tasef Counselor', role: 'General & Counseling', exp: '0 yrs experience', rating: '0.00 (0 rating)', status: 'Accepting clients', bestMatch: false },
  { id: 3, name: 'Asura', role: 'General', exp: '0 yrs experience', rating: '0.00 (0 rating)', status: 'Accepting clients', bestMatch: false },
  { id: 4, name: 'Tejas Kale', role: 'Mind & Wellness', exp: '0 yrs experience', rating: '0.00 (0 rating)', status: 'Accepting clients', bestMatch: false },
  { id: 5, name: 'Ganesh Mali', role: 'Counseling', exp: '0 yrs experience', rating: '0.00 (0 rating)', status: 'Accepting clients', bestMatch: false },
  { id: 6, name: 'Dejijov Pejwar', role: 'General', exp: '0 yrs experience', rating: '0.00 (0 rating)', status: 'Accepting clients', bestMatch: false },
  { id: 7, name: 'Dr. Ananya Deshmukh', role: 'Mental Well-being & Stress', exp: '8 yrs experience', rating: '4.90 (42 ratings)', status: 'Accepting clients', bestMatch: false },
  { id: 8, name: 'Rohan Kulkarni', role: 'Career & Youth Support', exp: '5 yrs experience', rating: '4.80 (28 ratings)', status: 'Accepting clients', bestMatch: false },
  { id: 9, name: 'Sneha Joshi', role: 'Family & Relationships', exp: '12 yrs experience', rating: '4.95 (60 ratings)', status: 'Accepting clients', bestMatch: false },
];

export const initialNotifications = [
  { id: 1, category: 'Appointments', title: 'Upcoming Session', desc: 'John Smith has a session with you at 4:00 PM.', time: '10 minutes ago', section: 'Today', action: 'View Session', unread: true },
  { id: 2, category: 'Messages', title: 'New Message', desc: 'John Smith sent you a new message.', time: '25 minutes ago', section: 'Today', action: 'Open Chat', unread: true },
  { id: 3, category: 'Reminders', title: 'Appointment Reminder', desc: 'Your session with Emma Wilson is tomorrow at 11:00 AM.', time: '1 hour ago', section: 'Today', action: 'View Schedule', unread: true },
  { id: 4, category: 'Reminders', title: 'Follow-up Reminder', desc: "David Brown's follow-up is due today.", time: 'Yesterday', section: 'Yesterday', action: 'View Patient', unread: false },
  { id: 5, category: 'Appointments', title: 'Session Completed', desc: 'Session with Sarah completed successfully.', time: 'Yesterday', section: 'Yesterday', action: 'View Record', unread: false },
  { id: 6, category: 'Appointments', title: 'New Appointment Request', desc: 'Emma Wilsons requested a session for 12 Oct, 11:00 AM.', time: '2 days ago', section: 'Earlier', action: 'View Request', unread: false },
];

export const initialProfessionals = [
  { id: 1, name: 'Swapnil Ingle', role: 'School and Educational', exp: '20 yrs experience', rating: '0.00 (0 rating)', status: 'Accepting clients' },
  { id: 2, name: 'Tasef Counselor', role: 'General & Counseling', exp: '0 yrs experience', rating: '0.00 (0 rating)', status: 'Accepting clients' },
];

export const moodsList = [
  { id: 'happy', label: 'Happy', desc: 'Positive and light', icon: '😊' },
  { id: 'calm', label: 'Calm', desc: 'Balanced and steady', icon: '😌' },
  { id: 'sad', label: 'Sad', desc: 'Low or heavy', icon: '🌧️' },
  { id: 'anxious', label: 'Anxious', desc: 'Restless mind', icon: '🪐' },
  { id: 'stressed', label: 'Stressed', desc: 'Pressure or tension', icon: '⚡' },
  { id: 'tired', label: 'Tired', desc: 'Low energy', icon: '💤' },
];

export const stepsData = {
  1: { title: 'Observe & Describe', subtitle: 'Step 1 of 4', sceneTitle: 'Scene 1', question: 'Observe the scene and describe everything you see in your own words.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800' },
  2: { title: 'Read & Express', subtitle: 'Step 2 of 4', sceneTitle: 'Scene 2', question: 'What do you think is happening in the story? Explain your thoughts.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800' },
  3: { title: 'Think & Reflect', subtitle: 'Step 3 of 4', sceneTitle: 'Scene 3', question: 'What do you think might happen next in this situation?', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800' },
  4: { title: 'Act & Grow', subtitle: 'Step 4 of 4', sceneTitle: 'Scene 4', question: 'If you were in this situation, what would you do and why?', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800' },
};

export const phonationSounds = [
  { id: 1, label: 'आ', subtitle: 'आआआ', target: 'aa' },
  { id: 2, label: 'ई', subtitle: 'ईईई', target: 'ee' },
  { id: 3, label: 'ऊ', subtitle: 'ऊऊऊ', target: 'oo' },
  { id: 4, label: 'ए', subtitle: 'एएए', target: 'e' },
  { id: 5, label: 'ओ', subtitle: 'ओओओ', target: 'o' },
  { id: 6, label: 'म', subtitle: 'ममम', target: 'ma' },
  { id: 7, label: 'ह', subtitle: 'हहह', target: 'ha' },
];
