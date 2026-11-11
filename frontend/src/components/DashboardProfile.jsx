import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, GraduationCap, BookOpen, Calendar, Briefcase, Phone, Github, Linkedin,
  CheckCircle2, Circle, AlertTriangle, Trash2, ShieldCheck, ShieldAlert, Search, Camera,
  X, Plus, Sparkles, Save, RotateCcw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { deleteAccount } from "../services/authService.js";
import AnimatedCounter from "./AnimatedCounter.jsx";
import "./DashboardProfile.css";

const PROVIDER_LABEL = { google: "Google", github: "GitHub", password: "Email & password" };
const SKILL_SUGGESTIONS = ["Java", "Spring Boot", "React", "Node.js", "Python", "SQL", "JavaScript", "Git", "HTML/CSS", "C++"];
const MAX_SKILLS = 12;

const FIELD_KEYS = ["name", "photo", "university", "major", "gradYear", "targetRole", "skills", "github", "linkedin", "bio", "phone"];

// which fields count for "completion" and what to tell the user to do
const CHECKLIST = [
  { key: "photo", label: "Add a profile photo", id: "pf-photo" },
  { key: "university", label: "Add your college", id: "pf-university" },
  { key: "major", label: "Add your course / branch", id: "pf-major" },
  { key: "gradYear", label: "Choose graduation year", id: "pf-gradYear" },
  { key: "targetRole", label: "Say what role you want", id: "pf-targetRole" },
  { key: "skills", label: "Add your skills", id: "pf-skills" },
  { key: "github", label: "Link your GitHub", id: "pf-github" },
  { key: "linkedin", label: "Link your LinkedIn", id: "pf-linkedin" },
  { key: "bio", label: "Write a short bio", id: "pf-bio" },
];

const isFilled = (form, k) => (Array.isArray(form[k]) ? form[k].length > 0 : Boolean((form[k] || "").toString().trim()));

function initialsOf(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

function withProtocol(url) {
  const v = (url || "").trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function fromUser(user) {
  return {
    name: user?.name || "",
    photo: user?.photo || "",
    university: user?.university || "",
    major: user?.major || "",
    gradYear: user?.gradYear || "",
    targetRole: user?.targetRole || "",
    skills: Array.isArray(user?.skills) ? user.skills : [],
    phone: user?.phone || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
    bio: user?.bio || "",
  };
}

// center-crop + shrink the chosen photo to a small square so it stays tiny in storage
function resizeImage(file, size = 256) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      canvas.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image."));
    };
    img.src = url;
  });
}

/**
 * Profile page. Everything here is the signed-in user's own data
 * (from Google/GitHub/signup, or typed by them). There is no sample data.
 */
