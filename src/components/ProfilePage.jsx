import React, { useState, useEffect, useRef } from "react";
import { 
  Globe, Calendar, User, 
  Volume2, Camera, ShieldCheck, Save, 
  CheckCircle2, Eye, EyeOff, LogOut, RefreshCw 
} from "lucide-react";

// Import custom PNG icon assets from folder
import userIcon from "../assets/user.png";
import mailIcon from "../assets/communication.png";
import mobileIcon from "../assets/call.png";
import lockIcon from "../assets/lock.png";
import bellIcon from "../assets/notification-bell.png";
import calendarIcon from "../assets/calendar.png";
import internetIcon from "../assets/internet.png";

// Import default avatars from assets
import avatar1 from "../assets/image-1.png";
import avatar2 from "../assets/image-2.png";
import avatar3 from "../assets/image-3.png";
import avatar4 from "../assets/image-4.png";
import avatar5 from "../assets/image-5.png";

const defaultAvatars = [
  { id: 1, src: avatar1, label: "Boy Avatar 1" },
  { id: 2, src: avatar2, label: "Boy Avatar 2" },
  { id: 3, src: avatar3, label: "Girl Avatar 1" },
  { id: 4, src: avatar4, label: "Girl Avatar 2" },
  { id: 5, src: avatar5, label: "Avatar 5" },
];

