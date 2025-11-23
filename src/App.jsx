/* App.jsx
 - Integrated at project root (CRA-like). No path changes needed.
 - Views: Login, Signup, Onboarding, Dashboard, Courses, Course, Module, Quiz, Leaderboard, Profile, Admin
 - Leaderboard supports pagination + search; Admin supports dataset export/import.
*/
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import Button from "./components/Button";
import Card from "./components/Card";
import ProgressBar from "./components/ProgressBar";
import BadgePill from "./components/BadgePill";
import QuizQuestion from "./components/QuizQuestion";
import Pagination from "./components/Pagination";
import SearchInput from "./components/SearchInput";
import Toast from "./components/Toast";
import SimpleWeekChart from "./components/SimpleWeekChart";
import {
  login, signup, getCurrentUser, updateUser, listCourses, getCourse, enrollInCourse, unenrollFromCourse, markModuleComplete,
  getQuiz, submitQuiz, getLeaderboard, adminCreateCourse, adminUpdateCourse, adminDeleteCourse, getRecommendations,
  logout as apiLogout, getSession, getFormattedDate, computeWeeklyActivity, getCourseProgressForUser, getStats, getDataset, importDataset
} from "./data";

const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

function NavBar() {
  const { currentView, setCurrentView, user, doLogout } = useApp();
  const item = (view, label) => (
    <button className={`px-3 py-2 rounded-lg ${currentView === view ? "bg-brand-50 text-brand-700" : "hover:bg-gray-100"}`} onClick={() => setCurrentView(view)}>{label}</button>
  );
  return (
    <div className="hidden md:flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
      <div className="font-bold text-brand-700">E-Learn+</div>
      <div className="flex items-center gap-2">
        {item("dashboard","Dashboard")}
        {item("courses","Courses")}
        {item("leaderboard","Leaderboard")}
        {item("profile","Profile")}
        {user?.role === "admin" ? item("admin","Admin") : null}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm">Hi, <span className="font-semibold">{user?.name}</span></div>
        <Button variant="outline" onClick={doLogout}>Logout</Button>
      </div>
    </div>
  );
}

function MobileTabBar() {
  const { currentView, setCurrentView, user } = useApp();
  const item = (view, label) => (
    <button className={`flex-1 py-2 ${currentView === view ? "text-brand-700 font-semibold" : "text-gray-600"}`} onClick={() => setCurrentView(view)}>{label}</button>
  );
  return (
    <div className="mobile-tabbar flex items-center">
      {item("dashboard","Home")}
      {item("courses","Courses")}
      {item("leaderboard","Leaders")}
      {item("profile","Profile")}
      {user?.role === "admin" ? item("admin","Admin") : null}
    </div>
  );
}

/* Views */
function LoginView() {
  const { setCurrentView, setToken, addToast } = useApp();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const stats = getStats();
  const demo = [
    { u: "admin@demo.com", p: "Admin@123", label: "Admin" },
    { u: "aman@demo.com", p: "Aman@123", label: "Student (Aman)" },
    { u: "riya@demo.com", p: "Riya@123", label: "Student (Riya)" }
  ];
  const doLogin = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { token } = await login(form.username, form.password);
      setToken(token); addToast("Logged in", "Welcome back!", "success"); setCurrentView("onboarding");
    } catch (err) { addToast("Login failed", err.message, "error"); } finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-brand-600 text-white">
        <div className="max-w-md p-8">
          <div className="text-3xl font-bold mb-2">Personalized E-Learning</div>
          <p className="opacity-90">Adaptive quizzes, progress tracking, and gamification to keep you motivated.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={doLogin} className="w-full max-w-md space-y-4">
          <div className="text-2xl font-bold">Login</div>
          <div className="space-y-1">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required placeholder="you@example.com" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required placeholder="Min 6 chars" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <Button disabled={loading} className="w-full">{loading ? "Signing in..." : "Sign In"}</Button>
          <div className="text-sm text-gray-600">No account? <button type="button" className="underline" onClick={() => setCurrentView("signup")}>Sign up</button></div>
          <Card>
            <div className="font-medium mb-2">Demo Logins</div>
            <div className="grid md:grid-cols-3 gap-2">
              {demo.map(d => (
                <button key={d.u} className="btn btn-outline" type="button" onClick={() => setForm({ username: d.u, password: d.p })}>{d.label}</button>
              ))}
            </div>
          </Card>
          <div className="text-xs text-gray-500 text-center">Total Users: {stats.users} • Total Courses: {stats.courses}</div>
        </form>
      </div>
    </div>
  );
}

