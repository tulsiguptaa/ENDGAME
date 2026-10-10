import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getResumes } from "../services/api";
import "./Dashboard.css";

function displayDate(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    let active = true;
    getResumes()
      .then((data) => {
        if (active) setResumes(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Could not fetch dashboard resumes:", err);
      })
      .finally(() => {
        if (active) setLoadingResumes(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const latestResume = resumes.length > 0 ? resumes[0] : null;

  return (
    <div className="dashboard-page">
      {/* AMBIENT GLOW */}
      <div className="page-background" aria-hidden="true">
        <div className="glow glow-one" />
        <div className="glow glow-two" />
      </div>

      <div className="dashboard-container">
        {/* HERO BANNER */}
        <section className="dashboard-hero">
          <div className="dashboard-hero-content">
            <div className="dashboard-badge">
              <span>✦</span> CANDIDATE COMMAND CENTER
            </div>

            <h1>
              Welcome back,{" "}
              <em>{user?.username ? user.username : "Candidate"}</em>.
            </h1>

            <p>
              Your intelligent interview preparation cockpit. Upload resumes, generate
              tailored mock interviews, and evaluate your readiness with AI-powered feedback.
            </p>
          </div>

          <div className="dashboard-hero-actions">
            <Link to="/resume-upload" className="btn-primary">
              <span>Resume Studio</span>
              <span>↗</span>
            </Link>

            <Link
              to={latestResume ? `/interview?resume_id=${latestResume.id}` : "/interview"}
              className="btn-secondary"
            >
              <span>Practice Interview</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* METRICS ROW */}
        <section className="dashboard-metrics">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-kicker">RESUME LIBRARY</span>
              <span className="metric-icon">📄</span>
            </div>
            <strong className="metric-value">
              {loadingResumes ? "…" : resumes.length}
            </strong>
            <span className="metric-subtext">
              {resumes.length === 1 ? "1 document analyzed" : `${resumes.length} documents analyzed`}
            </span>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-kicker">MOCK INTERVIEW</span>
              <span className="metric-icon">⌘</span>
            </div>
            <strong className="metric-value">3 Tracks</strong>
            <span className="metric-subtext">
              Technical · HR Behavioral · Mixed Simulation
            </span>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-kicker">AI EVALUATION ENGINE</span>
              <span className="metric-icon">✦</span>
            </div>
            <strong className="metric-value">Ready</strong>
            <span className="metric-subtext">
              Real-time scoring & strengths analysis
            </span>
          </div>
        </section>

        {/* ACTION CARDS GRID */}
        <section className="dashboard-grid">
          {/* RESUME STUDIO CARD */}
          <div className="dashboard-action-card">
            <div className="card-topline">
              <span className="card-icon">↑</span>
              <span className="card-tag">STEP 01</span>
            </div>
            <h3>Resume Studio</h3>
            <p>
              Upload resumes in PDF, PNG, or JPG formats. Extract your skills, work history,
              education, and key achievements automatically.
            </p>
            <div className="card-actions">
              <Link to="/resume-upload" className="action-link-btn primary">
                Upload & Analyze <span>↗</span>
              </Link>
              <Link to="/resume-upload#resumes" className="action-link-btn">
                Browse Library
              </Link>
            </div>
          </div>

          {/* AI INTERVIEW CARD */}
          <div className="dashboard-action-card">
            <div className="card-topline">
              <span className="card-icon">✦</span>
              <span className="card-tag">STEP 02</span>
            </div>
            <h3>Mock Interviews</h3>
            <p>
              Simulate high-stakes interviews with questions crafted from your actual resume.
              Get scored on technical correctness, clarity, and depth.
            </p>
            <div className="card-actions">
              <button
                type="button"
                className="action-link-btn primary"
                onClick={() => {
                  if (latestResume) {
                    navigate(`/interview?resume_id=${latestResume.id}`);
                  } else {
                    navigate("/interview");
                  }
                }}
              >
                Launch Interview <span>→</span>
              </button>
              <Link to="/interview" className="action-link-btn">
                Interview History
              </Link>
            </div>
          </div>

          {/* PROFILE CARD */}
          <div className="dashboard-action-card">
            <div className="card-topline">
              <span className="card-icon">👤</span>
              <span className="card-tag">ACCOUNT</span>
            </div>
            <h3>Candidate Profile</h3>
            <p>
              Review your registered email, credentials, security settings, and active
              interview progress benchmarks.
            </p>
            <div className="card-actions">
              <Link to="/profile" className="action-link-btn primary">
                View Profile <span>→</span>
              </Link>
              <span className="account-email-pill">
                {user?.email || "Authenticated user"}
              </span>
            </div>
          </div>
        </section>

        {/* RECENT RESUMES & PREP TIPS ROW */}
        <section className="dashboard-split">
          {/* RECENT RESUMES */}
          <div className="dashboard-section-box">
            <div className="box-heading">
              <div>
                <span className="panel-kicker">YOUR RESUMES</span>
                <h2>Recent Library Uploads</h2>
              </div>
              <Link to="/resume-upload#resumes" className="box-aside-link">
                View all ({resumes.length}) →
              </Link>
            </div>

            {loadingResumes ? (
              <div className="box-empty">
                <span className="spinner-inline" /> Loading library...
              </div>
            ) : resumes.length > 0 ? (
              <div className="recent-resumes-list">
                {resumes.slice(0, 3).map((item) => {
                  const filename = decodeURIComponent(
                    (item.file || "").split("/").pop() || `Resume #${item.id}`
                  );
                  return (
                    <div className="recent-resume-item" key={item.id}>
                      <div className="recent-resume-info">
                        <span className="resume-mini-badge">✦ #{item.id}</span>
                        <strong title={filename}>{filename}</strong>
                        <small>Uploaded {displayDate(item.uploaded_at)}</small>
                      </div>

                      <div className="recent-resume-btns">
                        <Link
                          to={`/interview?resume_id=${item.id}`}
                          className="mini-btn-primary"
                        >
                          Practice <span>→</span>
                        </Link>
                        <Link to="/resume-upload#resumes" className="mini-btn">
                          Analysis
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="box-empty">
                <span className="empty-symbol">↳</span>
                <div>
                  <strong>No resumes uploaded yet</strong>
                  <p>Upload your first resume to unlock personalized mock interviews.</p>
                </div>
                <Link to="/resume-upload" className="btn-primary" style={{ marginTop: "12px" }}>
                  Upload resume ↗
                </Link>
              </div>
            )}
          </div>

          {/* PREPARATION PROTOCOL */}
          <div className="dashboard-section-box">
            <div className="box-heading">
              <div>
                <span className="panel-kicker">BEST PRACTICES</span>
                <h2>Interview Playbook</h2>
              </div>
            </div>

            <div className="playbook-steps">
              <div className="playbook-step">
                <div className="step-num">01</div>
                <div>
                  <strong>Structure using the STAR framework</strong>
                  <p>Situation, Task, Action, Result. Quantify metric impacts whenever possible.</p>
                </div>
              </div>

              <div className="playbook-step">
                <div className="step-num">02</div>
                <div>
                  <strong>Deep dive on technical trade-offs</strong>
                  <p>Explain why you chose a specific technology or design pattern over alternatives.</p>
                </div>
              </div>

              <div className="playbook-step">
                <div className="step-num">03</div>
                <div>
                  <strong>Inspect AI evaluation feedback</strong>
                  <p>Review the score breakdown to pinpoint areas for stronger articulation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