export default function ProfilePage({ setActiveTab }) {
  const [formData, setFormData] = useState({
    fullName: "Komal Ramdas Gadge",
    email: "komalgadge@gmail.com",
    phoneNumber: "9283636353",
    profilePic: avatar3, 
    password: "",
    language: "English (US)",
    emailNotifications: true,
    sessionReminders: true,
    messageNotifications: true,
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    sessionDuration: "50 Minutes",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const activeUser = localStorage.getItem("manovedh_current_user");
    if (activeUser) {
      try {
        const parsed = JSON.parse(activeUser);
        
        let assignedPic = parsed.profilePic;
        if (!assignedPic) {
          assignedPic = avatar3; 
        }

        setFormData((prev) => ({
          ...prev,
          fullName: parsed.fullName || prev.fullName,
          email: parsed.email || prev.email,
          phoneNumber: parsed.phoneNumber || prev.phoneNumber,
          password: parsed.password || prev.password,
          profilePic: assignedPic,
        }));
      } catch (err) {
        console.error("Error parsing user session:", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleWorkingDay = (day) => {
    setFormData((prev) => {
      const current = prev.workingDays;
      if (current.includes(day)) {
        return { ...prev, workingDays: current.filter((d) => d !== day) };
      } else {
        return { ...prev, workingDays: [...current, day] };
      }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectAvatar = (imgSrc) => {
    setFormData((prev) => ({ ...prev, profilePic: imgSrc }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    
    const activeUser = localStorage.getItem("manovedh_current_user");
    let parsedUser = activeUser ? JSON.parse(activeUser) : {};

    const updatedUser = {
      ...parsedUser,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      profilePic: formData.profilePic,
    };

    localStorage.setItem("manovedh_current_user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("storage"));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("manovedh_current_user");
    window.dispatchEvent(new Event("storage"));
    window.location.reload();
  };

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="w-full bg-white font-sans text-[#1b3328] pt-0 pb-20 px-0 mx-0">
      <div className="w-full space-y-6 px-0 mx-0">

        {/* SUCCESS NOTIFICATION TOAST */}
        {savedSuccess && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1b3328] text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-[#a08a4a] flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold">Changes saved successfully!</span>
          </div>
        )}

        {/* FORM CONTAINER */}
        <form onSubmit={handleSaveChanges} className="space-y-6 w-full px-0 mx-0">
          
          {/* TOP PROFILE SETTINGS CARD */}
          <div id="profile-settings" className="bg-gradient-to-r from-[#f7fbf9] to-[#edf4f0] rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-900/10 w-full m-0 scroll-mt-6">
            <div className="flex items-center justify-between pb-6 border-b border-emerald-900/10 w-full">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2e5b45] to-[#1b3328] text-white flex items-center justify-center shadow-md p-2.5">
                  <img src={userIcon} alt="User Icon" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#1b3328]">Profile Settings</h3>
                  <p className="text-xs text-stone-500 font-medium">Update your personal information and choose your avatar</p>
                </div>
              </div>

              {/* LOGOUT BUTTON TOP RIGHT */}
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-6 w-full">
              
              {/* Left Profile Avatar Box */}
              <div className="lg:col-span-3 flex sm:flex-row lg:flex-col items-center gap-5 p-6 rounded-2xl bg-white border border-emerald-900/10 text-center shadow-sm w-full">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full ring-4 ring-[#2e5b45]/20 overflow-hidden bg-[#1b3328] text-white flex items-center justify-center font-bold text-3xl shadow-md">
                    {formData.profilePic ? (
                      <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{formData.fullName ? formData.fullName.charAt(0).toUpperCase() : "K"}</span>
                    )}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#1b3328] hover:bg-[#2e5b45] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#1b3328]">{formData.fullName}</h4>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-semibold text-emerald-600">Active</span>
                  </div>
                  <p className="text-[11px] text-stone-500 italic mt-2">Small steps drive big changes ♥</p>
                </div>
              </div>

              {/* Middle Inputs */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                
                {/* Full Name Full Width */}
                <div className="space-y-1.5 w-full sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                    Full Name
                  </label>
                  <div className="relative w-full">
                    <img src={userIcon} alt="User" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 object-contain opacity-70" />
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-emerald-900/10 focus:outline-none focus:ring-2 focus:ring-[#2e5b45] text-sm font-medium shadow-sm"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5 w-full">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                    Email Address
                  </label>
                  <div className="relative w-full">
                    <img src={mailIcon} alt="Mail" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 object-contain opacity-70" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-emerald-900/10 focus:outline-none focus:ring-2 focus:ring-[#2e5b45] text-sm font-medium shadow-sm"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5 w-full">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                    Phone Number
                  </label>
                  <div className="relative w-full">
                    <img src={mobileIcon} alt="Phone" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 object-contain opacity-70" />
                    <input 
                      type="text" 
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-emerald-900/10 focus:outline-none focus:ring-2 focus:ring-[#2e5b45] text-sm font-medium shadow-sm"
                    />
                  </div>
                </div>

                {/* AVATAR SELECTION */}
                <div className="space-y-1.5 w-full sm:col-span-2 pt-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                    Choose Your Avatar (Boy / Girl)
                  </label>
                  <div className="flex items-center gap-3 flex-wrap p-3 rounded-xl bg-white border border-emerald-900/10 shadow-sm">
                    {defaultAvatars.map((av) => {
                      const isSelected = formData.profilePic === av.src;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => handleSelectAvatar(av.src)}
                          title={av.label}
                          className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                            isSelected 
                              ? "border-[#2e5b45] ring-4 ring-[#2e5b45]/20 scale-105" 
                              : "border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={av.src} alt={av.label} className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Profile Photo Uploader Card */}
              <div className="lg:col-span-3 flex flex-col gap-4 w-full">
                <div className="border-2 border-dashed border-emerald-900/20 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3 bg-white shadow-sm w-full">
                  <div className="w-12 h-12 rounded-full bg-[#2e5b45]/10 flex items-center justify-center text-[#2e5b45]">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1b3328]">Custom Photo</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Upload from device<br />Max size 2MB</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-1.5 bg-white border border-[#2e5b45] text-[#2e5b45] hover:bg-[#2e5b45] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Upload File
                  </button>
                </div>

                {/* UPDATE PROFILE BUTTON */}
                <button 
                  type="submit"
                  className="w-full py-3 bg-[#2e5b45] hover:bg-[#1b3328] text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-[#a08a4a]" /> Update Profile
                </button>
              </div>

            </div>
          </div>

          {/* TWO COLUMN MIDDLE SECTION (Account Settings & Notifications) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full px-0 mx-0">
            
            {/* ACCOUNT SETTINGS */}
            <div className="bg-[#f7fbf9] rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-900/10 space-y-6 flex flex-col justify-between w-full m-0">
              <div className="w-full">
                <div className="flex items-center gap-3 pb-4 border-b border-emerald-900/10 w-full">
                  <div className="w-10 h-10 rounded-2xl bg-[#2e5b45]/10 text-[#2e5b45] flex items-center justify-center font-bold p-2.5">
                    <img src={lockIcon} alt="Lock" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1b3328]">Account Settings</h3>
                    <p className="text-xs text-stone-500">Manage your login and security preferences</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 w-full">
                  <div className="space-y-1.5 w-full">
                    <label className="text-[11px] font-bold text-stone-600 uppercase">Password</label>
                    <div className="relative w-full">
                      <img src={lockIcon} alt="Lock" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 object-contain opacity-70" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-emerald-900/10 focus:outline-none focus:ring-2 focus:ring-[#2e5b45] text-sm font-medium shadow-sm"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#1b3328]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 w-full">
                    <label className="text-[11px] font-bold text-stone-600 uppercase">Language</label>
                    <div className="relative w-full">
                      <img src={internetIcon} alt="Internet" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 object-contain opacity-70" />
                      <select 
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-emerald-900/10 focus:outline-none focus:ring-2 focus:ring-[#2e5b45] text-sm font-medium appearance-none cursor-pointer shadow-sm"
                      >
                        <option>English (US)</option>
                        <option>हिन्दी (Hindi)</option>
                        <option>मराठी (Marathi)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account safe banner */}
              <div className="mt-6 w-full">
                <div className="p-4 rounded-2xl bg-white border border-emerald-100 flex items-center justify-between shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2e5b45] text-white flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-[#a08a4a]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1b3328]">Your account is safe</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* NOTIFICATIONS */}
            <div className="bg-[#f7fbf9] rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-900/10 space-y-6 w-full m-0">
              <div className="flex items-center gap-3 pb-4 border-b border-emerald-900/10 w-full">
                <div className="w-10 h-10 rounded-2xl bg-[#2e5b45]/10 text-[#2e5b45] flex items-center justify-center font-bold p-2.5">
                  <img src={bellIcon} alt="Bell" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1b3328]">Notifications</h3>
                  <p className="text-xs text-stone-500">Choose what you want to be notified about</p>
                </div>
              </div>

              <div className="space-y-4 pt-2 w-full">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-emerald-900/10 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 p-2">
                      <img src={mailIcon} alt="Mail" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1b3328]">Email Notifications</p>
                      <p className="text-xs text-stone-500">Receive updates via email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-stone-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2e5b45]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-emerald-900/10 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 p-2">
                      <img src={calendarIcon} alt="Calendar" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1b3328]">Session Reminders</p>
                      <p className="text-xs text-stone-500">Get reminders for upcoming sessions</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="sessionReminders"
                      checked={formData.sessionReminders}
                      onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-stone-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2e5b45]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-emerald-900/10 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 p-2">
                      <img src={bellIcon} alt="Bell" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1b3328]">Message Notifications</p>
                      <p className="text-xs text-stone-500">Get notified for new messages</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="messageNotifications"
                      checked={formData.messageNotifications}
                      onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-stone-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2e5b45]"></div>
                  </label>
                </div>
              </div>
            </div>

          </div>

          {/* LOWER SECTION (Availability Card centered/full width neatly) */}
          <div className="w-full">
            <div className="bg-[#f7fbf9] rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-900/10 space-y-6 w-full m-0">
              <div className="flex items-center gap-3 pb-4 border-b border-emerald-900/10 w-full">
                <div className="w-10 h-10 rounded-2xl bg-[#2e5b45]/10 text-[#2e5b45] flex items-center justify-center font-bold p-2.5">
                  <img src={calendarIcon} alt="Calendar" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1b3328]">Availability</h3>
                  <p className="text-xs text-stone-500">Set your working days and preferred time</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 w-full">
                <div className="space-y-2 w-full">
                  <label className="text-[11px] font-bold uppercase text-stone-600">Working Days</label>
                  <div className="flex flex-wrap gap-2 w-full">
                    {daysOfWeek.map((day) => {
                      const isSelected = formData.workingDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleWorkingDay(day)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-[#2e5b45] text-white shadow-md ring-2 ring-[#a08a4a]/30" 
                              : "bg-white text-stone-600 hover:bg-stone-100 border border-emerald-900/10 shadow-sm"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <label className="text-[11px] font-bold uppercase text-stone-600">Default Session Duration</label>
                  <div className="relative w-full">
                    <img src={calendarIcon} alt="Calendar" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 object-contain opacity-70" />
                    <select 
                      name="sessionDuration"
                      value={formData.sessionDuration}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-emerald-900/10 focus:outline-none focus:ring-2 focus:ring-[#2e5b45] text-sm font-medium cursor-pointer shadow-sm"
                    >
                      <option>30 Minutes</option>
                      <option>50 Minutes</option>
                      <option>60 Minutes</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}