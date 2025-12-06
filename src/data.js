/* data.js - Large dataset seeding, fake API, recommendation engine, localStorage-backed */

import { getCourses as apiGetCourses, getCourseById as apiGetCourseById, createCourse as apiCreateCourse, updateCourse as apiUpdateCourse, deleteCourse as apiDeleteCourse, getModules as apiGetModules, getQuiz as apiGetQuiz, enrollApi, unenrollApi, completeModuleApi } from './api/client';

const DB_KEY = "elearn_db";
const SEED_VER_KEY = "elearn_seed_version";
const SEED_VERSION = "v1-large";
const TOKEN_KEY = "elearn_token_v1";

const withLatency = async (fn) => {
  const delay = 200 + Math.random() * 400;
  await new Promise((r) => setTimeout(r, delay));
  return fn();
};

// Normalize a Course coming from backend (MySQL) to UI shape used in app
function normalizeCourse(c) {
  if (!c) return c;
  const tagsArr = Array.isArray(c.tags)
    ? c.tags
    : (typeof c.tags === 'string' ? c.tags.split(',').map(x => x.trim()).filter(Boolean) : []);
  return {
    id: c.id,
    title: c.title || '',
    description: c.description || '',
    difficulty: c.difficulty || 'Beginner',
    tags: tagsArr,
    enrollCount: typeof c.enrollCount === 'number' ? c.enrollCount : 0,
    quizId: c.quizId || 'quiz_' + c.id,
    // UI expects arrays below; backend v1 doesn't store them yet
    outcomes: Array.isArray(c.outcomes) ? c.outcomes : [],
    modules: Array.isArray(c.modules) ? c.modules : []
  };
}

