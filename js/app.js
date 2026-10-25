(() => {
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)],
    KEY = "studybuddy_complete_v1";
  const iso = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const plus = (n) => {
    let d = new Date();
    d.setDate(d.getDate() + n);
    return iso(d);
  };
  const seed = {
    profile: {
      name: "Student",
      email: "student@example.com",
      school: "My University",
      course: "Computer Science",
      bio: "Learning a little every day.",
    },
    groups: [
      {
        id: "g1",
        name: "Web Development Circle",
        subject: "Programming",
        level: "Beginner friendly",
        description:
          "Build websites together, share resources, and help each other debug projects.",
        tags: ["HTML & CSS", "JavaScript", "Projects"],
        members: 18,
        joined: true,
        icon: "fa-code",
        art: "purple",
      },
      {
        id: "g2",
        name: "Calculus Crew",
        subject: "Mathematics",
        level: "All levels",
        description:
          "Practice derivatives and tricky word problems one step at a time.",
        tags: ["Calculus", "Problem solving", "Exams"],
        members: 24,
        joined: true,
        icon: "fa-square-root-variable",
        art: "green",
      },
      {
        id: "g3",
        name: "Database Design Lab",
        subject: "Technology",
        level: "Intermediate",
        description:
          "Learn SQL, database modeling, normalization, and practical database design.",
        tags: ["SQL", "ERD", "Projects"],
        members: 12,
        joined: false,
        icon: "fa-database",
        art: "orange",
      },
      {
        id: "g4",
        name: "Creative Writing Hub",
        subject: "Writing",
        level: "All levels",
        description:
          "Share drafts, exchange feedback, and find inspiration for your next story.",
        tags: ["Writing", "Feedback"],
        members: 15,
        joined: false,
        icon: "fa-pen-nib",
        art: "blue",
      },
      {
        id: "g5",
        name: "Physics Problem Solvers",
        subject: "Science",
        level: "Intermediate",
        description:
          "Break down physics concepts and work through practice questions together.",
        tags: ["Physics", "Mechanics"],
        members: 20,
        joined: false,
        icon: "fa-atom",
        art: "purple",
      },
      {
        id: "g6",
        name: "Study Skills & Focus",
        subject: "Productivity",
        level: "Beginner friendly",
        description:
          "Share study techniques, set goals, and keep each other accountable.",
        tags: ["Focus", "Planning"],
        members: 9,
        joined: false,
        icon: "fa-bullseye",
        art: "green",
      },
    ],
    sessions: [
      {
        id: "s1",
        title: "JavaScript fundamentals review",
        groupId: "g1",
        date: plus(1),
        time: "16:00",
        location: "Online · Discord",
        description: "Review functions, arrays, and DOM events.",
        attending: true,
      },
      {
        id: "s2",
        title: "Related rates practice",
        groupId: "g2",
        date: plus(2),
        time: "14:30",
        location: "Library · Room 204",
        description: "Practice sphere, circle, and cone problems.",
        attending: true,
      },
    ],
    discussions: [
      {
        id: "d1",
        author: "Mia Santos",
        groupId: "g1",
        title: "What helped you understand JavaScript callbacks?",
        body: "Drawing the flow of which function runs first helped me. What worked for you?",
        date: plus(-1),
        likes: 8,
        liked: false,
      },
      {
        id: "d2",
        author: "Daniel Cruz",
        groupId: "g2",
        title: "Share your favorite calculus resources",
        body: "Looking for clear explanations of related rates and optimization. Share videos, notes, or practice questions.",
        date: plus(-2),
        likes: 12,
        liked: false,
      },
    ],
  };
  let data;
  try {
    data = JSON.parse(localStorage.getItem(KEY)) || structuredClone(seed);
  } catch {
    data = structuredClone(seed);
  }
  const save = () => localStorage.setItem(KEY, JSON.stringify(data)),
    esc = (s) =>
      String(s ?? "").replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c],
      );
  const initials = (s) =>
      (s || "S")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((x) => x[0])
        .join("")
        .toUpperCase(),
    group = (id) => data.groups.find((g) => g.id === id);
  const dateText = (s) =>
    s
      ? new Date(s + "T12:00:00").toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Date not set";
  const toast = (m) => {
    let t = $("#toast");
    t.textContent = m;
    t.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove("show"), 2400);
  };
  const modal = (h) => {
      $("#modalContent").innerHTML = h;
      $("#modal").showModal();
    },
    close = () => $("#modal").close();
  let page = "dashboard",
    query = "",
    category = "All subjects";
  function sync() {
    let p = data.profile;
    $("#sidebarName").textContent = p.name;
    $("#topName").textContent = p.name.split(" ")[0];
    $("#sidebarAvatar").textContent = initials(p.name);
    $("#topAvatar").textContent = initials(p.name);
  }
  function heading(k, t, d, b = "") {
    return `<div class="page-heading"><div><div class="eyebrow">${k}</div><h1>${t}</h1><p>${d}</p></div>${b}</div>`;
  }
  function art(g) {
    return `<div class="group-art art-${g.art || "purple"}"><i class="fa-solid ${g.icon || "fa-book"}"></i></div>`;
  }
  function card(g) {
    return `<article class="group-card"><div class="group-card-top">${art(g)}<span class="pill ${g.joined ? "green" : ""}">${g.joined ? "Member" : "Open group"}</span></div><h3>${esc(g.name)}</h3><p>${esc(g.description)}</p><div>${(g.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div><div class="group-card-bottom"><span class="member-count"><i class="fa-solid fa-users"></i> ${g.members} members</span><button class="btn ${g.joined ? "btn-light" : "btn-primary"} btn-sm" data-group="${g.id}">${g.joined ? "Leave group" : "Join group"}</button></div></article>`;
  }
  function sessionItem(s) {
    return `<div class="session-item"><div class="date-block"><b>${new Date(s.date + "T12:00:00").getDate()}</b><span>${new Date(s.date + "T12:00:00").toLocaleDateString(undefined, { month: "short" })}</span></div><div><strong>${esc(s.title)}</strong><span>${esc(group(s.groupId)?.name || "Study group")} · ${esc(s.time)}</span></div></div>`;
  }
  function dashboard() {
    let joined = data.groups.filter((g) => g.joined),
      upcoming = data.sessions
        .filter((s) => s.attending && s.date >= iso())
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3);
    return `${heading("YOUR LEARNING SPACE", `Good to see you, ${esc(data.profile.name.split(" ")[0])} 👋`, "A little progress each day adds up. What would you like to learn today?", `<button class="btn btn-primary" data-action="group"><i class="fa-solid fa-plus"></i> Create a group</button>`)}
<div class="hero"><div class="hero-copy"><div class="eyebrow">YOUR NEXT BIG IDEA STARTS HERE</div><h2>Learn better, together.</h2><p>Find your people, share what you know, and make studying feel less like a solo mission.</p><button class="btn" data-page="discover">Explore study groups →</button></div><div class="hero-art"><i class="fa-solid fa-book-open-reader"></i></div></div>
<div class="stats-grid"><div class="stat-card"><div class="stat-top">My study groups <span class="stat-icon">♧</span></div><div class="stat-value">${joined.length}</div><div class="stat-note">Groups you’ve joined</div></div><div class="stat-card"><div class="stat-top">Upcoming sessions <span class="stat-icon">◷</span></div><div class="stat-value">${data.sessions.filter((s) => s.attending && s.date >= iso()).length}</div><div class="stat-note">Keep your learning on track</div></div><div class="stat-card"><div class="stat-top">Discussions <span class="stat-icon">☷</span></div><div class="stat-value">${data.discussions.length}</div><div class="stat-note">Topics to learn from</div></div><div class="stat-card"><div class="stat-top">Discover groups <span class="stat-icon">⌕</span></div><div class="stat-value">${data.groups.filter((g) => !g.joined).length}</div><div class="stat-note">Find your next study partner</div></div></div>
<div class="content-grid"><div><section class="panel"><div class="panel-heading"><h3>Recommended for you</h3><button class="text-link" data-page="discover">Browse all →</button></div><div class="group-list">${
      data.groups
        .filter((g) => !g.joined)
        .slice(0, 3)
        .map(
          (g) =>
            `<div class="group-row">${art(g)}<div class="group-row-info"><strong>${esc(g.name)}</strong><span>${esc(g.subject)} · ${g.members} members</span></div><button class="btn btn-light btn-sm" data-group="${g.id}">Join</button></div>`,
        )
        .join("") || '<p class="muted">You’ve joined every group!</p>'
    }</div></section><section class="panel"><div class="panel-heading"><h3>Recent discussions</h3><button class="text-link" data-page="discussions">View all</button></div><div class="group-list">${data.discussions
      .slice(0, 3)
      .map(
        (d) =>
          `<div class="group-row"><div class="group-art"><i class="fa-regular fa-message"></i></div><div class="group-row-info"><strong>${esc(d.title)}</strong><span>${esc(d.author)} · ${d.likes} likes</span></div></div>`,
      )
      .join("")}</div></section></div>
<div><section class="panel"><div class="panel-heading"><h3>Quick actions</h3></div><div class="quick-grid"><button class="quick-action" data-page="discover"><span class="stat-icon">⌕</span><span><strong>Find a group</strong><span>Explore subjects</span></span></button><button class="quick-action" data-action="session"><span class="stat-icon">◷</span><span><strong>Plan a session</strong><span>Study together</span></span></button><button class="quick-action" data-action="discussion"><span class="stat-icon">☷</span><span><strong>Ask a question</strong><span>Start a discussion</span></span></button><button class="quick-action" data-action="group"><span class="stat-icon">＋</span><span><strong>Create a group</strong><span>Bring people together</span></span></button></div></section><section class="panel"><div class="panel-heading"><h3>Coming up</h3><button class="text-link" data-page="sessions">See schedule</button></div>${upcoming.map(sessionItem).join("") || '<p class="muted">No sessions planned yet.</p>'}</section></div></div>`;
  }
  function discover() {
    let list = data.groups.filter(
      (g) =>
        (!query ||
          [g.name, g.subject, g.description, ...g.tags]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase())) &&
        (category === "All subjects" || g.subject === category),
    );
    return `${heading("FIND YOUR PEOPLE", "Discover study groups", "Join a group that matches your goals and learning style.", `<button class="btn btn-primary" data-action="group">＋ Create a group</button>`)}<div class="filters"><input id="groupSearch" value="${esc(query)}" placeholder="Search by topic, subject, or group name"><select id="category"><option>All subjects</option>${[
      ...new Set(data.groups.map((g) => g.subject)),
    ]
      .sort()
      .map(
        (s) => `<option ${category === s ? "selected" : ""}>${esc(s)}</option>`,
      )
      .join(
        "",
      )}</select></div>${list.length ? `<div class="group-grid">${list.map(card).join("")}</div>` : '<div class="empty-state"><h3>No groups found</h3><p>Try another search or create a group.</p><button class="btn btn-primary" data-action="group">Create a group</button></div>'}`;
  }
  function mygroups() {
    let a = data.groups.filter((g) => g.joined);
    return `${heading("YOUR COMMUNITY", "My study groups", "All the groups you’ve joined.", `<button class="btn btn-primary" data-page="discover">Find groups</button>`)}${a.length ? `<div class="group-grid">${a.map(card).join("")}</div>` : '<div class="empty-state"><h3>Your study circle starts here</h3><p>Discover and join a group.</p><button class="btn btn-primary" data-page="discover">Discover groups</button></div>'}`;
  }
  function sessionsPage() {
    return `${heading("MAKE TIME TO LEARN", "Study sessions", "Plan focused time with your group and keep each other accountable.", `<button class="btn btn-primary" data-action="session">＋ Schedule session</button>`)}<div class="sessions-grid">${
      [...data.sessions]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(
          (s) =>
            `<article class="session-card"><div class="date-block"><b>${new Date(s.date + "T12:00:00").getDate()}</b><span>${new Date(s.date + "T12:00:00").toLocaleDateString(undefined, { month: "short" })}</span></div><div class="session-main"><h3>${esc(s.title)}</h3><p>${esc(s.description || "Study together.")}</p><div class="meta-row"><span>${esc(group(s.groupId)?.name || "Study group")}</span><span>${esc(s.time)}</span><span>${esc(s.location || "Location TBD")}</span><span>${dateText(s.date)}</span></div></div><div class="session-actions"><button class="btn btn-light btn-sm" data-attend="${s.id}">${s.attending ? "Going ✓" : "Attend"}</button><button class="btn btn-light btn-sm" data-delete-session="${s.id}">Delete</button></div></article>`,
        )
        .join("") ||
      '<div class="empty-state">No sessions yet. Schedule one!</div>'
    }</div>`;
  }
  function discussionsPage() {
    return `${heading("SHARE WHAT YOU KNOW", "Discussion board", "Ask questions, exchange ideas, and learn from your community.", `<button class="btn btn-primary" data-action="discussion">＋ New discussion</button>`)}<div class="discussion-list">${
      [...data.discussions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(
          (d) =>
            `<article class="discussion-card"><div class="discussion-head"><div class="avatar">${initials(d.author)}</div><div class="discussion-author"><strong>${esc(d.author)}</strong><span>${esc(group(d.groupId)?.name || "Community")} · ${dateText(d.date)}</span></div><span class="pill">Discussion</span></div><h3>${esc(d.title)}</h3><p>${esc(d.body)}</p><div class="discussion-footer"><span class="member-count">♡ ${d.likes} likes</span><button class="like-btn ${d.liked ? "liked" : ""}" data-like="${d.id}">${d.liked ? "♥ Liked" : "♡ Like"}</button></div></article>`,
        )
        .join("") || '<div class="empty-state">Start the conversation.</div>'
    }</div>`;
  }
  function profilePage() {
    let p = data.profile;
    return `${heading("YOUR ACCOUNT", "My profile", "Keep your student details up to date.")}<div class="profile-layout"><section class="panel profile-card"><div class="profile-avatar">${initials(p.name)}</div><h3>${esc(p.name)}</h3><p>${esc(p.email)}</p><span class="pill">StudyBuddy member</span><div class="profile-stats"><div><strong>${data.groups.filter((g) => g.joined).length}</strong><span>Groups</span></div><div><strong>${data.sessions.filter((s) => s.attending).length}</strong><span>Sessions</span></div></div></section><section class="panel"><div class="panel-heading"><h3>Personal information</h3></div><form id="profileForm"><div class="form-grid"><div class="field"><label>Full name</label><input name="name" required maxlength="60" value="${esc(p.name)}"></div><div class="field"><label>Email address</label><input name="email" type="email" required value="${esc(p.email)}"></div><div class="field"><label>School / university</label><input name="school" value="${esc(p.school)}"></div><div class="field"><label>Course / major</label><input name="course" value="${esc(p.course)}"></div><div class="field full"><label>About me</label><textarea name="bio" maxlength="300">${esc(p.bio)}</textarea></div></div><div class="form-actions"><button class="btn btn-primary">Save changes</button></div></form></section></div>`;
  }
  function privacyPage() {
    return `${heading("YOUR DATA MATTERS", "Privacy & safety", "A plain-language overview of this demo.")}<section class="panel privacy-copy"><div class="notice"><b>Demo notice:</b> This version stores your profile, groups, sessions, and discussions in this browser. It has no secure login or shared server database.</div><h3>Information stored</h3><p>Profile fields, group information, sessions, and discussion posts are saved in browser local storage on this device so the demo can remember changes.</p><h3>How it is used</h3><p>This information is used to operate the demo in this browser. Anyone with access to this browser profile may be able to view or change local data.</p><h3>Third-party resources</h3><p>Fonts and icons may load from third-party CDNs and receive ordinary network request information. Avoid entering sensitive information.</p><h3>Before public launch</h3><p>Add authentication, database access rules, deletion controls, appropriate safeguards, and a policy that accurately describes the live service and applicable requirements.</p><button class="btn btn-danger" data-action="reset">Reset demo data</button></section>`;
  }
  const pages = {
    dashboard,
    discover,
    mygroups,
    sessions: sessionsPage,
    discussions: discussionsPage,
    profile: profilePage,
    privacy: privacyPage,
  };
  function render(p = page) {
    page = pages[p] ? p : "dashboard";
    $$(".nav-item").forEach((b) =>
      b.classList.toggle("active", b.dataset.page === page),
    );
    $("#pageLabel").textContent = {
      dashboard: "Dashboard",
      discover: "Discover groups",
      mygroups: "My groups",
      sessions: "Study sessions",
      discussions: "Discussions",
      profile: "My profile",
      privacy: "Privacy",
    }[page];
    $("#pageContent").innerHTML = pages[page]();
    $("#sidebar").classList.remove("open");
  }
  function showModal(title, body) {
    modal(
      `<div class="modal-inner"><div class="modal-heading"><h2>${title}</h2><button class="modal-close" data-close>×</button></div>${body}</div>`,
    );
  }
  function groupModal() {
    showModal(
      "Create a study group",
      `<form id="groupForm"><div class="field"><label>Group name *</label><input name="name" required maxlength="70" placeholder="Intro to Programming"></div><div class="form-grid"><div class="field"><label>Subject *</label><input name="subject" required maxlength="50" placeholder="Computer Science"></div><div class="field"><label>Level</label><select name="level"><option>Beginner friendly</option><option>All levels</option><option>Intermediate</option><option>Advanced</option></select></div></div><div class="field"><label>Description *</label><textarea name="description" required maxlength="300"></textarea></div><div class="field"><label>Tags (comma separated)</label><input name="tags" placeholder="JavaScript, Projects"></div><div class="form-actions"><button type="button" class="btn btn-light" data-close>Cancel</button><button class="btn btn-primary">Create group</button></div></form>`,
    );
  }
  function sessionModal() {
    if (!data.groups.length) {
      toast("Create a group first.");
      return;
    }
    showModal(
      "Schedule a study session",
      `<form id="sessionForm"><div class="field"><label>Session title *</label><input name="title" required maxlength="90"></div><div class="field"><label>Study group *</label><select name="groupId">${data.groups.map((g) => `<option value="${g.id}">${esc(g.name)}</option>`).join("")}</select></div><div class="form-grid"><div class="field"><label>Date *</label><input type="date" name="date" min="${iso()}" value="${plus(1)}" required></div><div class="field"><label>Time *</label><input type="time" name="time" value="16:00" required></div></div><div class="field"><label>Location / meeting link</label><input name="location" placeholder="Online · Google Meet"></div><div class="field"><label>Details</label><textarea name="description"></textarea></div><div class="form-actions"><button type="button" class="btn btn-light" data-close>Cancel</button><button class="btn btn-primary">Schedule session</button></div></form>`,
    );
  }
  function discussionModal() {
    if (!data.groups.length) {
      toast("Create a group first.");
      return;
    }
    showModal(
      "Start a discussion",
      `<form id="discussionForm"><div class="field"><label>Post to group *</label><select name="groupId">${data.groups.map((g) => `<option value="${g.id}">${esc(g.name)}</option>`).join("")}</select></div><div class="field"><label>Title *</label><input name="title" required maxlength="120"></div><div class="field"><label>Your post *</label><textarea name="body" required maxlength="1500"></textarea></div><div class="form-actions"><button type="button" class="btn btn-light" data-close>Cancel</button><button class="btn btn-primary">Publish post</button></div></form>`,
    );
  }
  document.addEventListener("click", (e) => {
    let pb = e.target.closest("[data-page]");
    if (pb) {
      e.preventDefault();
      render(pb.dataset.page);
      return;
    }
    if (e.target.closest("[data-close]")) {
      close();
      return;
    }
    let gb = e.target.closest("[data-group]");
    if (gb) {
      let g = group(gb.dataset.group);
      g.joined = !g.joined;
      g.members = Math.max(0, g.members + (g.joined ? 1 : -1));
      save();
      render();
      toast(g.joined ? `Joined ${g.name}.` : `Left ${g.name}.`);
      return;
    }
    let act = e.target.closest("[data-action]")?.dataset.action;
    if (act === "group") groupModal();
    if (act === "session") sessionModal();
    if (act === "discussion") discussionModal();
    let at = e.target.closest("[data-attend]");
    if (at) {
      let s = data.sessions.find((x) => x.id === at.dataset.attend);
      s.attending = !s.attending;
      save();
      render();
      toast(s.attending ? "You’re attending." : "Attendance updated.");
    }
    let del = e.target.closest("[data-delete-session]");
    if (del) {
      data.sessions = data.sessions.filter(
        (s) => s.id !== del.dataset.deleteSession,
      );
      save();
      render();
      toast("Session deleted.");
    }
    let like = e.target.closest("[data-like]");
    if (like) {
      let d = data.discussions.find((x) => x.id === like.dataset.like);
      d.liked = !d.liked;
      d.likes = Math.max(0, d.likes + (d.liked ? 1 : -1));
      save();
      render();
    }
    if (act === "reset")
      showModal(
        "Reset demo data?",
        `<p class="muted">This restores the sample data and discards your browser changes.</p><div class="form-actions"><button class="btn btn-light" data-close>Cancel</button><button class="btn btn-danger" id="confirmReset">Reset data</button></div>`,
      );
    if (e.target.closest("#confirmReset")) {
      data = structuredClone(seed);
      save();
      close();
      sync();
      render("dashboard");
      toast("Demo data reset.");
    }
  });
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    let f = e.target,
      fd = new FormData(f),
      v = (k) => String(fd.get(k) || "").trim();
    if (f.id === "groupForm") {
      let tags = v("tags")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      data.groups.unshift({
        id: "g" + Date.now(),
        name: v("name"),
        subject: v("subject"),
        level: v("level"),
        description: v("description"),
        tags,
        members: 1,
        joined: true,
        icon: "fa-book-open",
        art: ["purple", "green", "orange", "blue"][data.groups.length % 4],
      });
      save();
      close();
      render("mygroups");
      toast("Study group created!");
    }
    if (f.id === "sessionForm") {
      data.sessions.push({
        id: "s" + Date.now(),
        title: v("title"),
        groupId: v("groupId"),
        date: v("date"),
        time: v("time"),
        location: v("location"),
        description: v("description"),
        attending: true,
      });
      save();
      close();
      render("sessions");
      toast("Study session scheduled!");
    }
    if (f.id === "discussionForm") {
      data.discussions.unshift({
        id: "d" + Date.now(),
        author: data.profile.name,
        groupId: v("groupId"),
        title: v("title"),
        body: v("body"),
        date: iso(),
        likes: 0,
        liked: false,
      });
      save();
      close();
      render("discussions");
      toast("Discussion published!");
    }
    if (f.id === "profileForm") {
      data.profile = {
        name: v("name"),
        email: v("email"),
        school: v("school"),
        course: v("course"),
        bio: v("bio"),
      };
      save();
      sync();
      render("profile");
      toast("Profile saved.");
    }
  });
  $("#pageContent").addEventListener("input", (e) => {
    if (e.target.id === "groupSearch") {
      query = e.target.value;
      let pos = e.target.selectionStart;
      render("discover");
      let n = $("#groupSearch");
      n.focus();
      n.setSelectionRange(pos, pos);
    }
  });
  $("#pageContent").addEventListener("change", (e) => {
    if (e.target.id === "category") {
      category = e.target.value;
      render("discover");
    }
  });
  $("#globalSearch").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      query = e.target.value;
      category = "All subjects";
      render("discover");
    }
  });
  $("#mobileMenu").addEventListener("click", () =>
    $("#sidebar").classList.toggle("open"),
  );
  $("#notificationBtn").addEventListener("click", () =>
    showModal(
      "Notifications",
      '<div class="notification">📅 Check your study sessions to see what’s coming up.</div><div class="notification">👥 Discover a group and learn with other students.</div>',
    ),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("#modal").open) close();
  });
  sync();
  save();
  render("dashboard");
})();
