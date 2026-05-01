import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useDataStore } from "../store/dataStore";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" },
  { id: "matches", label: "My Matches", icon: "M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" },
  { id: "applications", label: "Applications", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" },
  { id: "documents", label: "Documents", icon: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" },
  { id: "profile", label: "Profile", icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
];

const typeBadgeClass = {
  EXTERNAL: "bg-[var(--color-scholarship-external)]/10 text-[var(--color-scholarship-external)]",
  COLLEGE_MERIT: "bg-[var(--color-scholarship-merit)]/10 text-[var(--color-scholarship-merit)]",
  ATHLETICS: "bg-[var(--color-scholarship-athletics)]/10 text-[var(--color-scholarship-athletics)]",
  MCM: "bg-[var(--color-scholarship-mcm)]/10 text-[var(--color-scholarship-mcm)]",
};

const typeAccentClass = {
  EXTERNAL: "bg-[var(--color-scholarship-external)]",
  COLLEGE_MERIT: "bg-[var(--color-scholarship-merit)]",
  ATHLETICS: "bg-[var(--color-scholarship-athletics)]",
  MCM: "bg-[var(--color-scholarship-mcm)]",
};

function getOrdinalSuffix(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function ScoreRing({ score }) {
  const value = Math.min(Math.max(score || 0, 0), 100);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <div className="relative w-12 h-12">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-base-border)" strokeWidth="10" />
        <circle 
          cx="50" cy="50" r="45" fill="none" stroke="var(--color-brand-accent)" strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[var(--color-text-primary)]">
        {value}%
      </span>
    </div>
  );
}

function ScholarshipCard({ item, onApply }) {
  const [daysLeft, setDaysLeft] = useState(0);
  
  useEffect(() => {
    if (item.deadline) {
      const deadline = new Date(item.deadline);
      const today = new Date();
      const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      setDaysLeft(Math.max(0, diff));
    }
  }, [item.deadline]);

  const badgeClass = typeBadgeClass[item.scholarship_type] || "bg-gray-100 text-gray-600";
  const accentClass = typeAccentClass[item.scholarship_type] || "bg-gray-400";
  const progress = Math.max(0, 100 - (daysLeft / 30) * 100);

  if (item.scholarship_type === "MCM") {
    const cgpaScore = Math.min((item.cgpa_component || 75) * 1.2, 100);
    const incomeScore = Math.min((item.income_component || 50) * 1.5, 100);
    
    return (
      <div className="relative bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentClass}`} />
        <div className="p-5">
          <div className="flex items-start justify-between">
            <span className={`px-2 py-1 text-xs font-medium rounded ${badgeClass}`}>MCM</span>
            <ScoreRing score={item.composite_score || 75} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">{item.name}</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">{item.provider_name || "College Financial Aid"}</p>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--color-text-muted)] w-12">CGPA</span>
              <div className="flex-1 h-2 bg-[var(--color-base-surface2)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-status-approved)]" style={{ width: `${cgpaScore}%` }} />
              </div>
              <span className="text-xs text-[var(--color-text-secondary)] w-12">{item.cgpa_component || 64} pts</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--color-text-muted)] w-12">Income</span>
              <div className="flex-1 h-2 bg-[var(--color-base-surface2)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-brand-accent)]" style={{ width: `${incomeScore}%` }} />
              </div>
              <span className="text-xs text-[var(--color-text-secondary)] w-12">{item.income_component || 35} pts</span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-[var(--color-base-border)] text-sm font-semibold text-[var(--color-status-approved)]">
            Composite: <strong>{item.composite_score || 99}/100</strong>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => onApply(item)}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-brand-primary)] rounded-md hover:bg-[var(--color-brand-primary)]/90 transition"
            >
              Apply Now
            </button>
            <button className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] border border-[var(--color-base-border)] rounded-md hover:bg-[var(--color-base-surface2)] transition">
              Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (item.scholarship_type === "ATHLETICS") {
    return (
      <div className="relative bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentClass}`} />
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded ${badgeClass}`}>ATHLETICS</span>
              <span className="px-2 py-1 text-xs font-medium rounded bg-[var(--color-status-approved)]/10 text-[var(--color-status-approved)]">NATIONAL</span>
            </div>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">{item.name}</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Cricket · Gold medal, State U-19</p>
          <p className="mt-2 text-sm font-medium text-[var(--color-text-primary)]">₹{(item.amount_inr || 20000).toLocaleString("en-IN")}/yr · Verified ✓</p>
          
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => onApply(item)}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-brand-primary)] rounded-md hover:bg-[var(--color-brand-primary)]/90 transition"
            >
              Apply Now
            </button>
            <button className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] border border-[var(--color-base-border)] rounded-md hover:bg-[var(--color-base-surface2)] transition">
              Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (item.scholarship_type === "COLLEGE_MERIT") {
    return (
      <div className="relative bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentClass}`} />
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded ${badgeClass}`}>MERIT</span>
              <span className="px-2 py-1 text-xs font-medium rounded bg-[var(--color-scholarship-merit)]/10 text-[var(--color-scholarship-merit)]">Rank 3 of 48</span>
            </div>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">{item.name}</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">CSE Year 2 · Top 10%</p>
          
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-[var(--color-base-surface2)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-scholarship-merit)]" style={{ width: "89%" }} />
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">89th percentile</span>
            </div>
          </div>
          
          <p className="mt-3 text-sm font-medium text-[var(--color-text-primary)]">₹{(item.amount_inr || 25000).toLocaleString("en-IN")}/yr</p>
          
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => onApply(item)}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-brand-primary)] rounded-md hover:bg-[var(--color-brand-primary)]/90 transition"
            >
              Apply Now
            </button>
            <button className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] border border-[var(--color-base-border)] rounded-md hover:bg-[var(--color-base-surface2)] transition">
              Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentClass}`} />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <span className={`px-2 py-1 text-xs font-medium rounded ${badgeClass}`}>EXTERNAL</span>
          <ScoreRing score={item.predicted_score || 82} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">{item.name}</h3>
        <p className="text-sm text-[var(--color-text-secondary)]">{item.provider_name || "Provider"} · ₹{(item.amount_inr || 50000).toLocaleString("en-IN")}/yr</p>
        
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-[var(--color-base-surface2)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-brand-primary)]" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">{daysLeft} days left</span>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => onApply(item)}
            className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-brand-primary)] rounded-md hover:bg-[var(--color-brand-primary)]/90 transition"
          >
            Apply Now
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] border border-[var(--color-base-border)] rounded-md hover:bg-[var(--color-base-surface2)] transition">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { token, userId, logout } = useAuthStore();
  const { matches, loadMatches, adminApplications, loadStudentApplications, studentProfile, loadStudentProfile } = useDataStore();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (token && userId) {
      loadStudentProfile(userId, token);
      loadStudentApplications(userId, token);
    }
  }, [token, userId]);

  useEffect(() => {
    if (token && userId && (activeSection === "dashboard" || activeSection === "matches")) {
      loadMatches(userId, token);
    }
  }, [token, userId, activeSection]);

  useEffect(() => {
    if (token && userId) {
      loadStudentApplications(userId, token);
    }
  }, [token, userId, activeSection]);

  const handleApply = async (scholarship) => {
    if (!token || !userId) return;
    try {
      await fetch("http://127.0.0.1:8000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: userId,
          scholarship_id: scholarship.scholarship_id,
          remarks: "Applied via student dashboard",
        }),
      });
      alert("Application submitted successfully!");
      loadStudentApplications(userId, token);
      loadMatches(userId, token);
    } catch (err) {
      alert("Failed to apply: " + err.message);
    }
  };

  const myApplications = adminApplications?.filter(app => Number(app.student_id) === Number(userId)) || [];
  const stats = {
    matches: matches?.length || 0,
    applied: myApplications.length,
    approved: myApplications.filter(a => a.status === "Approved").length,
    totalAid: myApplications.filter(a => a.status === "Approved").reduce((sum, a) => sum + (a.amount_granted || 0), 0),
  };

  const filteredMatches = activeTab === "all" 
    ? matches 
    : activeTab === "external" 
      ? matches.filter(m => m.scholarship_type === "EXTERNAL")
      : activeTab === "college"
        ? matches.filter(m => ["COLLEGE_MERIT", "ATHLETICS", "MCM"].includes(m.scholarship_type))
        : activeTab === "applied"
          ? []
          : matches;

  return (
    <div className="flex min-h-screen bg-[var(--color-base-bg)]">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-base-surface)] border-r border-[var(--color-base-border)] flex flex-col">
        <div className="p-6">
          <a href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-[var(--color-brand-primary)] text-white rounded-lg flex items-center justify-center font-bold text-lg">S</span>
            <span className="text-lg font-semibold text-[var(--color-text-primary)]">ScholarLink</span>
          </a>
        </div>
        
        <nav className="flex-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition ${
                activeSection === item.id
                  ? "bg-[var(--color-brand-primarySoft)] text-[var(--color-brand-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-base-surface2)]"
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-[var(--color-base-border)]">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-base-surface2)]">
            <div className="w-9 h-9 bg-[var(--color-brand-primary)] text-white rounded-full flex items-center justify-center font-semibold text-sm">
              {studentProfile?.name?.split(" ").map(n => n[0]).join("") || "ST"}
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--color-text-primary)]">{studentProfile?.name || "Student"}</div>
              <div className="text-xs text-[var(--color-text-muted)]">{studentProfile?.department || "CSE"} Year {studentProfile?.year_of_study || 2}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-[var(--color-base-surface)] border-b border-[var(--color-base-border)] flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
            {navItems.find(n => n.id === activeSection)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-base-surface2)] rounded-lg">
              <svg className="w-4 h-4 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search scholarships..." 
                className="bg-transparent border-none outline-none text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
              />
            </div>
            <button className="p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-base-surface2)] rounded-lg transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </button>
            <button 
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] border border-[var(--color-base-border)] rounded-md hover:bg-[var(--color-base-surface2)] transition"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-auto">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-scholarship-external)]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-scholarship-external)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.matches}</div>
                <div className="text-xs text-[var(--color-text-muted)]">Matches Found</div>
              </div>
              <div className="ml-auto w-1 h-10 bg-[var(--color-scholarship-external)] rounded-full" />
            </div>
            
            <div className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-status-pending)]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-status-pending)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M12 18v-6M9 15l3 3 3-3"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.applied}</div>
                <div className="text-xs text-[var(--color-text-muted)]">Applied</div>
              </div>
              <div className="ml-auto w-1 h-10 bg-[var(--color-status-pending)] rounded-full" />
            </div>
            
            <div className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-status-approved)]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-status-approved)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.approved}</div>
                <div className="text-xs text-[var(--color-text-muted)]">Approved</div>
              </div>
              <div className="ml-auto w-1 h-10 bg-[var(--color-status-approved)] rounded-full" />
            </div>
            
            <div className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-brand-accent)]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-brand-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">₹{stats.totalAid.toLocaleString("en-IN")}</div>
                <div className="text-xs text-[var(--color-text-muted)]">Total Aid</div>
              </div>
              <div className="ml-auto w-1 h-10 bg-[var(--color-brand-accent)] rounded-full" />
            </div>
          </div>

          {/* Tabs */}
          {activeSection === "dashboard" || activeSection === "matches" ? (
            <>
              <div className="flex gap-4 mb-6 border-b border-[var(--color-base-border)]">
                {["All Matches", "External", "College Awards", "Applied"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase().replace(" ", "-"))}
                    className={`pb-3 text-sm font-semibold transition relative ${
                      activeTab === tab.toLowerCase().replace(" ", "-")
                        ? "text-[var(--color-brand-primary)]"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {tab}
                    <span className={`absolute left-0 bottom-0 w-full h-0.5 ${activeTab === tab.toLowerCase().replace(" ", "-") ? "bg-[var(--color-brand-primary)]" : "bg-transparent"}`} />
                  </button>
                ))}
              </div>

              {/* Scholarship Cards Grid */}
              <div className="grid grid-cols-2 gap-6">
                {filteredMatches.slice(0, 6).map((item) => (
                  <ScholarshipCard key={item.scholarship_id} item={item} onApply={handleApply} />
                ))}
              </div>

              {/* ML Insight Banner */}
              <div className="mt-8 p-4 bg-[var(--color-brand-primarySoft)] rounded-lg flex items-center gap-4">
                <span className="text-2xl">💡</span>
                <span className="text-sm text-[var(--color-text-primary)]">
                  Improve CGPA by 0.3 to unlock <strong className="font-semibold">4 more scholarships</strong>
                </span>
                <a href="#" className="ml-auto text-sm text-[var(--color-brand-primary)] hover:underline">See how →</a>
              </div>
            </>
          ) : null}

          {/* Applications Section */}
          {activeSection === "applications" && (
            <section className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">My Applications</h2>
              
              {myApplications.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)]">No applications yet. Start applying to scholarships!</p>
              ) : (
                <div className="space-y-3">
                  {myApplications.map((app) => (
                    <div key={app.application_id} className="flex items-center justify-between p-4 bg-[var(--color-base-surface2)] rounded-lg">
                      <div>
                        <div className="font-medium text-[var(--color-text-primary)]">{app.scholarship_name}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">Applied on {app.applied_date}</div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded ${
                        app.status === "Approved" ? "bg-[var(--color-status-approved)]/10 text-[var(--color-status-approved)]" :
                        app.status === "Pending" ? "bg-[var(--color-status-pending)]/10 text-[var(--color-status-pending)]" :
                        app.status === "Under Review" ? "bg-[var(--color-status-review)]/10 text-[var(--color-status-review)]" :
                        "bg-[var(--color-status-rejected)]/10 text-[var(--color-status-rejected)]"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Documents Section */}
          {activeSection === "documents" && (
            <section className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">My Documents</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-[var(--color-base-surface2)] rounded-lg">
                  <div>
                    <div className="font-medium text-[var(--color-text-primary)]">Income Certificate</div>
                    <div className="text-xs text-[var(--color-text-muted)]">Uploaded on 2026-04-15</div>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium rounded bg-[var(--color-status-approved)]/10 text-[var(--color-status-approved)]">Verified</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[var(--color-base-surface2)] rounded-lg">
                  <div>
                    <div className="font-medium text-[var(--color-text-primary)]">Caste Certificate</div>
                    <div className="text-xs text-[var(--color-text-muted)]">Uploaded on 2026-04-15</div>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium rounded bg-[var(--color-status-approved)]/10 text-[var(--color-status-approved)]">Verified</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[var(--color-base-surface2)] rounded-lg">
                  <div>
                    <div className="font-medium text-[var(--color-text-primary)]">Marksheet (Sem 4)</div>
                    <div className="text-xs text-[var(--color-text-muted)]">Uploaded on 2026-04-20</div>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium rounded bg-[var(--color-status-pending)]/10 text-[var(--color-status-pending)]">Pending Verification</span>
                </div>
              </div>
            </section>
          )}

          {/* Profile Section */}
          {activeSection === "profile" && (
            <section className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">My Profile</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Name</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{studentProfile?.name || "Loading..."}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Enrollment No</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{studentProfile?.enrollment_no || "Loading..."}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Department</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{studentProfile?.department || "Loading..."}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Year of Study</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{studentProfile?.year_of_study ? `${studentProfile.year_of_study}${getOrdinalSuffix(studentProfile.year_of_study)} Year` : "Loading..."}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">CGPA</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{studentProfile?.cgpa || "Loading..."}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Annual Family Income</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">₹{studentProfile?.annual_family_income?.toLocaleString("en-IN") || "Loading..."}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Category</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{studentProfile?.caste_category || "Loading..."}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">State</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{studentProfile?.state || "Loading..."}</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}