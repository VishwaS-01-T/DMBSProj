import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useDataStore } from "../store/dataStore";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" },
  { id: "applications", label: "Applications", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" },
  { id: "scholarships", label: "Scholarships", icon: "M12 2L4 7v10l8 5 8-5V7l-8-5z" },
  { id: "athletics", label: "Athletics Verify", icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" },
  { id: "mcm", label: "MCM Leaderboard", icon: "M12 20V10M18 20V4M6 20v-4" },
  { id: "reports", label: "Reports", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" },
];

const typeBadgeClass = {
  EXTERNAL: "bg-[var(--color-scholarship-external)]/10 text-[var(--color-scholarship-external)]",
  COLLEGE_MERIT: "bg-[var(--color-scholarship-merit)]/10 text-[var(--color-scholarship-merit)]",
  ATHLETICS: "bg-[var(--color-scholarship-athletics)]/10 text-[var(--color-scholarship-athletics)]",
  MCM: "bg-[var(--color-scholarship-mcm)]/10 text-[var(--color-scholarship-mcm)]",
};

function ProgressBar({ value, color = "success" }) {
  const colorClass = {
    success: "bg-[var(--color-status-approved)]",
    warning: "bg-[var(--color-status-pending)]",
    danger: "bg-[var(--color-status-rejected)]",
  }[color];
  return (
    <div className="flex-1 h-2 bg-[var(--color-base-surface2)] rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

export default function AdminPanel() {
  const { token, logout } = useAuthStore();
  const { 
    adminStats, adminScholarships, adminApplications, pendingAthletics, mcmLeaderboard,
    loadAdminStats, loadAdminScholarships, loadAdminApplications, loadPendingAthletics, 
    loadMcmLeaderboard, verifyAthletics, createScholarship, updateApplicationStatus, deleteApplication 
  } = useDataStore();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (token) {
      loadAdminStats(token);
      loadAdminScholarships(token);
      loadPendingAthletics(token);
      loadMcmLeaderboard(token);
    }
  }, [token]);

  useEffect(() => {
    if (token && activeSection === "applications") {
      loadAdminApplications(token);
    }
  }, [token, activeSection]);

  const stats = adminStats || {};
  const pendingCount = pendingAthletics?.length || 0;

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
            <div className="w-9 h-9 bg-[var(--color-scholarship-merit)] text-white rounded-full flex items-center justify-center font-semibold text-sm">AD</div>
            <div>
              <div className="text-sm font-medium text-[var(--color-text-primary)]">Admin</div>
              <div className="text-xs text-[var(--color-text-muted)]">System Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-[var(--color-base-surface)] border-b border-[var(--color-base-border)] flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
            {navItems.find(n => n.id === activeSection)?.label || "Admin Panel"}
          </h1>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-[var(--color-brand-primary)] bg-[var(--color-brand-primarySoft)] rounded-md hover:bg-[var(--color-brand-primary)] hover:text-white transition">
              Export Data
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
              <div className="w-12 h-12 rounded-lg bg-[var(--color-brand-primary)]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-brand-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.total_scholarships || 0}</div>
                <div className="text-xs text-[var(--color-text-muted)]">Active Scholarships</div>
              </div>
            </div>
            
            <div className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-status-pending)]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-status-pending)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.pending || 0}</div>
                <div className="text-xs text-[var(--color-text-muted)]">Pending Applications</div>
              </div>
            </div>
            
            <div className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-status-approved)]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-status-approved)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">{pendingCount}</div>
                <div className="text-xs text-[var(--color-text-muted)]">To Verify (Athletics)</div>
              </div>
            </div>
            
            <div className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-brand-accent)]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-brand-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">₹{(stats.total_disbursed || 0).toLocaleString("en-IN")}</div>
                <div className="text-xs text-[var(--color-text-muted)]">Committed Aid</div>
              </div>
            </div>
          </div>

          {/* Content by Section */}
          {activeSection === "dashboard" && (
            <div className="grid grid-cols-2 gap-6">
              {/* Athletics Queue */}
              <section className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Athletics Verification Queue</h2>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-status-pending)]/10 text-[var(--color-status-pending)]">
                    {pendingCount} Pending
                  </span>
                </div>
                
                <div className="space-y-3">
                  {pendingAthletics.length === 0 ? (
                    <p className="text-sm text-[var(--color-text-muted)]">No pending records</p>
                  ) : (
                    pendingAthletics.slice(0, 5).map((record) => (
                      <div key={record.record_id} className="flex items-center gap-4 p-4 bg-[var(--color-base-surface2)] rounded-lg">
                        <div className="w-10 h-10 bg-[var(--color-scholarship-athletics)]/20 text-[var(--color-scholarship-athletics)] rounded-full flex items-center justify-center font-semibold text-sm">
                          {record.name?.split(" ").map(n => n[0]).join("") || "ST"}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-[var(--color-text-primary)]">{record.name || "Student"}</div>
                          <div className="text-xs text-[var(--color-text-secondary)]">{record.sport} · {record.achievement_level} · {record.department}</div>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded bg-[var(--color-scholarship-athletics)]/10 text-[var(--color-scholarship-athletics)]">
                          {record.sport}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded bg-[var(--color-status-review)]/10 text-[var(--color-status-review)]">
                          {record.achievement_level?.toUpperCase() || "STATE"}
                        </span>
                        <button 
                          onClick={() => verifyAthletics(record.record_id, token)}
                          className="px-4 py-2 text-xs font-medium text-white bg-[var(--color-brand-primary)] rounded-md hover:bg-[var(--color-brand-primary)]/90 transition"
                        >
                          Verify
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* MCM Leaderboard */}
              <section className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">MCM Leaderboard</h2>
                  <select className="px-3 py-1 text-xs border border-[var(--color-base-border)] rounded-md bg-[var(--color-base-surface)]">
                    <option>All Institutions</option>
                    <option>IIT Delhi</option>
                    <option>IIT Bombay</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  {mcmLeaderboard.length === 0 ? (
                    <p className="text-sm text-[var(--color-text-muted)]">No eligible students</p>
                  ) : (
                    mcmLeaderboard.slice(0, 5).map((student, idx) => (
                      <div key={student.student_id} className="flex items-center gap-4 p-3 border-b border-[var(--color-base-border)] last:border-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${idx < 3 ? "bg-[var(--color-scholarship-merit)] text-white" : "bg-[var(--color-base-surface2)] text-[var(--color-text-secondary)]"}`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-[var(--color-text-primary)]">{student.name}</div>
                          <div className="text-xs text-[var(--color-text-secondary)]">CGPA: {student.cgpa_component} · Income: {student.income_component}</div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <span>CGPA: {student.cgpa_component}</span>
                            <div className="w-12 h-1.5 bg-[var(--color-base-surface2)] rounded-full overflow-hidden">
                              <div className="h-full bg-[var(--color-status-approved)]" style={{ width: `${student.cgpa_component}%` }} />
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Income: {student.income_component}</span>
                            <div className="w-12 h-1.5 bg-[var(--color-base-surface2)] rounded-full overflow-hidden">
                              <div className="h-full bg-[var(--color-status-pending)]" style={{ width: `${student.income_component}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold text-[var(--color-status-approved)]">{student.composite_score}/100</div>
                        <span className="px-2 py-1 text-xs font-medium rounded bg-[var(--color-status-approved)]/10 text-[var(--color-status-approved)]">
                          ELIGIBLE
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          )}

          {/* Applications Section */}
          {activeSection === "applications" && (
            <section className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">All Applications</h2>
              
              {adminApplications.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)]">No applications yet</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-base-border)]">
                      <th className="pb-3 font-semibold">ID</th>
                      <th className="pb-3 font-semibold">Student</th>
                      <th className="pb-3 font-semibold">Scholarship</th>
                      <th className="pb-3 font-semibold">Applied Date</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Remarks</th>
                      <th className="pb-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminApplications.map((app) => (
                      <tr key={app.application_id} className="border-b border-[var(--color-base-border)]">
                        <td className="py-4 text-sm text-[var(--color-text-secondary)]">#{app.application_id}</td>
                        <td className="py-4">
                          <div className="font-medium text-[var(--color-text-primary)]">{app.student_name}</div>
                          <div className="text-xs text-[var(--color-text-muted)]">{app.enrollment_no}</div>
                        </td>
                        <td className="py-4 text-sm text-[var(--color-text-primary)]">{app.scholarship_name}</td>
                        <td className="py-4 text-sm text-[var(--color-text-secondary)]">{app.applied_date}</td>
                        <td className="py-4">
                          <select
                            value={app.status}
                            onChange={async (e) => {
                              try {
                                await updateApplicationStatus(app.application_id, e.target.value, app.remarks, token);
                                loadAdminApplications(token);
                              } catch (err) {
                                alert("Failed to update status: " + err.message);
                              }
                            }}
                            className={`px-2 py-1 text-xs font-medium rounded border-0 cursor-pointer ${
                              app.status === "Approved" ? "bg-[var(--color-status-approved)]/10 text-[var(--color-status-approved)]" :
                              app.status === "Pending" ? "bg-[var(--color-status-pending)]/10 text-[var(--color-status-pending)]" :
                              app.status === "Under Review" ? "bg-[var(--color-status-review)]/10 text-[var(--color-status-review)]" :
                              app.status === "Rejected" ? "bg-[var(--color-status-rejected)]/10 text-[var(--color-status-rejected)]" :
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-4 text-sm text-[var(--color-text-muted)]">{app.remarks || "-"}</td>
                        <td className="py-4">
                          <button 
                            onClick={async () => {
                              const newStatus = app.status === "Approved" ? "Rejected" : "Approved";
                              try {
                                await updateApplicationStatus(app.application_id, newStatus, app.remarks, token);
                                loadAdminApplications(token);
                              } catch (err) {
                                alert("Failed to update: " + err.message);
                              }
                            }}
                            className="text-xs text-[var(--color-brand-primary)] hover:underline"
                          >
                            Toggle
                          </button>
                          <button 
                            onClick={async () => {
                              if (confirm("Are you sure you want to delete this application?")) {
                                try {
                                  await deleteApplication(app.application_id, token);
                                  loadAdminApplications(token);
                                } catch (err) {
                                  alert("Failed to delete: " + err.message);
                                }
                              }
                            }}
                            className="ml-2 text-xs text-[var(--color-status-rejected)] hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          )}

          {/* Scholarships Section */}
          {activeSection === "scholarships" && (
            <section className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">College Scholarship Summary</h2>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-brand-primary)] rounded-md hover:bg-[var(--color-brand-primary)]/90 transition"
                >
                  {showAddForm ? "Cancel" : "+ Add Scholarship"}
                </button>
              </div>

              {showAddForm && (
                <AddScholarshipForm 
                  token={token} 
                  onClose={() => {
                    setShowAddForm(false);
                    loadAdminScholarships(token);
                  }} 
                />
              )}
              
              <table className="w-full mt-4">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-base-border)]">
                    <th className="pb-3 font-semibold">Scholarship</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Seats</th>
                    <th className="pb-3 font-semibold">Applied</th>
                    <th className="pb-3 font-semibold">Fill %</th>
                    <th className="pb-3 font-semibold">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {adminScholarships.map((scholarship) => {
                    const fillPercent = scholarship.seats_available ? Math.round((scholarship.application_count / scholarship.seats_available) * 100) : 0;
                    return (
                      <tr key={scholarship.scholarship_id} className="border-b border-[var(--color-base-border)]">
                        <td className="py-4">
                          <div className="font-medium text-[var(--color-text-primary)]">{scholarship.name}</div>
                          <div className="text-xs text-[var(--color-text-muted)]">Provider: {scholarship.provider_name}</div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${typeBadgeClass[scholarship.scholarship_type] || "bg-gray-100 text-gray-600"}`}>
                            {scholarship.scholarship_type?.replace("_", " ") || "EXTERNAL"}
                          </span>
                        </td>
                        <td className="py-4 text-[var(--color-text-primary)]">₹{scholarship.amount_inr?.toLocaleString("en-IN")}</td>
                        <td className="py-4 text-[var(--color-text-primary)]">{scholarship.seats_available}</td>
                        <td className="py-4 text-[var(--color-text-primary)]">{scholarship.application_count || 0}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-[var(--color-base-surface2)] rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${fillPercent > 80 ? "bg-[var(--color-status-approved)]" : fillPercent > 50 ? "bg-[var(--color-status-pending)]" : "bg-[var(--color-status-rejected)]"}`}
                                style={{ width: `${fillPercent}%` }}
                              />
                            </div>
                            <span className="text-xs text-[var(--color-text-muted)]">{fillPercent}%</span>
                          </div>
                        </td>
                        <td className="py-4 text-[var(--color-text-secondary)] text-sm">{scholarship.deadline}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          )}

          {/* Athletics Section */}
          {activeSection === "athletics" && (
            <section className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Athletics Verification Queue</h2>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-status-pending)]/10 text-[var(--color-status-pending)]">
                  {pendingCount} Pending
                </span>
              </div>
              
              <div className="space-y-3">
                {pendingAthletics.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-muted)]">No pending records to verify</p>
                ) : (
                  pendingAthletics.map((record) => (
                    <div key={record.record_id} className="flex items-center gap-4 p-4 bg-[var(--color-base-surface2)] rounded-lg">
                      <div className="w-12 h-12 bg-[var(--color-scholarship-athletics)]/20 text-[var(--color-scholarship-athletics)] rounded-full flex items-center justify-center font-semibold">
                        {record.name?.split(" ").map(n => n[0]).join("") || "ST"}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[var(--color-text-primary)]">{record.name}</div>
                        <div className="text-sm text-[var(--color-text-secondary)]">{record.sport} · {record.achievement_level} · {record.department}</div>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium rounded bg-[var(--color-scholarship-athletics)]/10 text-[var(--color-scholarship-athletics)]">
                        {record.sport}
                      </span>
                      <span className="px-3 py-1 text-xs font-medium rounded bg-[var(--color-status-review)]/10 text-[var(--color-status-review)]">
                        {record.achievement_level?.toUpperCase() || "STATE"}
                      </span>
                      <button 
                        onClick={() => verifyAthletics(record.record_id, token)}
                        className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-brand-primary)] rounded-md hover:bg-[var(--color-brand-primary)]/90 transition"
                      >
                        Verify
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* MCM Leaderboard Section */}
          {activeSection === "mcm" && (
            <section className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">MCM Composite Score Leaderboard</h2>
                <select className="px-4 py-2 text-sm border border-[var(--color-base-border)] rounded-md bg-[var(--color-base-surface)]">
                  <option>All Institutions</option>
                </select>
              </div>
              
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-base-border)]">
                    <th className="pb-3 font-semibold">Rank</th>
                    <th className="pb-3 font-semibold">Student</th>
                    <th className="pb-3 font-semibold">Department</th>
                    <th className="pb-3 font-semibold">CGPA Component</th>
                    <th className="pb-3 font-semibold">Income Component</th>
                    <th className="pb-3 font-semibold">Total Score</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mcmLeaderboard.map((student, idx) => (
                    <tr key={student.student_id} className="border-b border-[var(--color-base-border)]">
                      <td className="py-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${idx < 3 ? "bg-[var(--color-scholarship-merit)] text-white" : "bg-[var(--color-base-surface2)] text-[var(--color-text-secondary)]"}`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-4 font-medium text-[var(--color-text-primary)]">{student.name}</td>
                      <td className="py-4 text-[var(--color-text-secondary)]">{student.department}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-[var(--color-base-surface2)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--color-status-approved)]" style={{ width: `${student.cgpa_component}%` }} />
                          </div>
                          <span className="text-sm text-[var(--color-text-secondary)]">{student.cgpa_component}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-[var(--color-base-surface2)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--color-status-pending)]" style={{ width: `${student.income_component}%` }} />
                          </div>
                          <span className="text-sm text-[var(--color-text-secondary)]">{student.income_component}</span>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-[var(--color-status-approved)]">{student.composite_score}/100</td>
                      <td className="py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-[var(--color-status-approved)]/10 text-[var(--color-status-approved)]">
                          ELIGIBLE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Reports Section */}
          {activeSection === "reports" && (
            <section className="bg-[var(--color-base-surface)] border border-[var(--color-base-border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Analytics & Reports</h2>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 bg-[var(--color-base-surface2)] rounded-lg">
                  <div className="text-sm text-[var(--color-text-muted)]">Total Applications</div>
                  <div className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">{stats.total_applications || 0}</div>
                </div>
                <div className="p-4 bg-[var(--color-base-surface2)] rounded-lg">
                  <div className="text-sm text-[var(--color-text-muted)]">Approved</div>
                  <div className="text-3xl font-bold text-[var(--color-status-approved)] mt-1">{stats.approved || 0}</div>
                </div>
                <div className="p-4 bg-[var(--color-base-surface2)] rounded-lg">
                  <div className="text-sm text-[var(--color-text-muted)]">Under Review</div>
                  <div className="text-3xl font-bold text-[var(--color-status-review)] mt-1">{stats.under_review || 0}</div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-md font-semibold text-[var(--color-text-primary)] mb-3">Applications by Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[var(--color-base-surface2)] rounded-lg">
                    <span className="text-sm text-[var(--color-text-secondary)]">Pending</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-[var(--color-base-border)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-status-pending)]" style={{ width: `${stats.total_applications ? (stats.pending / stats.total_applications * 100) : 0}%` }} />
                      </div>
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">{stats.pending || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--color-base-surface2)] rounded-lg">
                    <span className="text-sm text-[var(--color-text-secondary)]">Approved</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-[var(--color-base-border)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-status-approved)]" style={{ width: `${stats.total_applications ? (stats.approved / stats.total_applications * 100) : 0}%` }} />
                      </div>
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">{stats.approved || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--color-base-surface2)] rounded-lg">
                    <span className="text-sm text-[var(--color-text-secondary)]">Under Review</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-[var(--color-base-border)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-status-review)]" style={{ width: `${stats.total_applications ? (stats.under_review / stats.total_applications * 100) : 0}%` }} />
                      </div>
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">{stats.under_review || 0}</span>
                    </div>
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

function AddScholarshipForm({ token, onClose }) {
  const { createScholarship } = useDataStore();
  const [formData, setFormData] = useState({
    name: "",
    scholarship_type: "EXTERNAL",
    provider_id: 1,
    institution_id: null,
    amount_inr: 50000,
    seats_available: 10,
    deadline: "2026-12-31",
    min_cgpa: 7.5,
    max_family_income: null,
    gender_req: "",
    category_req: "",
    disability_req: false,
    state_req: "",
    renewable: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createScholarship(formData, token);
      alert("Scholarship created successfully!");
      onClose();
    } catch (err) {
      alert("Failed to create scholarship: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-[var(--color-base-surface2)] rounded-lg">
      <h3 className="text-md font-semibold text-[var(--color-text-primary)] mb-4">Add New Scholarship</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-[var(--color-text-muted)]">Name</label>
          <input 
            type="text" 
            required
            className="w-full mt-1 px-3 py-2 border border-[var(--color-base-border)] rounded-md bg-[var(--color-base-surface)] text-sm"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <label className="text-xs text-[var(--color-text-muted)]">Type</label>
          <select 
            className="w-full mt-1 px-3 py-2 border border-[var(--color-base-border)] rounded-md bg-[var(--color-base-surface)] text-sm"
            value={formData.scholarship_type}
            onChange={(e) => setFormData({...formData, scholarship_type: e.target.value})}
          >
            <option value="EXTERNAL">External</option>
            <option value="COLLEGE_MERIT">College Merit</option>
            <option value="ATHLETICS">Athletics</option>
            <option value="MCM">MCM</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-[var(--color-text-muted)]">Amount (₹)</label>
          <input 
            type="number" 
            required
            className="w-full mt-1 px-3 py-2 border border-[var(--color-base-border)] rounded-md bg-[var(--color-base-surface)] text-sm"
            value={formData.amount_inr}
            onChange={(e) => setFormData({...formData, amount_inr: Number(e.target.value)})}
          />
        </div>
        <div>
          <label className="text-xs text-[var(--color-text-muted)]">Seats</label>
          <input 
            type="number" 
            className="w-full mt-1 px-3 py-2 border border-[var(--color-base-border)] rounded-md bg-[var(--color-base-surface)] text-sm"
            value={formData.seats_available}
            onChange={(e) => setFormData({...formData, seats_available: Number(e.target.value)})}
          />
        </div>
        <div>
          <label className="text-xs text-[var(--color-text-muted)]">Deadline</label>
          <input 
            type="date" 
            required
            className="w-full mt-1 px-3 py-2 border border-[var(--color-base-border)] rounded-md bg-[var(--color-base-surface)] text-sm"
            value={formData.deadline}
            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
          />
        </div>
        <div>
          <label className="text-xs text-[var(--color-text-muted)]">Min CGPA</label>
          <input 
            type="number" 
            step="0.1"
            className="w-full mt-1 px-3 py-2 border border-[var(--color-base-border)] rounded-md bg-[var(--color-base-surface)] text-sm"
            value={formData.min_cgpa}
            onChange={(e) => setFormData({...formData, min_cgpa: e.target.value ? Number(e.target.value) : null})}
          />
        </div>
        <div>
          <label className="text-xs text-[var(--color-text-muted)]">Max Income (₹)</label>
          <input 
            type="number" 
            className="w-full mt-1 px-3 py-2 border border-[var(--color-base-border)] rounded-md bg-[var(--color-base-surface)] text-sm"
            value={formData.max_family_income || ""}
            onChange={(e) => setFormData({...formData, max_family_income: e.target.value ? Number(e.target.value) : null})}
          />
        </div>
        <div>
          <label className="text-xs text-[var(--color-text-muted)]">Institution</label>
          <select 
            className="w-full mt-1 px-3 py-2 border border-[var(--color-base-border)] rounded-md bg-[var(--color-base-surface)] text-sm"
            value={formData.institution_id || ""}
            onChange={(e) => setFormData({...formData, institution_id: e.target.value ? Number(e.target.value) : null})}
          >
            <option value="">All (External)</option>
            <option value="1">IIT Delhi</option>
            <option value="2">IIT Bombay</option>
          </select>
        </div>
        <div className="flex items-end">
          <button 
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-brand-primary)] rounded-md hover:bg-[var(--color-brand-primary)]/90 transition"
          >
            Create Scholarship
          </button>
        </div>
      </div>
    </form>
  );
}