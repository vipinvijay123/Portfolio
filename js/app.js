/**
 * Main Interaction Controller
 * Handles custom cursor, audio triggers, modal dossiers, rail navigation
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Custom Cursor (.cur-dot)
  const cursor = document.getElementById('cur-dot');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX;
  let curY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    curX += (mouseX - curX) * 0.22;
    curY += (mouseY - curY) * 0.22;
    if (cursor) {
      cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Attach hover expanding state
  const interactives = document.querySelectorAll('a, button, .chip, .card, .les, .matrix-cell, .peek');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (cursor) cursor.classList.add('act');
      if (window.sound) window.sound.hover();
    });
    el.addEventListener('mouseleave', () => {
      if (cursor) cursor.classList.remove('act');
    });
    el.addEventListener('click', () => {
      if (window.sound) window.sound.click();
    });
  });

  // 2. Audio Toggle
  const audioBtn = document.getElementById('audio-toggle');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (window.sound) {
        const isEnabled = window.sound.toggle();
        audioBtn.classList.toggle('active', isEnabled);
        const label = audioBtn.querySelector('.audio-label');
        if (label) label.textContent = isEnabled ? 'AUDIO ON' : 'AUDIO OFF';
      }
    });
  }

  // 3. Sticky Navigation Bar Scroll Wash
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (nav) {
      nav.classList.toggle('stuck', window.scrollY > 40);
    }
  }, { passive: true });

  // 4. Modal Dossier Handlers
  const resumeModal = document.getElementById('resume-dossier');
  const projectModal = document.getElementById('project-dossier');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    if (window.sound) window.sound.warp();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('.open-resume').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(resumeModal);
    });
  });

  document.querySelectorAll('.close-modal').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeModal(resumeModal);
      closeModal(projectModal);
    });
  });

  document.querySelectorAll('.modal-scrim').forEach((scrim) => {
    scrim.addEventListener('click', () => {
      closeModal(resumeModal);
      closeModal(projectModal);
    });
  });

  // Project Modal details dynamic loader
  const projectDetails = {
    'civicai': {
      title: 'CivicAI — Tamil Nadu Civic Platform',
      category: 'Civic Technology & Multimodal AI',
      body: 'Engineered an end-to-end municipal issue-reporting platform with Next.js, TypeScript, Tailwind CSS, Gemini, and Google Maps to address waste management, potholes, streetlights, and water leakages. Features automated AI image verification to eliminate fraudulent reports, multilingual interface with speech-to-text / text-to-speech for citizen inclusivity, and live complaint tracking with citizen verification receipts.',
      tags: ['Next.js', 'TypeScript', 'Google Gemini AI', 'Google Maps Platform', 'STT / TTS']
    },
    'cmrl': {
      title: 'CMRL AI Passenger Transit Chatbot',
      category: 'Public Transit Infrastructure & AI',
      body: 'Contributed directly as Software Development Intern at Chennai Metro Rail Limited (CMRL) to the core development and optimization of the official mobile chatbot. Improved 60% of chatbot interactions and reduced commuter response latency by 40% with automated transit schedule and route query resolutions.',
      tags: ['Conversational AI', 'Mobile API', 'Observability', 'CMRL Environment', 'Latency Optimization']
    },
    'telecom': {
      title: 'Telecom Tower Asset Operations Platform',
      category: 'Enterprise Infrastructure & IoT',
      body: 'Centralized network operations platform built with React, Node.js, Express, and MongoDB. Monitors physical cellular towers, power backup batteries, maintenance logs, and field technician dispatch tickets with role-based JWT security.',
      tags: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT Security', 'RBAC']
    },
    'telemedicine': {
      title: 'Rural Telemedicine Healthcare Platform',
      category: 'Smart India Hackathon 2024 (Top 50 Internal)',
      body: 'Led a 5-member engineering team to design and prototype a digital telemedicine platform connecting rural patients in Nabha with remote doctors, offering asynchronous triage, low-bandwidth consultations, and digital health records.',
      tags: ['React', 'Node.js', 'Healthcare UI', 'Low Bandwidth', 'Team Lead']
    },
    'green': {
      title: 'City Waste Mapping & Environmental Platform',
      category: '1M1B / AICTE / Salesforce Green Internship',
      body: 'Contributed to a municipal waste mapping and awareness platform advancing urban sustainability. Drove 90% growth in community participation and accelerated reporting cycles by 80% through structured documentation and cross-functional team delivery.',
      tags: ['Civic Sustainability', 'Salesforce Green Intern', 'Geospatial Awareness']
    },
    'jobs': {
      title: 'Autonomous Job Discovery & Recruiter Pipeline',
      category: 'Python Automation & OAuth Integration',
      body: 'Built a Python automation workflow utilizing the Gmail API and OAuth 2.0 to automate recruiter outreach, email parsing, resume attachments, and application tracking, saving substantial hours weekly.',
      tags: ['Python', 'Gmail API', 'OAuth 2.0', 'Regex', 'Data Parsing']
    }
  };

  document.querySelectorAll('[data-project-key]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const key = el.getAttribute('data-project-key');
      const data = projectDetails[key];
      if (data && projectModal) {
        document.getElementById('proj-title').textContent = data.title;
        document.getElementById('proj-cat').textContent = data.category;
        document.getElementById('proj-body').textContent = data.body;
        const tagsWrap = document.getElementById('proj-tags');
        if (tagsWrap) {
          tagsWrap.innerHTML = data.tags.map(t => `<span style="font-size:10px;padding:3px 8px;border:1px solid var(--line);border-radius:3px;color:var(--bone);">${t}</span>`).join(' ');
        }
        openModal(projectModal);
      }
    });
  });

  // Global Keys
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(resumeModal);
      closeModal(projectModal);
    }
    if ((e.key === 'm' || e.key === 'M') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      if (audioBtn) audioBtn.click();
    }
    if ((e.key === 'r' || e.key === 'R') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      openModal(resumeModal);
    }
  });

  // Rail Button Scrolling
  const railSections = ['#hero', '#identity', '#projects', '#experience', '#matrix', '#contact'];
  railButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(railSections[idx]);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        if (window.sound) window.sound.click();
      }
    });
  });
});