function SignupView() {
  const { setCurrentView, setToken, addToast } = useApp();
  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const doSignup = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const { token } = await signup(form); setToken(token); addToast("Signup complete", "Welcome!", "success"); setCurrentView("onboarding"); }
    catch (err) { addToast("Signup failed", err.message, "error"); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={doSignup} className="w-full max-w-md space-y-4 card">
        <div className="text-2xl font-bold">Create Account</div>
        <div className="space-y-1"><label>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
        <div className="space-y-1"><label>Email</label><input type="email" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required /></div>
        <div className="space-y-1"><label>Password</label><input type="password" placeholder="Min 6 chars" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
        <Button disabled={loading} className="w-full">{loading ? "Creating..." : "Sign Up"}</Button>
        <div className="text-sm text-gray-600">Have an account? <button type="button" className="underline" onClick={() => setCurrentView("login")}>Login</button></div>
      </form>
    </div>
  );
}

function OnboardingView() {
  const { user, token, refreshUser, setCurrentView, addToast } = useApp();
  const [interests, setInterests] = useState(user?.interests || []);
  const [goal, setGoal] = useState(user?.dailyGoalMin || 0);
  const opts = ["Java","DSA","Web Dev","React","DBMS","SQL","OS","Aptitude","Networks","Cloud"];
  useEffect(() => { setInterests(user?.interests || []); setGoal(user?.dailyGoalMin || 0); }, [user]);
  const toggle = (v) => setInterests(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const save = async () => {
    try { await updateUser(token, { interests, dailyGoalMin: Number(goal || 0) }); await refreshUser(); addToast("Saved","Preferences updated.","success"); setCurrentView("dashboard"); }
    catch (e) { addToast("Error", e.message, "error"); }
  };
  if ((user?.interests||[]).length>0 || (user?.dailyGoalMin||0)>0) { setCurrentView("dashboard"); return null; }
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="text-2xl font-bold">Welcome, {user?.name}</div>
      <Card>
        <div className="font-semibold mb-2">Select your interests</div>
        <div className="flex flex-wrap gap-2">
          {opts.map(o => (
            <button key={o} className={`badge ${interests.includes(o) ? "badge-blue" : "badge-amber"}`} onClick={() => toggle(o)} type="button">{o}</button>
          ))}
        </div>
      </Card>
      <Card>
        <div className="font-semibold mb-2">Daily study goal (minutes)</div>
        <input type="number" min="0" className="w-40 border border-gray-300 rounded-xl px-3 py-2" value={goal} onChange={e => setGoal(e.target.value)} />
      </Card>
      <div className="flex gap-2">
        <Button onClick={save}>Save & Continue</Button>
        <Button variant="outline" onClick={() => setCurrentView("dashboard")}>Skip</Button>
      </div>
    </div>
  );
}

