import { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import ProfModal from './ProfModal';
import DashboardPage from './Pages/DashboardPage';
import WellnessPage from './Pages/WellnessPage';
import JourneyPage from './Pages/JourneyPage';
import ActivityFlowPage from './Pages/ActivityFlowPage';
import VoicePhonationPage from './Pages/VoicePhonationPage';
import PartnerPage from './Pages/PartnerPage';
import SessionsPage from './Pages/SessionsPage';
import ChatsPage from './Pages/ChatsPage';
import NotificationsPage from './Pages/NotificationsPage';
import HelpPage from './Pages/HelpPage';
import ActivityPage from './Pages/ActivityPage';
import { initialNotifications } from '../data/dashboardData';

/*
  Flow:
  App.jsx: Informed Consent -> Profile -> Dashboard (opens on Wellness Check)
  Wellness Check -> Journey -> Activity Steps 1-4 -> Voice Phonation   (all inside Wellness)
  Sidebar "Activity" is a separate page and is not part of the wellness flow.
*/
export default function Dashboard({ profile, onExit }) {
  const [page, setPage] = useState('wellness'); // after profile, user lands on Wellness Check
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState(initialNotifications);
  const [modal, setModal] = useState({ prof: null, type: null });

  // shared across the wellness flow
  const [selectedMood, setSelectedMood] = useState('calm');
  const [expressionText, setExpressionText] = useState('I feel Nervous Today');
  const [activityStep, setActivityStep] = useState(1);
  const [completed, setCompleted] = useState([]);

  const displayName = profile?.firstName || 'Priya';
  const lastName = profile?.lastName || '';
  const unreadCount = notifications.filter((n) => n.unread).length;

  const go = useCallback((target, opts = {}) => {
    if (opts.step) setActivityStep(opts.step);
    if (target === 'journey' && opts.reset) setCompleted([]);
    setModal({ prof: null, type: null });
    setPage(target);
  }, []);

  const openProf = (prof, type) => setModal({ prof, type });
  const closeProf = () => setModal({ prof: null, type: null });
  const markStepDone = (s) => setCompleted((c) => (c.includes(s) ? c : [...c, s]));

  const renderPage = () => {
    switch (page) {
      case 'wellness':
        return <WellnessPage go={go} selectedMood={selectedMood} setSelectedMood={setSelectedMood} expressionText={expressionText} setExpressionText={setExpressionText} />;
      case 'journey':
        return <JourneyPage go={go} selectedMood={selectedMood} completed={completed} />;
      case 'activityFlow':
        return <ActivityFlowPage key={activityStep} go={go} initialStep={activityStep} onStepDone={markStepDone} />;
      case 'voicePhonation':
        return <VoicePhonationPage go={go} onComplete={() => markStepDone(4)} />;
      case 'partner':
        return <PartnerPage openProf={openProf} />;
      case 'sessions':
        return <SessionsPage go={go} openProf={openProf} />;
      case 'chats':
        return <ChatsPage displayName={displayName} />;
      case 'notifications':
        return <NotificationsPage go={go} notifications={notifications} setNotifications={setNotifications} />;
      case 'activity':
        return <ActivityPage go={go} />;
      case 'help':
        return <HelpPage openProf={openProf} />;
      case 'dashboard':
      default:
        return <DashboardPage displayName={displayName} go={go} unreadCount={unreadCount} openProf={openProf} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#f4f7f5] font-sans text-[#102a21] overflow-hidden box-border selection:bg-[#2d936c] selection:text-white">
      <Sidebar page={page} go={go} open={sidebarOpen} setOpen={setSidebarOpen} language={language} setLanguage={setLanguage} displayName={displayName} lastName={lastName} unreadCount={unreadCount} onExit={onExit} />
      <main className="flex-grow flex flex-col h-screen overflow-y-auto bg-[#f7f9f8] relative">
        {renderPage()}
      </main>
      <ProfModal prof={modal.prof} type={modal.type} onClose={closeProf} />
    </div>
  );
}