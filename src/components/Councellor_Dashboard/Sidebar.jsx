import React, { useEffect, useState } from "react";
import {
  Home,
  Users,
  CalendarDays,
  MessageSquare,
  Bell,
  UserRoundCog,
  Clock3,
  Wallet,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Globe2,
  ChevronDown,
  UserRound,
} from "lucide-react";

/* ============================================================
   CONFIG
   Page widths: Patients / Overview madhe marginLeft hech vapar
============================================================ */

export const SIDEBAR_WIDTH = 268;
export const SIDEBAR_WIDTH_COLLAPSED = 76;

const MENU_ITEMS = [
  { label: "Overview", icon: Home, page: "Overview" },
  { label: "Patients", icon: Users, page: "Patients" },
  { label: "Sessions", icon: CalendarDays, page: "Sessions" },
  { label: "Chats", icon: MessageSquare, page: "Chats" },
  { label: "Notifications", icon: Bell, page: "Notifications" },
];

const ACCOUNT_ITEMS = [
  { label: "Profile Settings", icon: UserRoundCog, page: "Profile Settings" },
  { label: "Availability", icon: Clock3, page: "Availability" },
 
];

const LANGUAGES = ["English", "मराठी", "हिंदी"];

// Jar page chi dusri naav asel tar tya sidebar item la active dakhvel
const PAGE_ALIASES = {
  Schedule: "Sessions",
  Messages: "Chats",
};

/* ============================================================
   NAV ITEM (Menu ani Account donhi sathi ek)
============================================================ */

function NavItem({ item, active, collapsed, onClick }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onClick(item.page)}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={`group relative flex h-[42px] w-full cursor-pointer items-center rounded-xl outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#82e0c9]/60 ${
        collapsed ? "justify-center px-0" : "gap-3 px-3"
      } ${
        active
          ? "bg-[#184d43] font-medium text-[#f2f5dc] shadow-sm"
          : "text-[#9abdb4] hover:bg-[#0c3733] hover:text-[#e4eee9]"
      }`}
    >
      {active && !collapsed && (
        <span className="absolute bottom-[10px] left-0 top-[10px] w-[3px] rounded-r-full bg-[#82e0c9]" />
      )}

      <Icon
        size={20}
        strokeWidth={1.8}
        className={`shrink-0 transition-colors ${
          active ? "text-[#82e0c9]" : "text-[#8ebcb1] group-hover:text-[#c9e0d9]"
        }`}
      />

      {!collapsed && (
        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] tracking-[-0.1px]">
          {item.label}
        </span>
      )}
    </button>
  );
}

function SectionLabel({ children, collapsed }) {
  if (collapsed) return null;
  return (
    <div className="mb-2 px-3 text-[11px] font-bold tracking-[1px] text-[#59857c]">
      {children}
    </div>
  );
}

/* ============================================================
   SIDEBAR
============================================================ */