function DashboardView() {
  const { user, token, setCurrentView, addToast } = useApp();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const weekly = useMemo(() => computeWeeklyActivity(user || { lastActive: [] }), [user]);
  useEffect(() => { let m=true; (async()=>{ try { const r = await getRecommendations(token); if(m) setRecs(r);} catch(e){ addToast("Error", e.message, "error"); } finally { if(m) setLoading(false);} })(); return ()=>{m=false;}; }, [token, addToast]);
  const lastQuiz = useMemo(() => { const scores = Object.values(user?.enrollments || {}).flatMap(e => e.quizScores || []); return scores.slice(-1)[0] || null; }, [user]);
  const overallProgress = useMemo(() => { const entries = Object.entries(user?.enrollments || {}); if (entries.length===0) return 0; let sum=0; entries.forEach(([cid]) => { sum += getCourseProgressForUser(user, cid); }); return Math.round(sum/entries.length); }, [user]);
  const predictive = useMemo(() => { const ids = Object.keys(user?.enrollments || {}); if(ids.length===0) return "Enroll in a course to get a prediction."; const cid=ids[0]; const current = getCourseProgressForUser(user, cid); const pace = Math.max(1, weekly.reduce((a,b)=>a+b.count,0)); const remain = Math.max(0, 100-current); const days = Math.ceil(remain/Math.max(1, pace)); return `At your current pace, you’ll finish ${cid} in ~${days} day(s).`; }, [user, weekly]);
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="text-2xl font-bold">Hello, {user?.name}</div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card><div className="text-sm text-gray-500">Overall Progress</div><div className="text-3xl font-bold">{overallProgress}%</div><div className="mt-2"><ProgressBar value={overallProgress} /></div></Card>
        <Card><div className="text-sm text-gray-500">Last Quiz Score</div><div className="text-3xl font-bold">{lastQuiz?`${lastQuiz.score}%`:"–"}</div><div className="text-xs text-gray-500 mt-1">{lastQuiz?getFormattedDate(lastQuiz.date):"No quizzes yet"}</div></Card>
        <Card><div className="text-sm text-gray-500">Points & Streak</div><div className="text-3xl font-bold">{user?.points||0} pts</div><div className="text-xs text-gray-500 mt-1">Streak: {user? (new Set(user.lastActive||[])).size:0} day(s)</div></Card>
      </div>
      <Card><div className="font-semibold mb-2">Weekly Activity</div><SimpleWeekChart data={weekly} /></Card>
      <div className="grid md:grid-cols-3 gap-4">
        <Card><div className="font-semibold mb-2">Badges</div><div className="flex flex-wrap">{(user?.badges||[]).length===0?<div className="text-sm text-gray-500">No badges yet</div>:null}{(user?.badges||[]).map(b => <BadgePill key={b} color="purple">{b}</BadgePill>)}</div></Card>
        <Card><div className="font-semibold mb-2">Quick Actions</div><div className="flex flex-wrap gap-2"><Button onClick={()=>setCurrentView("courses")}>Browse Courses</Button><Button variant="outline" onClick={()=>setCurrentView("leaderboard")}>Leaderboard</Button><Button variant="outline" onClick={()=>setCurrentView("profile")}>Edit Profile</Button></div></Card>
        <Card><div className="font-semibold mb-2">Prediction</div><div className="text-sm text-gray-700">{predictive}</div></Card>
      </div>
      <div>
        <div className="text-xl font-bold mb-2">Recommended For You</div>
        {loading? <div>Loading recommendations...</div> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">{recs.map(c => <CourseCard key={c.id} course={c} />)}</div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course }) {
  const { user, setCurrentView, setRouteParams } = useApp();
  const progress = getCourseProgressForUser(user, course.id);
  return (
    <Card>
      <div className="font-semibold">{course.title}</div>
      <div className="text-sm text-gray-600 line-clamp-3">{course.description}</div>
      <div className="mt-2 flex flex-wrap">{course.tags.map(t => <BadgePill key={t}>{t}</BadgePill>)}</div>
      <div className="mt-3"><div className="text-xs text-gray-600 mb-1">Progress</div><ProgressBar value={progress} /></div>
      <div className="mt-3 flex gap-2">
        <Button onClick={() => { setRouteParams({ courseId: course.id }); setCurrentView("course"); }}>{progress>0?"Continue":"View"}</Button>
      </div>
    </Card>
  );
}

function CoursesListView() {
  const { addToast, setCurrentView, setRouteParams } = useApp();
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 12;
  useEffect(() => { let m=true; (async()=>{ try { const list = await listCourses(); if(m) setCourses(list);} catch(e){ addToast("Error", e.message, "error"); } })(); return ()=>{m=false;}; }, [addToast]);
  const tags = ["All","Java","DSA","Web Dev","React","DBMS","SQL","OS","Aptitude","Networks","Cloud","Beginner","Intermediate","Advanced"];
  const filtered = courses.filter(c => { const matchesTag = tag === "All" || c.tags.includes(tag) || c.difficulty === tag; const matchesQ = c.title.toLowerCase().includes(q.toLowerCase()) || c.description.toLowerCase().includes(q.toLowerCase()); return matchesTag && matchesQ; });
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  useEffect(()=>{ setPage(1); }, [q, tag]);
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex-1"><SearchInput value={q} onChange={setQ} placeholder="Search courses..." /></div>
        <div className="w-56">
          <div className="space-y-1"><label>Filter</label><select value={tag} onChange={e=>setTag(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500">{tags.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{pageItems.map(c => (
        <div key={c.id}>
          <CourseCard course={c} />
          <div className="mt-2"><Button variant="outline" onClick={() => { setRouteParams({ courseId: c.id }); setCurrentView("course"); }}>Details</Button></div>
        </div>
      ))}</div>
      <Pagination page={page} total={total} pageSize={pageSize} onPage={setPage} />
    </div>
  );
}