const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}`;
const todayISO = () => new Date().toISOString().slice(0, 10);

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickMany(arr, k) {
  const a = [...arr];
  const n = Math.min(k, a.length);
  const out = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * a.length);
    out.push(a.splice(idx, 1)[0]);
  }
  return out;
}

function seedIfNeeded() {
  const ver = localStorage.getItem(SEED_VER_KEY);
  if (ver === SEED_VERSION && localStorage.getItem(DB_KEY)) return JSON.parse(localStorage.getItem(DB_KEY));

  const interestsPool = ["Java","DSA","Web Dev","React","DBMS","SQL","OS","Aptitude","Networks","Cloud"];
  const firstNames = ["Aarav","Vivaan","Aditya","Vihaan","Arjun","Reyansh","Muhammad","Sai","Arnav","Ayaan","Krishna","Ishaan","Rohan","Rudra","Shivansh","Atharv","Ayush","Dhruv","Kabir","Kartik","Manav","Pranav","Rajat","Ritvik","Sarthak","Siddharth","Tanay","Vedant","Yash","Zaid","Ananya","Aadhya","Diya","Ira","Ishita","Jiya","Kiara","Mahika","Myra","Navya","Pari","Riya","Saanvi","Sara","Shruti","Tara","Trisha","Vaishnavi","Zoya"]; 
  const lastNames = ["Sharma","Verma","Gupta","Agarwal","Singh","Yadav","Kumar","Patel","Naidu","Iyer","Menon","Rao","Reddy","Nair","Das","Roy","Chatterjee","Mukherjee","Banerjee","Bose","Ghosh","Kapoor","Malhotra","Mehta","Jain","Bhatia","Arora","Chauhan","Gill","Khan","Ali","Sheikh","Pandey","Tiwari","Tripathi","Mishra","Sinha","Thakur","Bisht","Joshi","Desai","Kulkarni","Shinde","Pawar","Gowda","Shetty","Hegde","Dutta","Sarkar"];

  // Base courses (14)
  const baseCourses = [
    { id: "c_java", title: "Java Foundations", difficulty: "Beginner", tags: ["Java","Beginner"], desc: "Core Java and OOP." },
    { id: "c_java_adv", title: "Advanced Java", difficulty: "Intermediate", tags: ["Java","Intermediate"], desc: "Streams, concurrency, JVM." },
    { id: "c_dsa", title: "Data Structures & Algorithms", difficulty: "Intermediate", tags: ["DSA","Java","Intermediate"], desc: "Big-O, arrays to graphs." },
    { id: "c_react", title: "Frontend with React", difficulty: "Intermediate", tags: ["Web Dev","React","Intermediate"], desc: "Hooks, state, components." },
    { id: "c_dbms", title: "DBMS Essentials", difficulty: "Beginner", tags: ["DBMS","SQL","Beginner"], desc: "Relational model & SQL." },
    { id: "c_os", title: "Operating Systems Basics", difficulty: "Beginner", tags: ["OS","Beginner"], desc: "Processes, memory, scheduling." },
    { id: "c_networks", title: "Networks & Security", difficulty: "Intermediate", tags: ["Networks","Security","Intermediate"], desc: "TCP/IP, HTTP, TLS basics." },
    { id: "c_cloud", title: "Cloud Fundamentals", difficulty: "Beginner", tags: ["Cloud","Beginner"], desc: "IaaS, PaaS, SaaS, AWS/GCP." },
    { id: "c_apt", title: "Aptitude Mastery", difficulty: "Beginner", tags: ["Aptitude","Beginner"], desc: "Arithmetic and logic." },
    { id: "c_sysd", title: "System Design Basics", difficulty: "Intermediate", tags: ["Web Dev","Intermediate"], desc: "Scalability and tradeoffs." },
    { id: "c_sql", title: "SQL for Developers", difficulty: "Beginner", tags: ["DBMS","SQL","Beginner"], desc: "Joins, subqueries, practice." },
    { id: "c_htmlcss", title: "HTML & CSS", difficulty: "Beginner", tags: ["Web Dev","Beginner"], desc: "Layouts, Flexbox, Grid." },
    { id: "c_js", title: "Modern JavaScript", difficulty: "Intermediate", tags: ["Web Dev","Intermediate"], desc: "ES6+, async, modules." },
    { id: "c_git", title: "Git & GitHub", difficulty: "Beginner", tags: ["Web Dev","Beginner"], desc: "Version control workflows." }
  ];

  const courses = baseCourses.map((bc, idx) => {
    const moduleCount = 4 + Math.floor(Math.random() * 3); // 4-6
    const modules = Array.from({ length: moduleCount }).map((_, i) => ({
      id: uid(`m_${bc.id}`),
      title: `${bc.title} - Module ${i + 1}`,
      content: `${bc.title} key concepts and examples for module ${i + 1}.`,
      estimatedMin: 8 + Math.floor(Math.random() * 14)
    }));
    const quizId = `quiz_${bc.id}`;
    return {
      id: bc.id,
      title: bc.title,
      description: bc.desc,
      difficulty: bc.difficulty,
      tags: bc.tags,
      enrollCount: 100 + Math.floor(Math.random() * 500),
      outcomes: ["Understand basics", "Apply concepts", "Practice with questions"],
      modules,
      quizId
    };
  });

  function makeQuiz(tag, courseId, quizId) {
    const diffs = ["easy","medium","hard"];
    const qs = [];
    for (let i = 0; i < 10; i++) {
      const type = i % 2 === 0 ? "mcq" : "tf";
      const diff = diffs[i % 3];
      if (type === "mcq") {
        qs.push({ id: uid("q"), type, question: `${tag} Q${i+1}?`, options: ["A","B","C","D"], answer: i % 4, explanation: "Review notes.", difficulty: diff, tags: [tag] });
      } else {
        qs.push({ id: uid("q"), type, question: `${tag} True/False #${i+1}`, answer: i % 3 !== 0, explanation: "Recall basics.", difficulty: diff, tags: [tag] });
      }
    }
    return { id: quizId, courseId, questions: qs };
  }

  const quizzes = courses.map(c => makeQuiz(c.tags[0], c.id, c.quizId));

  const users = [
    { id: "u_admin", name: "Admin", username: "admin@demo.com", password: "Admin@123", role: "admin", interests: ["Java","Web Dev"], dailyGoalMin: 30, points: 520, badges: ["First Quiz","High Scorer"], enrollments: {}, lastActive: [todayISO()] },
    { id: "u_aman", name: "Aman", username: "aman@demo.com", password: "Aman@123", role: "user", interests: ["DSA","Java","Aptitude"], dailyGoalMin: 20, points: 240, badges: ["Course Starter"], enrollments: {}, lastActive: [todayISO()] },
    { id: "u_riya", name: "Riya", username: "riya@demo.com", password: "Riya@123", role: "user", interests: ["Web Dev","DBMS"], dailyGoalMin: 25, points: 390, badges: ["First Quiz","High Scorer"], enrollments: {}, lastActive: [todayISO()] }
  ];

  // Generate ~247 additional users
  const targetUsers = 250;
  let counter = 0;
  while (users.length < targetUsers) {
    const fn = pick(firstNames);
    const ln = pick(lastNames);
    const num = (10 + counter).toString();
    const name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${num}@demo.com`;
    const interests = pickMany(interestsPool, 2 + Math.floor(Math.random() * 3));
    const points = Math.floor(Math.random() * 2000);
    const badges = [];
    if (points > 0) badges.push("Course Starter");
    if (points >= 800) badges.push("High Scorer");
    const enrollments = {};
    // random partial progress
    const enrollChance = Math.random();
    if (enrollChance > 0.4) {
      const enrolledCourses = pickMany(courses, 1 + Math.floor(Math.random() * 3));
      enrolledCourses.forEach(c => {
        const doneCount = Math.floor(Math.random() * c.modules.length);
        const done = new Set();
        for (let i = 0; i < doneCount; i++) done.add(c.modules[i].id);
        enrollments[c.id] = { completed: Array.from(done), lastModuleId: doneCount ? c.modules[doneCount-1].id : null, quizScores: [] };
      });
    }
    users.push({ id: uid("u"), name, username: email, password: "Pass@123", role: "user", interests, dailyGoalMin: 15 + Math.floor(Math.random()*30), points, badges, enrollments, lastActive: [todayISO()] });
    counter++;
  }

  const db = { users, courses, quizzes };
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  localStorage.setItem(SEED_VER_KEY, SEED_VERSION);
  return db;
}

function loadDB() { return JSON.parse(localStorage.getItem(DB_KEY)) || seedIfNeeded(); }
function saveDB(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

function setToken(userId) {
  const token = `token-${userId}-${Date.now()}`;
  localStorage.setItem(TOKEN_KEY, JSON.stringify({ token, userId }));
  return token;
}
function getToken() { try { return JSON.parse(localStorage.getItem(TOKEN_KEY)); } catch { return null; } }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

function courseProgress(enrollment, course) {
  if (!enrollment) return 0;
  const total = course.modules.length;
  const done = (enrollment.completed ? (Array.isArray(enrollment.completed) ? enrollment.completed.length : Array.from(enrollment.completed).length) : 0);
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function computeStreak(dates) {
  const uniq = Array.from(new Set(dates || [])).sort();
  if (uniq.length === 0) return 0;
  const today = new Date();
  let streak = 0;
  for (let i = uniq.length - 1; i >= 0; i--) {
    const d = new Date(uniq[i]);
    const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24));
    if (diff === streak) streak++; else if (diff > streak) break;
  }
  return streak;
}

function evaluateBadges(user, course, result) {
  const newBadges = new Set(user.badges || []);
  if (result && !newBadges.has("First Quiz")) newBadges.add("First Quiz");
  if (result && result.percent >= 80) newBadges.add("High Scorer");
  const anyCourseStarted = Object.values(user.enrollments || {}).some(e => (e.completed || []).length > 0);
  if (anyCourseStarted) newBadges.add("Course Starter");
  const anyCourseMaster = Object.entries(user.enrollments || {}).some(([cid, e]) => {
    const c = loadDB().courses.find(x => x.id === cid);
    if (!c) return false;
    return courseProgress(e, c) === 100;
  });
  if (anyCourseMaster) newBadges.add("Course Master");
  const streak = computeStreak(user.lastActive || []);
  if (streak >= 3) newBadges.add("Consistency Star");
  return Array.from(newBadges);
}

function recommendCoursesForUser(user, courses) {
  const w1 = 0.5, w2 = 0.25, w3 = 0.1, w4 = 0.15;
  const difficultyScore = (d) => (d === "Beginner" ? 1 : d === "Intermediate" ? 0.7 : 0.4);
  const recentScoreByCourse = {};
  Object.entries(user.enrollments || {}).forEach(([cid, e]) => {
    const last = (e.quizScores || []).slice(-1)[0];
    if (last) recentScoreByCourse[cid] = last.score;
  });
  const scored = courses.map((c) => {
    const interestMatch = c.tags.filter((t) => (user.interests || []).includes(t)).length / Math.max(1, c.tags.length);
    const recent = recentScoreByCourse[c.id];
    const needImprovement = recent != null ? (recent < 70 ? 1 : 0) : 0;
    const popularity = Math.min(1, (c.enrollCount || 0) / 600);
    const difficultyFit = difficultyScore(c.difficulty);
    const score = interestMatch*w1 + needImprovement*w2 + popularity*w3 + difficultyFit*w4;
    return { course: c, score };
  }).sort((a,b) => b.score - a.score).map(x => x.course);
  return scored.slice(0, 4);
}

export async function login(username, password) {
  return withLatency(() => {
    const db = loadDB();
    const user = db.users.find(u => u.username === username && u.password === password);
    if (!user) throw new Error("Invalid credentials");
    user.lastActive = Array.from(new Set([...(user.lastActive || []), todayISO()]));
    saveDB(db);
    return { token: setToken(user.id), userId: user.id };
  });
}

export async function signup(userObj) {
  return withLatency(() => {
    const db = loadDB();
    if (db.users.find(u => u.username === userObj.username)) throw new Error("User already exists");
    if (!userObj.password || userObj.password.length < 6) throw new Error("Password too short");
    const newUser = { id: uid("u"), name: userObj.name || "New User", username: userObj.username, password: userObj.password, role: "user", interests: [], dailyGoalMin: 0, points: 0, badges: [], enrollments: {}, lastActive: [todayISO()] };
    db.users.push(newUser);
    saveDB(db);
    return { token: setToken(newUser.id), userId: newUser.id };
  });
}

export async function getCurrentUser(token) {
  return withLatency(() => {
    const ses = getToken();
    if (!ses || ses.token !== token) throw new Error("Not authenticated");
    const db = loadDB();
    const user = db.users.find(u => u.id === ses.userId);
    if (!user) throw new Error("User not found");
    return user;
  });
}

export async function updateUser(token, partial) {
  return withLatency(() => {
    const ses = getToken();
    if (!ses || ses.token !== token) throw new Error("Not authenticated");
    const db = loadDB();
    const idx = db.users.findIndex(u => u.id === ses.userId);
    if (idx < 0) throw new Error("User not found");
    db.users[idx] = { ...db.users[idx], ...partial };
    saveDB(db);
    return db.users[idx];
  });
}

export async function listCourses() {
  const list = await apiGetCourses();
  return Array.isArray(list) ? list.map(normalizeCourse) : [];
}
export async function getCourse(courseId) {
  const idStr = String(courseId);
  const isNumeric = /^\d+$/.test(idStr);
  if (isNumeric) {
    const c = await apiGetCourseById(Number(courseId));
    const norm = normalizeCourse(c);
    try {
      const modules = await apiGetModules(Number(courseId));
      norm.modules = Array.isArray(modules) ? modules.map((m, idx) => ({
        id: m.id,
        title: m.title,
        content: m.content || '',
        estimatedMin: typeof m.estimatedMin === 'number' ? m.estimatedMin : 10,
        position: m.position ?? (idx+1)
      })) : [];
    } catch {}
    return norm;
  }
  // Fallback to legacy local dataset for non-numeric client IDs like "c_java"
  return withLatency(() => {
    const db = loadDB();
    const c = db.courses.find(x => x.id === courseId);
    if (!c) throw new Error("Course not found");
    return c;
  });
}

export async function enrollInCourse(token, courseId) {
  const ses = getToken(); if (!ses || ses.token !== token) throw new Error("Not authenticated");
  const db = loadDB(); const user = db.users.find(u => u.id === ses.userId); if (!user) throw new Error("User not found");
  const email = user.username; // dataset stores email in username
  try { await enrollApi(email, Number.isFinite(courseId) ? courseId : Number(courseId)); } catch {}
  // local sync for UI
  if (!user.enrollments[courseId]) user.enrollments[courseId] = { completed: [], lastModuleId: null, quizScores: [] };
  saveDB(db);
  return true;
}

export async function unenrollFromCourse(token, courseId) {
  const ses = getToken(); if (!ses || ses.token !== token) throw new Error("Not authenticated");
  const db = loadDB(); const user = db.users.find(u => u.id === ses.userId); if (!user) throw new Error("User not found");
  const email = user.username;
  try { await unenrollApi(email, Number.isFinite(courseId) ? courseId : Number(courseId)); } catch {}
  delete user.enrollments[courseId]; saveDB(db); return true;
}

export async function markModuleComplete(token, courseId, moduleId) {
  const ses = getToken(); if (!ses || ses.token !== token) throw new Error("Not authenticated");
  const db = loadDB(); const user = db.users.find(u => u.id === ses.userId); const course = db.courses.find(c => c.id === courseId);
  if (!user || !course) throw new Error("Not found");
  const email = user.username;
  try { await completeModuleApi(email, Number.isFinite(courseId) ? courseId : Number(courseId), String(moduleId)); } catch {}
  // local sync
  if (!user.enrollments[courseId]) user.enrollments[courseId] = { completed: [], lastModuleId: null, quizScores: [] };
  const e = user.enrollments[courseId];
  if (!e.completed.includes(moduleId)) e.completed.push(moduleId);
  e.lastModuleId = moduleId;
  user.points = (user.points || 0) + 5;
  user.badges = evaluateBadges(user, course, null);
  user.lastActive = Array.from(new Set([...(user.lastActive || []), todayISO()]));
  saveDB(db);
  return { progress: courseProgress(e, course), points: user.points, badges: user.badges };
}

export async function getQuiz(quizId) {
  // Try backend first
  try {
    const res = await apiGetQuiz(quizId);
    const mapped = {
      id: res.id,
      courseId: res.courseId,
      questions: (res.questions || []).map(q => ({
        id: q.id,
        type: q.type,
        question: q.question,
        options: Array.isArray(q.options) ? q.options : [],
        // unify to 'answer' key expected by UI
        answer: q.type === 'mcq' ? q.answer : q.answerBool,
        explanation: 'Review notes.',
        difficulty: q.difficulty || 'easy',
        tags: []
      }))
    };
    return mapped;
  } catch (e) {
    // Fallback to legacy local dataset
    return withLatency(() => {
      const db = loadDB();
      const q = db.quizzes.find(x => x.id === quizId);
      if (!q) throw new Error("Quiz not found");
      return q;
    });
  }
}

export async function submitQuiz(token, quizId, answers) {
  // Try backend first
  try {
    const { submitQuizApi } = await import('./api/client');
    const res = await submitQuizApi(quizId, answers);
    // Local session updates to keep UI points/badges in sync (best-effort)
    const ses = getToken(); if (ses && ses.token === token) {
      const db = loadDB(); const user = db.users.find(u => u.id === ses.userId); const course = db.courses.find(c => c.quizId === quizId);
      if (user && course) {
        user.points = (user.points || 0) + (res.pointsEarned || 0);
        if (!user.enrollments[course.id]) user.enrollments[course.id] = { completed: [], lastModuleId: null, quizScores: [] };
        const e = user.enrollments[course.id]; e.quizScores = [...(e.quizScores || []), { quizId, score: res.percent, date: todayISO() }];
        user.badges = evaluateBadges(user, course, { percent: res.percent }); user.lastActive = Array.from(new Set([...(user.lastActive || []), todayISO()]));
        saveDB(db);
      }
    }
    return { percent: res.percent, pointsEarned: res.pointsEarned, totalPoints: (loadDB().users.find(u=>u.id===getToken()?.userId)?.points)||0, badges: (loadDB().users.find(u=>u.id===getToken()?.userId)?.badges)||[] };
  } catch (e) {
    // Fallback to legacy local calculation
    return withLatency(() => {
      const ses = getToken(); if (!ses || ses.token !== token) throw new Error("Not authenticated");
      const db = loadDB(); const quiz = db.quizzes.find(q => q.id === quizId); if (!quiz) throw new Error("Quiz not found");
      const user = db.users.find(u => u.id === ses.userId); const course = db.courses.find(c => c.quizId === quizId);
      let correct = 0; quiz.questions.forEach(q => { const ans = answers[q.id]; if (q.type === "mcq" && typeof ans === "number") { if (ans === q.answer) correct++; } else if (q.type === "tf" && typeof ans === "boolean") { if (ans === q.answer) correct++; } });
      const percent = Math.round((correct / quiz.questions.length) * 100);
      const pointsEarned = correct * 10; user.points = (user.points || 0) + pointsEarned;
      if (!user.enrollments[course.id]) user.enrollments[course.id] = { completed: [], lastModuleId: null, quizScores: [] };
      const e2 = user.enrollments[course.id]; e2.quizScores = [...(e2.quizScores || []), { quizId, score: percent, date: todayISO() }];
      user.badges = evaluateBadges(user, course, { percent }); user.lastActive = Array.from(new Set([...(user.lastActive || []), todayISO()]));
      saveDB(db);
      return { percent, pointsEarned, totalPoints: user.points, badges: user.badges };
    });
  }
}

export async function getLeaderboard({ page = 1, pageSize = 25, search = "" } = {}) {
  return withLatency(() => {
    const db = loadDB();
    const q = search.trim().toLowerCase();
    const filtered = db.users.filter(u => !q || u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q));
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const rows = filtered
      .map(u => ({ id: u.id, name: u.name, username: u.username, points: u.points || 0, badges: u.badges || [] }))
      .sort((a,b) => b.points - a.points)
      .slice(start, start + pageSize);
    return { rows, total, page, pageSize };
  });
}

export async function adminCreateCourse(courseObj) {
  // Expecting courseObj fields compatible with backend Course entity
  const payload = {
    title: courseObj.title || 'Untitled Course',
    description: courseObj.description || '',
    difficulty: courseObj.difficulty || 'Beginner',
    tags: Array.isArray(courseObj.tags) ? courseObj.tags.join(',') : (courseObj.tags || ''),
    enrollCount: courseObj.enrollCount ?? 0,
    quizId: courseObj.quizId || null
  };
  const created = await apiCreateCourse(payload);
  return normalizeCourse(created);
}

export async function adminUpdateCourse(id, patch) {
  const payload = { ...patch };
  if (Array.isArray(payload.tags)) payload.tags = payload.tags.join(',');
  const updated = await apiUpdateCourse(id, payload);
  return normalizeCourse(updated);
}

export async function adminDeleteCourse(id) {
  await apiDeleteCourse(id);
  return true;
}

export async function getRecommendations(token) {
  return withLatency(() => {
    const ses = getToken(); if (!ses || ses.token !== token) throw new Error("Not authenticated");
    const db = loadDB(); const user = db.users.find(u => u.id === ses.userId);
    return recommendCoursesForUser(user, db.courses);
  });
}

export function logout() { clearToken(); }
export function getSession() { return getToken(); }
export function getCourseProgressForUser(user, courseId) {
  const db = loadDB(); const course = db.courses.find(c => c.id === courseId); const e = (user.enrollments || {})[courseId]; return course ? courseProgress(e, course) : 0;
}
export function computeWeeklyActivity(user) {
  const last7 = []; const today = new Date();
  for (let i = 6; i >= 0; i--) { const d = new Date(today); d.setDate(today.getDate() - i); const key = d.toISOString().slice(0,10); const count = (user.lastActive || []).filter(x => x === key).length; last7.push({ date: key, count }); }
  return last7;
}
export function getFormattedDate(dStr) { const d = new Date(dStr); const dd = String(d.getDate()).padStart(2,"0"); const mm = String(d.getMonth()+1).padStart(2,"0"); const yy = d.getFullYear(); return `${dd}-${mm}-${yy}`; }

export function getStats() {
  const db = loadDB();
  return { users: db.users.length, courses: db.courses.length };
}

export function getDataset() { return loadDB(); }
export function importDataset(obj) {
  if (!obj || !Array.isArray(obj.users) || !Array.isArray(obj.courses) || !Array.isArray(obj.quizzes)) throw new Error("Invalid dataset");
  saveDB({ users: obj.users, courses: obj.courses, quizzes: obj.quizzes });
  localStorage.setItem(SEED_VER_KEY, SEED_VERSION);
}
