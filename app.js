(() => {
  const client = window.supabase.createClient(
    window.DCC_SUPABASE_URL,
    window.DCC_SUPABASE_PUBLISHABLE_KEY
  );
  const state = {
    session: null,
    profile: null,
    clients: [],
    jobs: [],
    students: [],
    applications: [],
    notes: [],
    view: 'dashboard',
    query: '',
    status: 'All statuses',
    roleChoice: 'student',
    authMode: 'login'
  };
  const app = document.getElementById('app');
  const logo = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M6 5h8a11 11 0 0 1 0 22H6V5Z" stroke="currentColor" stroke-width="2.6"/><path d="M27 10h-4a6 6 0 0 0 0 12h4M18 16h8" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const initials = value => String(value || '?').split(/\s+/).slice(0, 2).map(part => part[0] || '').join('').toUpperCase();
  const dateLabel = value => value ? new Date(value).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}) : '—';
  const isAdmin = () => state.profile?.role === 'admin';
  const toast = message => {
    document.querySelector('.toast')?.remove();
    const node = document.createElement('div');
    node.className = 'toast';
    node.textContent = message;
    document.body.append(node);
    setTimeout(() => node.remove(), 3000);
  };
  const showError = message => {
    const target = document.getElementById('form-error');
    if (target) target.textContent = message;
    else toast(message);
  };

  async function loadData() {
    const userId = state.session.user.id;
    const profileQuery = isAdmin()
      ? client.from('profiles').select('*').order('full_name')
      : client.from('profiles').select('*').eq('id', userId).single();
    const requests = [
      profileQuery,
      client.from('jobs_with_clients').select('*').order('created_at', {ascending:false}),
      client.from('applications').select('*').order('applied_at', {ascending:false})
    ];
    if (isAdmin()) {
      requests.push(client.from('clients').select('*').order('name'));
      requests.push(client.from('application_admin_notes').select('*'));
    }
    const results = await Promise.all(requests);
    const failure = results.find(result => result.error);
    if (failure) throw failure.error;

    const profiles = isAdmin() ? results[0].data : [results[0].data];
    state.students = (profiles || []).map(profile => ({
      ...profile,
      name: profile.full_name,
      skills: profile.skills || '',
      resume: profile.resume_url || ''
    }));
    state.jobs = results[1].data || [];
    state.applications = results[2].data || [];
    state.clients = isAdmin() ? (results[3].data || []) : [];
    state.notes = isAdmin() ? (results[4].data || []) : [];
    state.applications = state.applications.map(item => ({
      ...item,
      studentId: item.student_id,
      jobId: item.job_id,
      applied: item.applied_at,
      note: state.notes.find(note => note.application_id === item.id)?.note || ''
    }));
  }

  function loginScreen() {
    app.innerHTML = `<main class="login-shell"><section class="login-story"><div class="login-brand"><span class="brand-mark">${logo}</span><strong>Design Career Connect</strong></div><div class="story-copy"><div class="eyebrow">A people-first talent partner</div><h1>Good work starts with a <em>good match.</em></h1><p>Connecting thoughtful people with teams doing meaningful work. Your next chapter starts here.</p></div><div class="story-foot">© 2026 Design Career Connect · New York · Everywhere</div></section><section class="login-panel"><form class="login-box" id="login-form"><div class="eyebrow">Welcome back</div><h2 id="login-heading">Student login</h2><p>Choose your portal, then sign in with your account.</p><div class="demo-box"><span>Choose your portal</span><div class="demo-actions"><button class="${state.roleChoice === 'admin' ? 'selected' : ''}" type="button" data-role="admin"><span class="portal-choice-icon" aria-hidden="true">▦</span><span class="portal-choice-copy"><b>Admin login</b><small>Manage clients, jobs and candidates</small></span><span class="portal-choice-arrow" aria-hidden="true">→</span></button><button class="${state.roleChoice === 'student' ? 'selected' : ''}" type="button" data-role="student"><span class="portal-choice-icon" aria-hidden="true">♙</span><span class="portal-choice-copy"><b>Student login</b><small>Explore jobs and applications</small></span><span class="portal-choice-arrow" aria-hidden="true">→</span></button></div></div><div class="form-field"><label for="login-email">Email address</label><input class="field" id="login-email" type="email" autocomplete="username" required placeholder="you@example.com"></div><div class="form-field"><label for="login-password">Password</label><input class="field" id="login-password" type="password" autocomplete="current-password" required placeholder="Enter your password"></div><div class="login-error" id="form-error" role="alert"></div><button class="btn btn-primary login-submit" type="submit">Sign in <span aria-hidden="true">→</span></button><div class="login-note">Sign-in is secured by Supabase. Ask your agency admin for an account.</div></form></section></main>`;
    app.querySelector('.login-note').textContent = 'Student accounts are open for registration. Admin access is invitation-only.';
    app.querySelectorAll('[data-role]').forEach(button => button.addEventListener('click', () => {
      state.roleChoice = button.dataset.role;
      if (state.roleChoice === 'admin') state.authMode = 'login';
      app.querySelectorAll('[data-role]').forEach(option => option.classList.toggle('selected', option === button));
      updateAuthMode();
    }));
    document.getElementById('login-form').addEventListener('submit', authenticate);
    enableStudentRegistration();
  }

  function enableStudentRegistration() {
    const form = document.getElementById('login-form');
    const emailField = document.getElementById('login-email').closest('.form-field');
    const error = document.getElementById('form-error');
    const submit = form.querySelector('[type="submit"]');
    const nameField = document.createElement('div');
    nameField.className = 'form-field';
    nameField.innerHTML = '<label for="register-name">Full name</label><input class="field" id="register-name" name="full_name" autocomplete="name" placeholder="Your full name">';
    form.insertBefore(nameField, emailField);
    const confirmField = document.createElement('div');
    confirmField.className = 'form-field';
    confirmField.innerHTML = '<label for="register-password-confirm">Confirm password</label><input class="field" id="register-password-confirm" type="password" autocomplete="new-password" placeholder="Enter your password again">';
    form.insertBefore(confirmField, error);
    const switcher = document.createElement('div');
    switcher.className = 'auth-switch';
    switcher.innerHTML = '<span></span><button type="button" class="text-link" data-auth-toggle></button>';
    submit.after(switcher);
    switcher.querySelector('[data-auth-toggle]').addEventListener('click', () => {
      state.authMode = state.authMode === 'login' ? 'register' : 'login';
      updateAuthMode();
    });
    updateAuthMode();
  }

  function updateAuthMode() {
    const registering = state.roleChoice === 'student' && state.authMode === 'register';
    const student = state.roleChoice === 'student';
    const nameField = document.getElementById('register-name')?.closest('.form-field');
    const confirmField = document.getElementById('register-password-confirm')?.closest('.form-field');
    const nameInput = document.getElementById('register-name');
    const password = document.getElementById('login-password');
    const toggle = document.querySelector('[data-auth-toggle]');
    const switcher = toggle?.parentElement;
    const error = document.getElementById('form-error');
    nameField.hidden = !registering;
    confirmField.hidden = !registering;
    nameInput.required = registering;
    password.autocomplete = registering ? 'new-password' : 'current-password';
    password.minLength = registering ? 8 : 0;
    document.getElementById('register-password-confirm').required = registering;
    document.getElementById('login-heading').textContent = state.roleChoice === 'admin' ? 'Admin login' : registering ? 'Create student account' : 'Student login';
    document.querySelector('#login-form > p').textContent = registering ? 'Create an account to apply for roles and track your applications.' : 'Choose your portal, then sign in with your account.';
    document.querySelector('#login-form .login-submit').innerHTML = registering ? 'Create account <span aria-hidden="true">→</span>' : 'Sign in <span aria-hidden="true">→</span>';
    switcher.hidden = !student;
    switcher.querySelector('span').textContent = registering ? 'Already registered?' : 'New to Design Career Connect?';
    toggle.textContent = registering ? 'Sign in' : 'Register';
    error.textContent = '';
  }

  async function authenticate(event) {
    event.preventDefault();
    const button = event.currentTarget.querySelector('[type="submit"]');
    button.disabled = true;
    button.textContent = state.authMode === 'register' ? 'Creating account…' : 'Signing in…';
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (state.authMode === 'register') {
      const fullName = document.getElementById('register-name').value.trim();
      const confirmation = document.getElementById('register-password-confirm').value;
      if (password !== confirmation) {
        button.disabled = false;
        updateAuthMode();
        showError('The passwords do not match.');
        return;
      }
      const {data, error} = await client.auth.signUp({
        email,
        password,
        options: {
          data: {full_name: fullName},
          emailRedirectTo: `${window.location.origin}${window.location.pathname}`
        }
      });
      if (error) {
        button.disabled = false;
        updateAuthMode();
        showError(error.message);
        return;
      }
      if (!data.session) {
        state.authMode = 'login';
        button.disabled = false;
        updateAuthMode();
        showError('Account created. Check your email to confirm it, then sign in here.');
        return;
      }
      await completeSignIn(data.session, 'student');
      return;
    }
    const {data, error} = await client.auth.signInWithPassword({email, password});
    if (error) {
      button.disabled = false;
      updateAuthMode();
      showError(error.message);
      return;
    }
    await completeSignIn(data.session, state.roleChoice);
  }

  async function completeSignIn(session, expectedRole) {
    state.session = session;
    const {data:profile, error:profileError} = await client.from('profiles').select('*').eq('id', session.user.id).single();
    if (profileError || profile.role !== expectedRole) {
      await client.auth.signOut();
      state.session = null;
      const button = document.querySelector('#login-form .login-submit');
      if (button) button.disabled = false;
      updateAuthMode();
      showError(profileError?.message || `This account is not registered for the ${expectedRole} portal.`);
      return;
    }
    state.profile = profile;
    state.view = isAdmin() ? 'dashboard' : 'jobs';
    try {
      await loadData();
      render();
    } catch (loadError) {
      state.session = null;
      state.profile = null;
      await client.auth.signOut();
      loginScreen();
      showError(`Could not load portal data: ${loadError.message}`);
    }
  }

  function navigation() {
    const admin = isAdmin();
    const entries = admin
      ? [['dashboard','▦','Overview'],['clients','◈','Clients'],['jobs','▤','Vacancies'],['students','♙','Candidates'],['applications','↗','Applications']]
      : [['jobs','▤','Explore jobs'],['applications','↗','My applications'],['profile','♙','My profile']];
    return `<aside class="sidebar"><div class="brand"><span class="brand-mark">${logo}</span><div class="brand-name">Design Career<br>Connect<small>${admin?'AGENCY PORTAL':'STUDENT PORTAL'}</small></div></div><div class="nav-label">${admin?'Workspace':'Your journey'}</div><nav class="nav">${entries.map(([id,symbol,label]) => `<button class="${state.view === id ? 'active' : ''}" data-view="${id}"><span class="nav-icon" aria-hidden="true">${symbol}</span><span>${label}</span></button>`).join('')}</nav><div class="side-bottom">${admin?'<div class="support"><strong>People first, always.</strong><p>Thoughtful hiring starts with a conversation.</p></div>':''}<div class="identity"><div class="avatar">${initials(state.profile.full_name)}</div><div class="identity-text"><b>${esc(state.profile.full_name)}</b><span>${esc(state.profile.email)}</span></div><button class="logout" title="Sign out" aria-label="Sign out" data-logout>↪</button></div></div></aside>`;
  }

  function header(title) {
    return `<header class="topbar"><div class="crumb">Design Career Connect &nbsp;/&nbsp; <strong>${esc(title)}</strong></div><div class="top-actions"><span class="date-label">${new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</span><button class="icon-button" data-logout aria-label="Sign out" title="Sign out">↪</button></div></header>`;
  }

  function metric(label, value, note, symbol) {
    return `<div class="metric"><div class="metric-top"><span>${label}</span><span class="metric-icon">${symbol}</span></div><div class="metric-value">${value}</div><div class="metric-note">${note}</div></div>`;
  }

  function dashboardView() {
    const newApplications = state.applications.filter(item => item.status === 'New').length;
    return `<div class="page"><div class="page-heading"><div><div class="eyebrow">Agency overview</div><h1>Welcome, ${esc(state.profile.full_name.split(' ')[0])}</h1><p class="subhead">Your hiring pipeline at a glance.</p></div><div class="heading-actions"><button class="btn btn-primary" data-open="job">＋ Post a vacancy</button></div></div><div class="metrics">${metric('Open vacancies',state.jobs.filter(job=>job.status==='Open').length,'Across '+state.clients.length+' client partners','▤')}${metric('Active candidates',state.students.length,'In your talent network','♙')}${metric('Applications',state.applications.length,'All-time submissions','↗')}${metric('Needs review',newApplications,'New applications','◷')}</div><section class="panel"><div class="panel-head"><div><div class="panel-title">Recent applications</div><div class="panel-sub">Latest candidate activity</div></div><button class="text-link" data-view="applications">All applications →</button></div>${applicationTable(state.applications.slice(0,6),true)}</section></div>`;
  }

  function applicationTable(applications, admin) {
    const rows = applications.map(item => {
      const student = state.students.find(profile => profile.id === item.student_id);
      const job = state.jobs.find(role => role.id === item.job_id);
      return `<tr>${admin?`<td><span class="table-primary">${esc(student?.full_name || 'Candidate')}</span><span class="table-secondary">${esc(student?.email || '')}</span></td>`:''}<td><span class="table-primary">${esc(job?.title || 'Role')}</span><span class="table-secondary">${esc(job?.company || '')}</span></td>${admin?`<td>${esc(student?.qualification || '—')}</td>`:''}<td>${dateLabel(item.applied_at)}</td><td><span class="status ${statusClass(item.status)}">${esc(item.status)}</span></td>${admin?`<td><button class="btn btn-light btn-sm" data-edit="application:${item.id}">Update</button></td>`:''}</tr>`;
    }).join('');
    return `<div class="table-wrap"><table class="data-table"><thead><tr>${admin?'<th>Candidate</th>':''}<th>Position</th>${admin?'<th>Education</th>':''}<th>Applied</th><th>Status</th>${admin?'<th></th>':''}</tr></thead><tbody>${rows || `<tr><td colspan="${admin?6:3}"><div class="empty">No applications to show yet.</div></td></tr>`}</tbody></table></div>`;
  }

  function statusClass(value) {
    return value === 'Interview' ? 'interview' : value === 'In review' ? 'review' : value === 'Rejected' ? 'rejected' : value === 'Closed' ? 'closed' : value === 'Draft' ? 'draft' : '';
  }

  function clientsView() {
    const rows = state.clients.filter(item => `${item.name} ${item.industry} ${item.contact_name}`.toLowerCase().includes(state.query.toLowerCase()));
    return `<div class="page"><div class="page-heading"><div><div class="eyebrow">Relationships</div><h1>Client partners</h1><p class="subhead">Manage your hiring relationships.</p></div><div class="heading-actions"><button class="btn btn-primary" data-open="client">＋ Add client</button></div></div><div class="toolbar"><div class="search"><input class="field" data-search placeholder="Search clients or contacts" value="${esc(state.query)}"></div><span class="date-label">${rows.length} partners</span></div><div class="content-panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Client</th><th>Primary contact</th><th>Industry</th><th>Open roles</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(item => `<tr><td><span class="table-primary">${esc(item.name)}</span><span class="table-secondary">${esc(item.email)}</span></td><td>${esc(item.contact_name)}<span class="table-secondary">${esc(item.phone)}</span></td><td>${esc(item.industry)}</td><td>${state.jobs.filter(job=>job.client_id===item.id&&job.status==='Open').length}</td><td><span class="status">${esc(item.status)}</span></td><td><button class="btn btn-light btn-sm" data-edit="client:${item.id}">Edit</button></td></tr>`).join('') || '<tr><td colspan="6"><div class="empty">No clients yet.</div></td></tr>'}</tbody></table></div></div></div>`;
  }

  function jobsView() {
    const jobs = state.jobs.filter(job => (isAdmin() || job.status === 'Open') && `${job.title} ${job.company} ${job.location} ${job.category}`.toLowerCase().includes(state.query.toLowerCase()) && (!isAdmin() || state.status === 'All statuses' || state.status === job.status));
    return `<div class="page"><div class="page-heading"><div><div class="eyebrow">${isAdmin()?'Hiring pipeline':'Find your next chapter'}</div><h1>${isAdmin()?'Vacancies':'Explore roles'}</h1><p class="subhead">${isAdmin()?'Manage opportunities across your client network.':'Thoughtful roles from teams doing meaningful work.'}</p></div>${isAdmin()?'<div class="heading-actions"><button class="btn btn-primary" data-open="job">＋ Post a vacancy</button></div>':''}</div><div class="toolbar"><div class="search"><input class="field" data-search placeholder="Search roles, companies or locations" value="${esc(state.query)}"></div>${isAdmin()?`<select data-status><option>All statuses</option>${['Open','Paused','Closed'].map(value=>`<option ${state.status===value?'selected':''}>${value}</option>`).join('')}</select>`:''}<span class="date-label">${jobs.length} roles</span></div><div class="job-grid">${jobs.map(job => {
      const applied = state.applications.some(item => item.job_id === job.id && item.student_id === state.session.user.id);
      return `<article class="job-card"><div class="job-card-head"><div><h2 class="job-title">${esc(job.title)}</h2><div class="company-line">${esc(job.company)} · ${esc(job.location)}</div></div><div class="company-mark">${initials(job.company)}</div></div>${isAdmin()?`<div style="margin-top:12px"><span class="status ${statusClass(job.status)}">${esc(job.status)}</span></div>`:''}<div class="job-tags"><span class="tag">${esc(job.employment_type)}</span><span class="tag">${esc(job.category)}</span></div><p class="job-description">${esc(job.description)}</p><div class="job-foot"><span class="salary">${esc(job.salary)}</span><span>${isAdmin()?`<button class="btn btn-light btn-sm" data-edit="job:${job.id}">Edit</button>`:applied?'<span class="status">Applied</span>':'<button class="btn btn-primary btn-sm" data-apply="'+job.id+'">Apply now →</button>'}</span></div></article>`;
    }).join('') || '<div class="content-panel"><div class="empty">No roles found.</div></div>'}</div></div>`;
  }

  function studentsView() {
    const students = state.students.filter(item => `${item.full_name} ${item.email} ${item.skills} ${item.qualification}`.toLowerCase().includes(state.query.toLowerCase()));
    return `<div class="page"><div class="page-heading"><div><div class="eyebrow">Talent network</div><h1>Candidates</h1><p class="subhead">Candidate profiles and portal accounts.</p></div><div class="heading-actions"><button class="btn btn-light" data-refresh-candidates>↻ Refresh</button><button class="btn btn-primary" data-open="student">＋ Add candidate</button></div></div><div class="toolbar"><div class="search"><input class="field" data-search placeholder="Search candidates, skills or qualifications" value="${esc(state.query)}"></div><span class="date-label">${students.length} candidates</span></div><div class="content-panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Candidate</th><th>Qualification</th><th>Experience</th><th>Skills</th><th>Applications</th><th></th></tr></thead><tbody>${students.map(student => `<tr><td><span class="table-primary">${esc(student.full_name)}</span><span class="table-secondary">${esc(student.email)}</span></td><td>${esc(student.qualification || '—')}</td><td>${esc(student.experience || '—')}</td><td>${esc(student.skills || '—')}</td><td>${state.applications.filter(item=>item.student_id===student.id).length}</td><td><button class="btn btn-light btn-sm" data-view-candidate="${student.id}">View profile</button></td></tr>`).join('') || '<tr><td colspan="6"><div class="empty">No candidates found.</div></td></tr>'}</tbody></table></div></div></div>`;
  }

  function applicationsView() {
    const applications = state.applications.filter(item => {
      const student = state.students.find(profile => profile.id === item.student_id);
      const job = state.jobs.find(role => role.id === item.job_id);
      return (!isAdmin() || state.status === 'All statuses' || item.status === state.status) && `${student?.full_name || ''} ${job?.title || ''} ${job?.company || ''}`.toLowerCase().includes(state.query.toLowerCase());
    });
    return `<div class="page"><div class="page-heading"><div><div class="eyebrow">${isAdmin()?'Candidate pipeline':'Your progress'}</div><h1>${isAdmin()?'Applications':'My applications'}</h1><p class="subhead">${isAdmin()?'Review applications and update candidate status.':'Track the progress of your applications.'}</p></div></div><div class="toolbar"><div class="search"><input class="field" data-search placeholder="Search roles${isAdmin()?' or candidates':''}" value="${esc(state.query)}"></div><select data-status><option>All statuses</option>${['New','In review','Interview','Offer','Rejected'].map(value=>`<option ${state.status===value?'selected':''}>${value}</option>`).join('')}</select></div><div class="content-panel">${applicationTable(applications,isAdmin())}</div></div>`;
  }

  function profileView() {
    const profile = state.profile;
    const complete = ['full_name','email','phone','location','qualification','experience','skills','resume_url','about'].filter(key => String(profile[key] || '').trim()).length;
    return `<div class="page"><div class="page-heading"><div><div class="eyebrow">Your details, your story</div><h1>My profile</h1><p class="subhead">A complete profile helps us find a better match.</p></div><div class="heading-actions"><button class="btn btn-primary" form="profile-form">Save changes</button></div></div><div class="profile-layout"><form id="profile-form" class="content-panel"><div class="form-section"><div class="form-title">Personal information</div><div class="form-grid">${inputField('Full name','full_name',profile.full_name)}${inputField('Email address','email',profile.email,'email','',true)}${inputField('Phone number','phone',profile.phone)}${inputField('Location','location',profile.location)}</div></div><div class="form-section"><div class="form-title">Your experience</div><div class="form-grid">${inputField('Qualification','qualification',profile.qualification)}${inputField('Years of experience','experience',profile.experience)}${inputField('Skills','skills',profile.skills,'text','full','Separate skills with commas')}${inputField('A short introduction','about',profile.about,'textarea','full')}</div></div><div class="form-section"><div class="form-title">Resume</div><div class="form-grid">${inputField('Resume URL','resume_url',profile.resume_url,'url','full','https://…')}</div></div></form><aside class="panel profile-card"><div class="profile-avatar">${initials(profile.full_name)}</div><h3>${esc(profile.full_name)}</h3><p>${esc(profile.location || 'Add your location')}</p><div class="detail-label">PROFILE COMPLETENESS</div><div class="profile-progress"><span style="width:${Math.round(complete/9*100)}%"></span></div><div class="detail-line"><span>${Math.round(complete/9*100)}% complete</span><span>${complete}/9 fields</span></div><div class="detail-line"><span>Applications</span><b>${state.applications.length}</b></div><div class="detail-line"><span>Resume</span><b>${profile.resume_url?'Added':'Missing'}</b></div></aside></div></div>`;
  }

  function inputField(label, name, value, type='text', size='', placeholder='', readonly=false) {
    if (type === 'textarea') return `<div class="form-field ${size}"><label for="field-${name}">${label}</label><textarea class="field" id="field-${name}" name="${name}" placeholder="${esc(placeholder)}">${esc(value)}</textarea></div>`;
    return `<div class="form-field ${size}"><label for="field-${name}">${label}</label><input class="field" id="field-${name}" name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${readonly?'readonly':''}></div>`;
  }

  function render() {
    if (!state.session || !state.profile) return loginScreen();
    const views = {dashboard:dashboardView,clients:clientsView,jobs:jobsView,students:studentsView,applications:applicationsView,profile:profileView};
    if (!isAdmin() && state.view === 'dashboard') state.view = 'jobs';
    const titles = {dashboard:'Overview',clients:'Clients',jobs:isAdmin()?'Vacancies':'Explore jobs',students:'Candidates',applications:'Applications',profile:'My profile'};
    app.innerHTML = `<div class="shell">${navigation()}<main class="main">${header(titles[state.view] || 'Overview')}${(views[state.view] || dashboardView)()}</main></div>`;
    bindPageEvents();
  }

  function bindPageEvents() {
    app.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', async () => {state.view=button.dataset.view;state.query='';state.status='All statuses';if(isAdmin())try{await loadData()}catch(error){toast(`Could not refresh portal data: ${error.message}`)}render()}));
    app.querySelectorAll('[data-logout]').forEach(button => button.addEventListener('click', signOut));
    app.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.open)));
    app.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => {const [type,id]=button.dataset.edit.split(':');openModal(type,id)}));
    app.querySelectorAll('[data-view-candidate]').forEach(button => button.addEventListener('click', () => showCandidateProfile(button.dataset.viewCandidate)));
    app.querySelector('[data-refresh-candidates]')?.addEventListener('click', async event => {const button=event.currentTarget;button.disabled=true;try{await loadData();render();toast('Candidate list refreshed.')}catch(error){button.disabled=false;toast(`Could not refresh candidates: ${error.message}`)}});
    app.querySelectorAll('[data-apply]').forEach(button => button.addEventListener('click', () => applyForJob(button.dataset.apply)));
    app.querySelector('[data-search]')?.addEventListener('input', event => {state.query=event.target.value;const cursor=event.target.selectionStart;render();const next=app.querySelector('[data-search]');next?.focus();next?.setSelectionRange(cursor,cursor)});
    app.querySelector('[data-status]')?.addEventListener('change', event => {state.status=event.target.value;render()});
    app.querySelector('#profile-form')?.addEventListener('submit', saveProfile);
  }

  async function signOut() {
    await client.auth.signOut();
    state.session=null;
    state.profile=null;
    state.view='dashboard';
    render();
  }

  function showCandidateProfile(studentId) {
    const profile=state.students.find(item=>item.id===studentId);
    if(!profile){toast('Candidate profile not found. Refresh the list and try again.');return}
    const resumeUrl=/^https?:\/\//i.test(profile.resume_url||'')?`<a href="${esc(profile.resume_url)}" target="_blank" rel="noopener noreferrer">Open resume ↗</a>`:'Not provided';
    const detail=(label,value,size='')=>`<div class="form-field ${size}"><label>${label}</label><div>${esc(value||'—')}</div></div>`;
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" data-candidate-backdrop><section class="modal" role="dialog" aria-modal="true" aria-labelledby="candidate-title"><div class="modal-head"><div><h2 id="candidate-title">${esc(profile.full_name||'Candidate profile')}</h2><p>${esc(profile.email)}</p></div><button class="modal-close" data-close-candidate aria-label="Close dialog">×</button></div><div class="modal-body"><div class="form-grid">${detail('Phone',profile.phone)}${detail('Location',profile.location)}${detail('Qualification',profile.qualification)}${detail('Experience',profile.experience)}${detail('Skills',profile.skills,'full')}${detail('About',profile.about,'full')}<div class="form-field full"><label>Resume</label><div>${resumeUrl}</div></div></div></div><div class="modal-foot"><button class="btn btn-light" data-close-candidate>Close</button></div></section></div>`);
    const backdrop=document.querySelector('[data-candidate-backdrop]');
    backdrop.querySelectorAll('[data-close-candidate]').forEach(button=>button.addEventListener('click',()=>backdrop.remove()));
    backdrop.addEventListener('click',event=>{if(event.target===backdrop)backdrop.remove()});
  }

  function field(label,name,value,type='text',size='',placeholder='') {
    if (type === 'textarea') return `<div class="form-field ${size}"><label for="modal-${name}">${label}</label><textarea class="field" id="modal-${name}" name="${name}" placeholder="${esc(placeholder)}">${esc(value)}</textarea></div>`;
    return `<div class="form-field ${size}"><label for="modal-${name}">${label}</label><input class="field" id="modal-${name}" name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" required></div>`;
  }

  function openModal(type,id) {
    const existing = type==='client' ? state.clients.find(item=>item.id===id) : type==='job' ? state.jobs.find(item=>item.id===id) : type==='student' ? state.students.find(item=>item.id===id) : state.applications.find(item=>item.id===id);
    let title='', description='', fields='';
    if (type==='client') {
      title=existing?'Edit client':'Add a client';description='Keep client details organized.';
      fields=field('Company name','name',existing?.name||'')+field('Industry','industry',existing?.industry||'')+field('Primary contact','contact_name',existing?.contact_name||'')+field('Contact email','email',existing?.email||'','email')+field('Phone number','phone',existing?.phone||'')+`<div class="form-field"><label for="modal-status">Status</label><select class="field" id="modal-status" name="status"><option ${existing?.status==='Active'?'selected':''}>Active</option><option ${existing?.status==='Paused'?'selected':''}>Paused</option></select></div>`;
    } else if (type==='job') {
      title=existing?'Edit vacancy':'Post a vacancy';description='Create an opportunity for candidates.';
      fields=field('Role title','title',existing?.title||'')+`<div class="form-field"><label for="modal-client_id">Client</label><select class="field" id="modal-client_id" name="client_id" required><option value="">Select a client</option>${state.clients.map(item=>`<option value="${item.id}" ${existing?.client_id===item.id?'selected':''}>${esc(item.name)}</option>`).join('')}</select></div>`+field('Location','location',existing?.location||'')+`<div class="form-field"><label for="modal-employment_type">Employment type</label><select class="field" id="modal-employment_type" name="employment_type">${['Full-time','Part-time','Contract','Temporary'].map(value=>`<option ${existing?.employment_type===value?'selected':''}>${value}</option>`).join('')}</select></div>`+field('Salary range','salary',existing?.salary||'')+field('Category','category',existing?.category||'')+field('Role description','description',existing?.description||'','textarea','full')+`<div class="form-field"><label for="modal-status">Status</label><select class="field" id="modal-status" name="status">${['Open','Paused','Closed'].map(value=>`<option ${existing?.status===value?'selected':''}>${value}</option>`).join('')}</select></div>`;
    } else if (type==='student') {
      title='Create candidate account';description='Create a student portal account with secure sign-in details.';
      fields=field('Full name','full_name','')+field('Email address','email','','email')+field('Temporary password','password','','password','full','At least 8 characters')+field('Phone number','phone','')+field('Location','location','')+field('Qualification','qualification','')+field('Experience','experience','')+field('Skills','skills','','text','full')+field('Resume URL','resume_url','','url','full');
    } else {
      const student=state.students.find(item=>item.id===existing?.student_id),job=state.jobs.find(item=>item.id===existing?.job_id);
      title='Update application';description=`${student?.full_name||'Candidate'} · ${job?.title||'Role'}`;
      fields=`<div class="form-field"><label for="modal-status">Application status</label><select class="field" id="modal-status" name="status">${['New','In review','Interview','Offer','Rejected'].map(value=>`<option ${existing.status===value?'selected':''}>${value}</option>`).join('')}</select></div>`+field('Internal note','note',existing.note||'','textarea','full');
    }
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" data-backdrop><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 id="modal-title">${title}</h2><p>${description}</p></div><button class="modal-close" data-close aria-label="Close dialog">×</button></div><form id="modal-form"><div class="modal-body"><div class="form-grid">${fields}</div><div class="login-error" id="modal-error" role="alert"></div></div><div class="modal-foot"><button type="button" class="btn btn-light" data-close>Cancel</button><button class="btn btn-primary" type="submit">${existing?'Save changes':'Create'}</button></div></form></section></div>`);
    const backdrop=document.querySelector('[data-backdrop]');
    backdrop.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>backdrop.remove()));
    backdrop.addEventListener('click',event=>{if(event.target===backdrop)backdrop.remove()});
    backdrop.querySelector('#modal-form').addEventListener('submit',event=>saveModal(event,type,existing,backdrop));
  }

  async function saveModal(event,type,existing,backdrop) {
    event.preventDefault();
    const data=Object.fromEntries(new FormData(event.currentTarget).entries());
    let result;
    if (type==='client') {
      result=existing?await client.from('clients').update(data).eq('id',existing.id):await client.from('clients').insert(data);
    } else if (type==='job') {
      const payload={title:data.title,client_id:data.client_id,location:data.location,employment_type:data.employment_type,salary:data.salary,category:data.category,description:data.description,status:data.status};
      result=existing?await client.from('jobs').update(payload).eq('id',existing.id):await client.from('jobs').insert(payload);
    } else if (type==='student') {
      const {error}=await client.functions.invoke('create-student-account',{body:data});
      result={error};
    } else {
      result=await client.from('applications').update({status:data.status}).eq('id',existing.id);
      if (!result.error) result=await client.from('application_admin_notes').upsert({application_id:existing.id,note:data.note,updated_at:new Date().toISOString()});
    }
    if (result.error) {
      document.getElementById('modal-error').textContent=result.error.message;
      return;
    }
    backdrop.remove();
    await loadData();
    render();
    toast(type==='student'?'Candidate account created':`${titleFor(type)} saved.`);
  }

  function titleFor(type) {
    return ({client:'Client',job:'Vacancy',application:'Application'})[type] || 'Record';
  }

  async function applyForJob(jobId) {
    const {error}=await client.from('applications').insert({student_id:state.session.user.id,job_id:jobId,status:'New'});
    if (error) {toast(error.code==='23505'?'You have already applied for this role.':error.message);return}
    await loadData();
    render();
    toast('Application sent. Track its progress in My applications.');
  }

  async function saveProfile(event) {
    event.preventDefault();
    const data=Object.fromEntries(new FormData(event.currentTarget).entries());
    delete data.email;
    const {error}=await client.from('profiles').update(data).eq('id',state.session.user.id);
    if (error) {toast(error.message);return}
    state.profile={...state.profile,...data};
    await loadData();
    render();
    toast('Profile updated.');
  }

  async function boot() {
    loginScreen();
    const {data,error}=await client.auth.getSession();
    if (error || !data.session) return;
    state.session=data.session;
    const {data:profile,error:profileError}=await client.from('profiles').select('*').eq('id',data.session.user.id).single();
    if (profileError) {await signOut();return}
    state.profile=profile;
    state.view=isAdmin()?'dashboard':'jobs';
    try {await loadData();render()} catch (loadError) {toast(`Could not load portal data: ${loadError.message}`)}
  }

  boot();
})();