function CourseDetailsView() {
  const { routeParams, token, user, refreshUser, addToast, setCurrentView, setRouteParams } = useApp();
  const courseId = routeParams?.courseId;
  const [course, setCourse] = useState(null);
  const enrolled = !!(user?.enrollments || {})[courseId];
  const progress = course ? getCourseProgressForUser(user, course.id) : 0;
  useEffect(() => { let m=true; (async()=>{ try { const c = await getCourse(courseId); if(m) setCourse(c);} catch(e){ addToast("Error", e.message, "error"); } })(); return ()=>{m=false;}; }, [courseId, addToast]);
  const toggleEnroll = async () => { try { if (!enrolled) await enrollInCourse(token, courseId); else await unenrollFromCourse(token, courseId); await refreshUser(); } catch(e){ addToast("Error", e.message, "error"); } };
  if (!course) return <div className="p-4">Loading...</div>;
  // compute done set
  const doneSet = new Set((user?.enrollments?.[course.id]?.completed) || []);
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <div className="text-2xl font-bold">{course.title}</div>
          <div className="text-sm text-gray-600">{course.difficulty}</div>
          <div className="mt-1 flex flex-wrap">{course.tags.map(t => <BadgePill key={t}>{t}</BadgePill>)}</div>
        </div>
        <div className="flex gap-2">
          <Button onClick={toggleEnroll}>{enrolled?"Unenroll":"Enroll"}</Button>
          <Button variant="outline" onClick={() => { setRouteParams({ courseId: course.id }); setCurrentView("quiz"); }}>Take Course Quiz</Button>
        </div>
      </div>
      <Card>
        <div className="font-semibold mb-1">Overview</div>
        <div className="text-gray-700">{course.description}</div>
        <div className="mt-2"><div className="text-sm font-medium">Learning outcomes</div><ul className="list-disc pl-5 text-sm text-gray-700">{course.outcomes.map((o,i)=><li key={i}>{o}</li>)}</ul></div>
      </Card>
      <Card>
        <div className="flex items-center justify-between mb-2"><div className="font-semibold">Modules</div><div className="w-48"><ProgressBar value={progress} /></div></div>
        <div className="space-y-2">
          {course.modules.map((m, idx) => (
            <div key={m.id} className="flex items-center justify-between border rounded-xl p-3">
              <div><div className="font-medium">{idx+1}. {m.title}</div><div className="text-xs text-gray-600">{m.estimatedMin} min</div></div>
              <div className="flex gap-2">
                {doneSet.has(m.id) ? <BadgePill color="green">Completed</BadgePill> : null}
                <Button onClick={() => { if (!user?.enrollments?.[course.id]) { addToast("Not enrolled","Enroll to start modules.","error"); return;} setRouteParams({ courseId: course.id, moduleId: m.id }); setCurrentView("module"); }}>{doneSet.has(m.id)?"Review":"Start"}</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ModuleViewerView() {
  const { routeParams, token, addToast, refreshUser, setCurrentView, setRouteParams } = useApp();
  const { courseId, moduleId } = routeParams || {};
  const [course, setCourse] = useState(null);
  const [index, setIndex] = useState(0);
  useEffect(() => { let m=true; (async()=>{ try { const c = await getCourse(courseId); if(m){ setCourse(c); const idx = c.modules.findIndex(x=>x.id===moduleId); setIndex(idx>=0?idx:0);} } catch(e){ addToast("Error", e.message, "error"); } })(); return ()=>{m=false;}; }, [courseId, moduleId, addToast]);
  useEffect(() => { const onKey = (e) => { if (!course) return; if (e.key === "ArrowRight") goNext(); if (e.key === "ArrowLeft") goPrev(); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [course, index]);
  const markDone = async () => { try { await markModuleComplete(token, courseId, course.modules[index].id); await refreshUser(); } catch(e){ addToast("Error", e.message, "error"); } };
  const goNext = () => { if (!course) return; const next = Math.min(course.modules.length-1, index+1); if (next!==index) setIndex(next); };
  const goPrev = () => { if (!course) return; const prev = Math.max(0, index-1); if (prev!==index) setIndex(prev); };
  if (!course) return <div className="p-4">Loading...</div>;
  const m = course.modules[index];
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="text-sm text-gray-600">{course.title} • Module {index+1}/{course.modules.length}</div>
      <Card>
        <div className="text-xl font-bold mb-2">{m.title}</div>
        <div className="prose prose-sm max-w-none"><p>{m.content}</p></div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={goPrev}>← Prev</Button>
          <Button onClick={goNext}>Next →</Button>
          <Button variant="outline" onClick={markDone}>Mark Complete</Button>
        </div>
      </Card>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => { setRouteParams({ courseId }); setCurrentView("course"); }}>Back to Course</Button>
        <Button onClick={() => { setRouteParams({ courseId }); setCurrentView("quiz"); }}>Take Course Quiz</Button>
      </div>
    </div>
  );
}

function QuizView() {
  const { routeParams, addToast, setCurrentView, setRouteParams, token } = useApp();
  const { courseId } = routeParams || {};
  const [course, setCourse] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [complete, setComplete] = useState(null);
  useEffect(() => { let m=true; (async()=>{ try { const c = await getCourse(courseId); const q = await getQuiz(c.quizId); if(m){ setCourse(c); setQuiz(q);} } catch(e){ addToast("Error", e.message, "error"); } })(); return ()=>{m=false;}; }, [courseId, addToast]);
  if (!quiz || !course) return <div className="p-4">Loading...</div>;
  const q = quiz.questions[idx]; const total = quiz.questions.length;
  const nextIndexAdaptive = (currentIdx, wasCorrect) => { if (wasCorrect) return currentIdx + 1; for (let i=currentIdx+1;i<total;i++){ const qi=quiz.questions[i]; if(!answers[qi.id] && qi.difficulty === "easy") return i; } const currentDiff = quiz.questions[currentIdx].difficulty; for (let i=currentIdx+1;i<total;i++){ const qi=quiz.questions[i]; if(!answers[qi.id] && qi.difficulty === currentDiff) return i; } return currentIdx + 1; };
  const onAnswer = async (ans) => { const correct = (q.type === "mcq" && ans === q.answer) || (q.type === "tf" && ans === q.answer); setAnswers(prev=>({...prev, [q.id]: ans})); setFeedback({ correct }); setTimeout(()=>{ setFeedback(null); const next = nextIndexAdaptive(idx, correct); if (next >= total) { (async()=>{ try { const result = await submitQuiz(token, quiz.id, { ...answers, [q.id]: ans }); setComplete(result); } catch(e){ addToast("Submit error", e.message, "error"); } })(); } else { setIdx(next); } }, 700); };
  if (complete) return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <div className="text-2xl font-bold">Quiz Complete</div>
        <div className="mt-2">Score: <span className="font-semibold">{complete.percent}%</span></div>
        <div className="mt-1">Points earned: <span className="font-semibold">{complete.pointsEarned}</span></div>
        <div className="mt-2"><div className="font-semibold">Badges</div><div className="flex flex-wrap">{complete.badges.map(b => <BadgePill key={b} color="purple">{b}</BadgePill>)}</div></div>
        <div className="mt-4 flex gap-2"><Button onClick={()=>setCurrentView("dashboard")}>Go to Dashboard</Button><Button variant="outline" onClick={()=>{ setRouteParams({ courseId }); setCurrentView("course"); }}>Back to Course</Button></div>
      </Card>
    </div>
  );
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-3">
      <div className="text-sm text-gray-600">{course.title} • Question {idx+1}/{total}</div>
      <QuizQuestion q={q} onAnswer={onAnswer} feedback={feedback} />
    </div>
  );
}

function LeaderboardView() {
  const { user, addToast } = useApp();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const pageSize = 25;
  const load = async (p=page, search=q) => {
    try { const res = await getLeaderboard({ page: p, pageSize, search }); setRows(res.rows); setTotal(res.total); setPage(res.page); }
    catch (e) { addToast("Error", e.message, "error"); }
  };
  useEffect(() => { load(1, q); }, []);
  useEffect(() => { const t = setTimeout(()=>load(1, q), 250); return () => clearTimeout(t); }, [q]);
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="text-2xl font-bold mb-3">Leaderboard</div>
      <div className="mb-3"><SearchInput value={q} onChange={setQ} placeholder="Search by name or email" /></div>
      <div className="overflow-auto rounded-2xl shadow-soft">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100"><tr><th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-right p-3">Points</th><th className="text-left p-3">Badges</th></tr></thead>
          <tbody>
            {rows.map(b => { const me = b.id === user?.id; return (
              <tr key={b.id} className={`${me?"bg-brand-50":"bg-white"} border-b`}>
                <td className="p-3 font-medium">{b.name}</td>
                <td className="p-3">{b.username}</td>
                <td className="p-3 text-right font-semibold">{b.points}</td>
                <td className="p-3"><div className="flex flex-wrap">{b.badges.map(x => <BadgePill key={x} color="purple">{x}</BadgePill>)}</div></td>
              </tr>
            ); })}
            {rows.length===0 && (<tr><td className="p-3" colSpan={4}>No data</td></tr>)}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} pageSize={pageSize} onPage={(p)=>load(p, q)} />
    </div>
  );
}