export default function DashboardProfile({ onSaveProfile, stats = { checked: 0, searches: 0, flagged: 0 } }) {
  const { user, updateProfile, logout } = useAuth();

  const saved = useMemo(() => fromUser(user), [user]);
  const [form, setForm] = useState(saved);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [flash, setFlash] = useState("");
  const fileRef = useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const dirty = useMemo(
    () => FIELD_KEYS.some((k) => JSON.stringify(form[k] ?? "") !== JSON.stringify(saved[k] ?? "")),
    [form, saved]
  );

  const done = CHECKLIST.filter((c) => isFilled(form, c.key)).length;
  const completion = Math.round((done / CHECKLIST.length) * 100);
  const todo = CHECKLIST.filter((c) => !isFilled(form, c.key));

  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return Array.from({ length: 8 }, (_, i) => String(y - 1 + i));
  }, []);

  function showToast(text, type = "success") {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3200);
  }

  function focusField(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setFlash(id);
    setTimeout(() => {
      el.focus?.({ preventScroll: true });
      setFlash("");
    }, 450);
  }

  // skills
  function addSkill(raw) {
    const v = raw.trim().replace(/,+$/, "");
    if (!v) return;
    setForm((f) => {
      if (f.skills.length >= MAX_SKILLS) return f;
      if (f.skills.some((s) => s.toLowerCase() === v.toLowerCase())) return f;
      return { ...f, skills: [...f.skills, v.slice(0, 24)] };
    });
    setSkillInput("");
  }
  const removeSkill = (s) => setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) }));

  // photo
  async function onPhoto(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return showToast("Please choose an image file.", "error");
    if (file.size > 8 * 1024 * 1024) return showToast("Image is too large (max 8 MB).", "error");
    try {
      const data = await resizeImage(file);
      setForm((f) => ({ ...f, photo: data }));
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  function discard() {
    setForm(saved);
    setSkillInput("");
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!form.name.trim()) return showToast("Please enter your name.", "error");
    setSaving(true);
    try {
      const data = {
        ...form,
        name: form.name.trim(),
        university: form.university.trim(),
        major: form.major.trim(),
        targetRole: form.targetRole.trim(),
        phone: form.phone.trim(),
        github: withProtocol(form.github),
        linkedin: withProtocol(form.linkedin),
        bio: form.bio.trim(),
      };
      await updateProfile(data);
      onSaveProfile && onSaveProfile(data);
      showToast("Profile saved.");
    } catch (err) {
      showToast(err.message || "Could not save profile.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteAccount();
    } catch {
      /* local session is cleared either way */
    }
    logout && logout();
    window.location.assign("/");
  }

  const picture = form.photo || (!avatarFailed && user?.avatar) || "";
  const provider = PROVIDER_LABEL[user?.provider] || PROVIDER_LABEL.password;
  const R = 34;
  const C = 2 * Math.PI * R;

  return (
    <div className="pf">
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`pf-toast pf-toast--${toast.type}`}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.18 }}
          >
            {toast.type === "success" ? <CheckCircle2 size={17} color="#22c55e" /> : <AlertTriangle size={17} color="#f43f5e" />}
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pf-head">
        <h1>Profile</h1>
        <p>Your account and academic details. Only you can see this page.</p>
      </div>

      {/* ── Hero ── */}
      <section className="pf-hero">
        <div className="pf-hero__left">
          <div className="pf-photo">
            {picture ? (
              <img src={picture} alt="" referrerPolicy="no-referrer" onError={() => setAvatarFailed(true)} />
            ) : (
              <span className="pf-photo__initials">{initialsOf(form.name || user?.name)}</span>
            )}
            <button type="button" id="pf-photo" className="pf-photo__btn" onClick={() => fileRef.current?.click()} aria-label="Change photo">
              <Camera size={16} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
          </div>
          <div className="pf-hero__who">
            <h2>{form.name || "Your name"}</h2>
            <span className="pf-hero__email">{user?.email}</span>
            <div className="pf-hero__chips">
              <span className="pf-chip">Signed in with {provider}</span>
              {form.photo && (
                <button type="button" className="pf-chip pf-chip--link" onClick={() => setForm((f) => ({ ...f, photo: "" }))}>
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pf-ring">
          <svg viewBox="0 0 80 80" width="84" height="84" aria-hidden="true">
            <circle cx="40" cy="40" r={R} className="pf-ring__bg" />
            <circle
              cx="40" cy="40" r={R} className="pf-ring__fg"
              strokeDasharray={C} strokeDashoffset={C - (C * completion) / 100}
              transform="rotate(-90 40 40)"
            />
          </svg>
          <div className="pf-ring__txt">
            <b>{completion}%</b>
            <span>{completion === 100 ? "Profile complete" : `${CHECKLIST.length - done} step${CHECKLIST.length - done > 1 ? "s" : ""} left`}</span>
          </div>
        </div>
      </section>

      <div className="pf-layout">
        <form className="pf-main" onSubmit={handleSubmit}>
          <section className="pf-card">
            <h3>Personal details</h3>
            <div className="pf-grid">
              <label className="pf-field">
                <span>Full name</span>
                <input id="pf-name" className={flash === "pf-name" ? "is-flash" : ""} value={form.name} onChange={set("name")} placeholder="Your full name" maxLength={80} />
              </label>
              <label className="pf-field">
                <span>Email <em><Lock size={11} /> Locked</em></span>
                <div className="pf-input-icon"><Mail size={16} /><input value={user?.email || ""} disabled /></div>
              </label>
              <label className="pf-field">
                <span>Phone (optional)</span>
                <div className="pf-input-icon"><Phone size={16} /><input id="pf-phone" value={form.phone} onChange={set("phone")} placeholder="+91 ..." maxLength={20} inputMode="tel" /></div>
              </label>
            </div>
          </section>

          <section className="pf-card">
            <h3>Education</h3>
            <div className="pf-grid">
              <label className="pf-field pf-field--full">
                <span>College / University</span>
                <div className="pf-input-icon"><GraduationCap size={16} />
                  <input id="pf-university" className={flash === "pf-university" ? "is-flash" : ""} value={form.university} onChange={set("university")} placeholder="e.g. Savitribai Phule Pune University" maxLength={120} />
                </div>
              </label>
              <label className="pf-field">
                <span>Course / Branch</span>
                <div className="pf-input-icon"><BookOpen size={16} />
                  <input id="pf-major" className={flash === "pf-major" ? "is-flash" : ""} value={form.major} onChange={set("major")} placeholder="e.g. BCA" maxLength={80} />
                </div>
              </label>
              <label className="pf-field">
                <span>Graduation year</span>
                <div className="pf-input-icon"><Calendar size={16} />
                  <select id="pf-gradYear" className={flash === "pf-gradYear" ? "is-flash" : ""} value={form.gradYear} onChange={set("gradYear")}>
                    <option value="">Select year</option>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </label>
            </div>
          </section>

          <section className="pf-card">
            <h3>Career</h3>
            <div className="pf-grid">
              <label className="pf-field pf-field--full">
                <span>Internship / job you are looking for</span>
                <div className="pf-input-icon"><Briefcase size={16} />
                  <input id="pf-targetRole" className={flash === "pf-targetRole" ? "is-flash" : ""} value={form.targetRole} onChange={set("targetRole")} placeholder="e.g. Full stack developer intern" maxLength={100} />
                </div>
              </label>

              <div className="pf-field pf-field--full">
                <span>Skills <em>{form.skills.length}/{MAX_SKILLS}</em></span>
                <div className={`pf-skills ${flash === "pf-skills" ? "is-flash" : ""}`}>
                  {form.skills.map((s) => (
                    <button type="button" key={s} className="pf-tag" onClick={() => removeSkill(s)} title="Click to remove">
                      {s} <X size={12} />
                    </button>
                  ))}
                  <input
                    id="pf-skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addSkill(skillInput);
                      } else if (e.key === "Backspace" && !skillInput && form.skills.length) {
                        removeSkill(form.skills[form.skills.length - 1]);
                      }
                    }}
                    placeholder={form.skills.length ? "Add another..." : "Type a skill and press Enter"}
                    maxLength={24}
                  />
                </div>
                <div className="pf-suggest">
                  {SKILL_SUGGESTIONS.filter((s) => !form.skills.some((x) => x.toLowerCase() === s.toLowerCase())).slice(0, 7).map((s) => (
                    <button type="button" key={s} onClick={() => addSkill(s)}><Plus size={11} /> {s}</button>
                  ))}
                </div>
              </div>

              <label className="pf-field">
                <span>GitHub</span>
                <div className="pf-input-icon"><Github size={16} />
                  <input id="pf-github" className={flash === "pf-github" ? "is-flash" : ""} value={form.github} onChange={set("github")} placeholder="github.com/username" maxLength={120} />
                </div>
              </label>
              <label className="pf-field">
                <span>LinkedIn</span>
                <div className="pf-input-icon"><Linkedin size={16} />
                  <input id="pf-linkedin" className={flash === "pf-linkedin" ? "is-flash" : ""} value={form.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/username" maxLength={120} />
                </div>
              </label>
              <label className="pf-field pf-field--full">
                <span>About you <em>{form.bio.length}/200</em></span>
                <textarea id="pf-bio" className={flash === "pf-bio" ? "is-flash" : ""} value={form.bio} onChange={set("bio")} rows={3} maxLength={200} placeholder="A line or two about you" />
              </label>
            </div>
          </section>

          <section className="pf-card pf-danger">
            <div>
              <h3>Delete account</h3>
              <p>Permanently removes your account from our server and clears the data saved on this device. This cannot be undone.</p>
            </div>
            {!confirmDelete ? (
              <button type="button" className="pf-del" onClick={() => setConfirmDelete(true)}><Trash2 size={15} /> Delete account</button>
            ) : (
              <div className="pf-del-confirm">
                <span>Are you sure?</span>
                <button type="button" className="pf-del pf-del--solid" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "Yes, delete"}</button>
                <button type="button" className="pf-cancel" onClick={() => setConfirmDelete(false)}>Cancel</button>
              </div>
            )}
          </section>
        </form>

        {/* ── Right rail ── */}
        <aside className="pf-side">
          <div className="pf-card">
            <h3><Sparkles size={15} /> Complete your profile</h3>
            {todo.length === 0 ? (
              <p className="pf-allset"><CheckCircle2 size={16} color="#22c55e" /> All set. Your profile is complete.</p>
            ) : (
              <ul className="pf-todo">
                {CHECKLIST.map((c) => {
                  const ok = isFilled(form, c.key);
                  return (
                    <li key={c.key}>
                      <button type="button" className={ok ? "is-done" : ""} onClick={() => !ok && focusField(c.id)} disabled={ok}>
                        {ok ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                        <span>{c.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="pf-card pf-stats">
            <h3>Your activity</h3>
            <div className="pf-stat">
              <span className="pf-stat__icon" style={{ color: "#38bdf8", background: "#38bdf818" }}><Search size={16} /></span>
              <span>Searches</span><b><AnimatedCounter value={stats.searches} /></b>
            </div>
            <div className="pf-stat">
              <span className="pf-stat__icon" style={{ color: "#a855f7", background: "#a855f718" }}><ShieldCheck size={16} /></span>
              <span>Verifications</span><b><AnimatedCounter value={stats.checked} /></b>
            </div>
            <div className="pf-stat">
              <span className="pf-stat__icon" style={{ color: "#f43f5e", background: "#f43f5e18" }}><ShieldAlert size={16} /></span>
              <span>High-risk found</span><b><AnimatedCounter value={stats.flagged} /></b>
            </div>
          </div>

          <p className="pf-privacy">Extra details (college, skills, links, photo) are saved on this device only, not on our server.</p>
        </aside>
      </div>

      {/* ── Unsaved changes bar ── */}
      <AnimatePresence>
        {dirty && (
          <motion.div
            className="pf-savebar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <span>You have unsaved changes</span>
            <div>
              <button type="button" className="pf-cancel" onClick={discard}><RotateCcw size={14} /> Discard</button>
              <button type="button" className="pf-save" onClick={handleSubmit} disabled={saving}>
                <Save size={14} /> {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}