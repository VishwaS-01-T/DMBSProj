import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-bg px-6">
      <h1 className="text-5xl font-bold text-text-primary">ScholarLink</h1>
      <p className="mt-4 text-xl text-text-secondary">Scholarship & Aid Matching System</p>
      <div className="mt-10 flex gap-4">
        <button
          onClick={() => navigate("/login/student")}
          className="rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-primaryDark"
        >
          Login as Student
        </button>
        <button
          onClick={() => navigate("/login/admin")}
          className="rounded-md border border-brand-primary px-6 py-3 text-sm font-semibold text-brand-primary transition hover:bg-brand-primarySoft"
        >
          Login as Admin
        </button>
      </div>
    </div>
  );
}