function ProfileView() {
  const { user, token, refreshUser, addToast } = useApp();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [interests, setInterests] = useState(user?.interests || []);
  const [goal, setGoal] = useState(user?.dailyGoalMin || 0);
  const opts = ["Java","DSA","Web Dev","React","DBMS","SQL","OS","Aptitude","Networks","Cloud"];
  useEffect(() => { setName(user?.name || ""); setInterests(user?.interests || []); setGoal(user?.dailyGoalMin || 0); }, [user]);
  const toggle = (v) => setInterests(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const save = async () => { try { const patch = { name, interests, dailyGoalMin: Number(goal || 0) }; if (password) patch.password = password; await updateUser(token, patch); await refreshUser(); addToast("Profile updated", "", "success"); } catch(e){ addToast("Error", e.message, "error"); } };
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="text-2xl font-bold">Profile</div>
      <Card><div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-1"><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="space-y-1"><label>Daily goal (minutes)</label><input type="number" min="0" value={goal} onChange={e=>setGoal(e.target.value)} /></div>
        <div className="space-y-1"><label>Change Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Leave empty to keep same" /></div>
      </div></Card>
      <Card><div className="font-semibold mb-2">Interests</div><div className="flex flex-wrap gap-2">{opts.map(o => (<button key={o} className={`badge ${interests.includes(o)?"badge-blue":"badge-amber"}`} onClick={()=>toggle(o)} type="button">{o}</button>))}</div></Card>
      <Card><div className="font-semibold mb-2">Badges</div><div className="flex flex-wrap">{(user?.badges||[]).map(b => <BadgePill key={b} color="purple">{b}</BadgePill>)}</div></Card>
      <Button onClick={save}>Save Changes</Button>
    </div>
  );
}