export default function Sidebar({
  collapsed = false,
  onToggle,
  activePage = "Overview",
  onNavigate,
  onLogout,
  partnerName = "Prem Zumble",
  partnerRole = "Wellness Partner",
}) {
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  // Sidebar collapse zala tar language dropdown band kar
  useEffect(() => {
    if (collapsed) setLangOpen(false);
  }, [collapsed]);

  const currentPage = PAGE_ALIASES[activePage] || activePage;

  const handleNavigate = (page) => {
    if (typeof onNavigate === "function" && page !== currentPage) {
      onNavigate(page);
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-[100] flex h-screen select-none flex-col border-r border-[#123a36] bg-[#032927] text-[#d9ebe5] transition-all duration-300 ease-in-out ${
        collapsed ? "w-[76px]" : "w-[268px]"
      }`}
    >
      {/* ---------- TOP: LOGO + TOGGLE ---------- */}
      <div
        className={`relative flex h-[72px] shrink-0 items-center border-b border-[#123a36] ${
          collapsed ? "justify-center px-0" : "justify-between px-4"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            if (typeof onNavigate === "function") onNavigate("Overview");
          }}
          className={`flex cursor-pointer items-center outline-none ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-xl border border-[#174d47] bg-[#0a3d39] text-[#78c8b4] shadow-sm">
            <UserRound size={20} strokeWidth={2} />
          </div>

          {!collapsed && (
            <div className="flex flex-col items-start leading-none">
              <span className="text-[19px] font-bold tracking-[-0.4px] text-[#f0f5d9]">
                Manovedh
              </span>
              <span className="mt-[4px] text-[10px] font-semibold tracking-[1px] text-[#79b7a9]">
                PARTNER PORTAL
              </span>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-lg text-[#8ebcb1] transition hover:bg-[#11403b] hover:text-[#d9eee7] ${
            collapsed
              ? "absolute -right-3.5 top-6 z-10 rounded-full border border-[#16403c] bg-[#032927] shadow-md"
              : ""
          }`}
        >
          {collapsed ? (
            <ChevronsRight size={18} strokeWidth={2} />
          ) : (
            <ChevronsLeft size={18} strokeWidth={2} />
          )}
        </button>
      </div>

      {/* ---------- NAVIGATION ---------- */}
      <div className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden px-3 py-4">
        <div>
          <SectionLabel collapsed={collapsed}>MENU</SectionLabel>
          <nav className="space-y-1" aria-label="Main menu">
            {MENU_ITEMS.map((item) => (
              <NavItem
                key={item.page}
                item={item}
                active={currentPage === item.page}
                collapsed={collapsed}
                onClick={handleNavigate}
              />
            ))}
          </nav>
        </div>

        <div>
          <SectionLabel collapsed={collapsed}>ACCOUNT</SectionLabel>
          <nav className="space-y-1" aria-label="Account">
            {ACCOUNT_ITEMS.map((item) => (
              <NavItem
                key={item.page}
                item={item}
                active={currentPage === item.page}
                collapsed={collapsed}
                onClick={handleNavigate}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* ---------- BOTTOM: LANGUAGE + PROFILE ---------- */}
      <div className="shrink-0 space-y-2.5 border-t border-[#123a36] bg-[#02211f]/50 p-3">
        {/* Language */}
        <div className="relative">
          <button
            type="button"
            onClick={() => !collapsed && setLangOpen((o) => !o)}
            title={collapsed ? selectedLang : undefined}
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            className={`flex h-[40px] w-full cursor-pointer items-center rounded-xl border border-[#12423e] bg-[#073330] text-[#d6e8e2] outline-none transition hover:bg-[#0c3d3a] ${
              collapsed ? "justify-center" : "gap-2.5 px-3"
            }`}
          >
            <Globe2 size={18} strokeWidth={1.8} className="shrink-0 text-[#8fc1b4]" />
            {!collapsed && (
              <>
                <span className="flex-1 truncate text-left text-[13px] font-medium">
                  {selectedLang}
                </span>
                <ChevronDown
                  size={15}
                  strokeWidth={2}
                  className={`text-[#80a89f] transition-transform duration-200 ${
                    langOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {langOpen && !collapsed && (
            <div
              role="listbox"
              className="absolute bottom-full left-0 right-0 z-50 mb-1.5 overflow-hidden rounded-xl border border-[#144742] bg-[#06322f] py-1 shadow-xl"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  role="option"
                  aria-selected={selectedLang === lang}
                  onClick={() => {
                    setSelectedLang(lang);
                    setLangOpen(false);
                  }}
                  className={`w-full cursor-pointer px-3 py-2 text-left text-[13px] transition ${
                    selectedLang === lang
                      ? "bg-[#184d43] font-medium text-[#edf5e0]"
                      : "text-[#b2d2c8] hover:bg-[#0a3b37]"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div
          className={`flex items-center rounded-xl border border-[#103b37] bg-[#052b28] p-2 ${
            collapsed ? "justify-center" : "justify-between gap-2.5"
          }`}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#c4e0cb] bg-[#e2edd3]">
              <UserRound size={20} strokeWidth={1.8} className="text-[#2c6659]" />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold text-[#edf3df]">
                  {partnerName}
                </div>
                <div className="truncate text-[10px] text-[#79b7a9]">{partnerRole}</div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              type="button"
              onClick={onLogout}
              title="Logout"
              aria-label="Logout"
              className="flex h-[30px] w-[30px] shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#83afa5] transition hover:bg-[#3d1414]/50 hover:text-[#ffcccc]"
            >
              <LogOut size={16} strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}