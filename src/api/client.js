const JSON_HEADERS = { 'Content-Type': 'application/json' };
const DEFAULT_TIMEOUT = 10000; // 10s

function buildErrorMessage(status, statusText, bodyText) {
  // Try to parse JSON error for better messages
  try {
    const obj = JSON.parse(bodyText);
    const parts = [];
    if (obj.message) parts.push(obj.message);
    else if (obj.error) parts.push(obj.error);
    else if (obj.title) parts.push(obj.title);
    if (obj.path) parts.push(`Path: ${obj.path}`);
    const core = parts.join(' | ');
    if (core) return `${status} ${statusText || ''}`.trim() + `: ${core}`;
  } catch {}
  const text = (bodyText || '').trim();
  if (text) return `${status} ${statusText || ''}`.trim() + `: ${text}`;
  return `${status} ${statusText || 'Error'}`;
}

async function handle(res) {
  if (!res.ok) {
    let body = '';
    try { body = await res.text(); } catch {}
    throw new Error(buildErrorMessage(res.status, res.statusText, body));
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

async function request(url, options = {}, timeoutMs = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return await handle(res);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Network timeout. Please try again.');
    }
    // Network or other fetch error
    if (err instanceof TypeError) {
      throw new Error('Network error: ' + (err.message || 'Failed to connect'));
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

export async function getHello() {
  return request('/api/hello');
}

// Courses API
export async function getCourses() {
  return request('/api/courses');
}

export async function getCourseById(id) {
  return request(`/api/courses/${id}`);
}

export async function createCourse(course) {
  return request('/api/courses', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(course)
  });
}

export async function updateCourse(id, patch) {
  return request(`/api/courses/${id}`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify(patch)
  });
}

export async function deleteCourse(id) {
  // DELETE may return 204 No Content
  const res = await request(`/api/courses/${id}`, { method: 'DELETE' }).catch((e) => { throw e; });
  return res;
}

// Quiz API
export async function getQuiz(quizId) {
  return request(`/api/quizzes/${quizId}`);
}

// Modules API
export async function getModules(courseId) {
  return request(`/api/courses/${courseId}/modules`);
}

export async function submitQuizApi(quizId, answers) {
  return request(`/api/quizzes/${quizId}/submit`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ answers })
  });
}

// Enrollment APIs
export async function enrollApi(email, courseId) {
  return request('/api/enrollments/enroll', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, courseId })
  });
}

export async function unenrollApi(email, courseId) {
  return request('/api/enrollments/unenroll', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, courseId })
  });
}

export async function completeModuleApi(email, courseId, moduleId) {
  return request('/api/enrollments/complete', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, courseId, moduleId })
  });
}