function AdminView() {
  const { user, addToast } = useApp();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", difficulty: "Beginner", tags: "" });
  const [loading, setLoading] = useState(true);
  const [fileError, setFileError] = useState("");
  useEffect(() => { let m=true; (async()=>{ try { const list = await listCourses(); if(m) setCourses(list);} catch(e){ addToast("Error", e.message, "error"); } finally { if(m) setLoading(false);} })(); return ()=>{m=false;}; }, [addToast]);
  if (user?.role !== "admin") return <div className="p-4">Unauthorized</div>;
  const create = async () => { try { const payload = { title: form.title, description: form.description, difficulty: form.difficulty, tags: form.tags.split(",").map(x=>x.trim()).filter(Boolean), outcomes: [], modules: [] }; const c = await adminCreateCourse(payload); setCourses(prev=>[...prev, c]); setForm({ title: "", description: "", difficulty: "Beginner", tags: "" }); addToast("Course created","","success"); } catch(e){ addToast("Error", e.message, "error"); } };
  const del = async (id) => { try { await adminDeleteCourse(id); setCourses(prev=>prev.filter(c=>c.id!==id)); addToast("Course deleted","","success"); } catch(e){ addToast("Error", e.message, "error"); } };
  const toggleDifficulty = async (c) => { const next = c.difficulty === "Beginner" ? "Intermediate" : c.difficulty === "Intermediate" ? "Advanced" : "Beginner"; try { const updated = await adminUpdateCourse(c.id, { difficulty: next }); setCourses(prev=>prev.map(x=>x.id===c.id?updated:x)); addToast("Updated difficulty","","success"); } catch(e){ addToast("Error", e.message, "error"); } };
  const exportData = () => {
    const data = getDataset(); const blob = new Blob([JSON.stringify(data)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `elearn-dataset-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
  };
  const importData = async (e) => {
    setFileError(""); const file = e.target.files?.[0]; if (!file) return; try { const text = await file.text(); const json = JSON.parse(text); importDataset(json); setCourses(await listCourses()); addToast("Dataset imported","","success"); } catch(err){ setFileError("Invalid dataset file"); addToast("Import failed", err.message, "error"); }
  };
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="text-2xl font-bold">Admin Panel</div>
      <Card>
        <div className="font-semibold mb-2">Create Course</div>
        <div className="grid md:grid-cols-4 gap-3">
          <div className="space-y-1"><label>Title</label><input value={form.title} onChange={e=>setForm({ ...form, title: e.target.value })} /></div>
          <div className="space-y-1"><label>Description</label><input value={form.description} onChange={e=>setForm({ ...form, description: e.target.value })} /></div>
          <div className="space-y-1"><label>Difficulty</label><select value={form.difficulty} onChange={e=>setForm({ ...form, difficulty: e.target.value })} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
          <div className="space-y-1"><label>Tags (comma separated)</label><input value={form.tags} onChange={e=>setForm({ ...form, tags: e.target.value })} /></div>
        </div>
        <div className="mt-3 flex gap-2"><Button onClick={create}>Create</Button><Button variant="outline" onClick={exportData}>Download dataset</Button><label className="btn btn-outline cursor-pointer"><input type="file" accept="application/json" className="hidden" onChange={importData} />Upload dataset</label></div>
        {fileError && <div className="text-sm text-red-600 mt-2">{fileError}</div>}
      </Card>
      <Card>
        <div className="font-semibold mb-2">Courses</div>
        {loading? "Loading..." : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {courses.map(c => (
              <div key={c.id} className="border rounded-2xl p-3">
                <div className="font-semibold">{c.title}</div>
                <div className="text-xs text-gray-600">{c.difficulty}</div>
                <div className="text-sm mt-1">{c.description}</div>
                <div className="flex flex-wrap mt-2">{c.tags.map(t => <BadgePill key={t}>{t}</BadgePill>)}</div>
                <div className="mt-3 flex gap-2"><Button variant="outline" onClick={() => toggleDifficulty(c)}>Toggle Difficulty</Button><Button onClick={() => del(c.id)}>Delete</Button></div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(() => getSession()?.token || null);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState(token ? "dashboard" : "login");
  const [routeParams, setRouteParams] = useState({});
  const [toasts, setToasts] = useState([]);
  const addToast = (title, message = "", type = "success") => { const id = Math.random().toString(36).slice(2, 9); setToasts(t => [...t, { id, title, message, type }]); setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000); };
  const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));
  const doLogout = () => { apiLogout(); setToken(null); setUser(null); setCurrentView("login"); };
  const refreshUser = async () => { if (!token) return; try { const u = await getCurrentUser(token); const fixed = { ...u, enrollments: Object.fromEntries(Object.entries(u.enrollments || {}).map(([cid, e]) => { const completed = Array.isArray(e.completed) ? e.completed : []; return [cid, { ...e, completed }]; })) }; setUser(fixed); } catch(e){ addToast("Session expired","","error"); doLogout(); } };
  useEffect(() => { if (token) refreshUser(); }, [token]);
  useEffect(() => { if (!token && currentView !== "signup" && currentView !== "login") { setCurrentView("login"); } }, [token, currentView]);
  const ctx = { token, setToken, user, setUser, currentView, setCurrentView, routeParams, setRouteParams, addToast, removeToast, doLogout, refreshUser };
  return (
    <AppCtx.Provider value={ctx}>
      {token && user ? <NavBar /> : null}
      {token && user ? <div className="h-3" /> : null}
      <div className="pb-16">
        {!token && currentView === "login" && <LoginView />}
        {!token && currentView === "signup" && <SignupView />}
        {token && currentView === "onboarding" && <OnboardingView />}
        {token && currentView === "dashboard" && user && <DashboardView />}
        {token && currentView === "courses" && <CoursesListView />}
        {token && currentView === "course" && <CourseDetailsView />}
        {token && currentView === "module" && <ModuleViewerView />}
        {token && currentView === "quiz" && <QuizView />}
        {token && currentView === "leaderboard" && <LeaderboardView />}
        {token && currentView === "profile" && <ProfileView />}
        {token && currentView === "admin" && <AdminView />}
      </div>
      {token && user ? <MobileTabBar /> : null}
      <Toast toasts={toasts} remove={removeToast} />
    </AppCtx.Provider>
  );
}
