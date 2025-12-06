const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function handle(res) {
  if (!res.ok) {
    let msg = 'Request failed';
    try { const t = await res.text(); if (t) msg = t; } catch {}
    throw new Error(msg);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export async function getHello() {
  const res = await fetch('/api/hello');
  return handle(res);
}

// Courses API
export async function getCourses() {
  const res = await fetch('/api/courses');
  return handle(res);
}

export async function getCourseById(id) {
  const res = await fetch(`/api/courses/${id}`);
  return handle(res);
}

export async function createCourse(course) {
  const res = await fetch('/api/courses', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(course)
  });
  return handle(res);
}

export async function updateCourse(id, patch) {
  const res = await fetch(`/api/courses/${id}`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify(patch)
  });
  return handle(res);
}

export async function deleteCourse(id) {
  const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) return handle(res);
}

// Quiz API
export async function getQuiz(quizId) {
  const res = await fetch(`/api/quizzes/${quizId}`);
  return handle(res);
}

// Modules API
export async function getModules(courseId) {
  const res = await fetch(`/api/courses/${courseId}/modules`);
  return handle(res);
}

export async function submitQuizApi(quizId, answers) {
  const res = await fetch(`/api/quizzes/${quizId}/submit`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ answers })
  });
  return handle(res);
}

// Enrollment APIs
export async function enrollApi(email, courseId) {
  const res = await fetch('/api/enrollments/enroll', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, courseId })
  });
  return handle(res);
}

export async function unenrollApi(email, courseId) {
  const res = await fetch('/api/enrollments/unenroll', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, courseId })
  });
  return handle(res);
}

export async function completeModuleApi(email, courseId, moduleId) {
  const res = await fetch('/api/enrollments/complete', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, courseId, moduleId })
  });
  return handle(res);
}
