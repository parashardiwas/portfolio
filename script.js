/**
 * Diwas Parashar - Portfolio Logic
 * Features:
 *  1. Mouse-Interactive Neural Canvas (Attraction & Linking)
 *  2. Scroll-driven Reveal Animations (Slide & Fade-in)
 *  3. Hero Typewriter Header Cycle
 *  4. Interactive Project Filtering
 *  5. Recruiter AI Q&A Monospace Terminal Simulation
 *  6. Scroll-driven Progress Bars & Header Shadow Transitions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- 1. MOUSE-INTERACTIVE NEURAL CANVAS ---
  const canvas = document.getElementById('neural-canvas');
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  let particleCount = 75;
  const connectionDistance = 110;
  const mouseConnectionDistance = 160;
  
  // Mouse coordinates tracker
  let mouse = {
    x: null,
    y: null,
    radius: 180 // area of interaction
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  // Set Canvas dimensions
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Adjust particle density based on screen size
    if (window.innerWidth < 768) {
      particleCount = 30;
    } else {
      particleCount = 75;
    }
    initParticles();
  }
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.radius = Math.random() * 2 + 1;
      this.baseVx = this.vx;
      this.baseVy = this.vy;
    }
    
    update() {
      // Mouse Attraction Physics
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          // Gently attract to cursor
          const force = (mouse.radius - dist) / mouse.radius;
          this.vx += (dx / dist) * force * 0.05;
          this.vy += (dy / dist) * force * 0.05;
        } else {
          // Return to base speed gradually
          this.vx += (this.baseVx - this.vx) * 0.05;
          this.vy += (this.baseVy - this.vy) * 0.05;
        }
      } else {
        // Return to base speed gradually
        this.vx += (this.baseVx - this.vx) * 0.05;
        this.vy += (this.baseVy - this.vy) * 0.05;
      }

      // Apply drag to prevent infinite speed buildup
      this.vx *= 0.98;
      this.vy *= 0.98;

      this.x += this.vx;
      this.y += this.vy;
      
      // Boundary collisions with margin bounce
      if (this.x < 0 || this.x > canvas.width) {
        this.vx = -this.vx;
        this.baseVx = -this.baseVx;
      }
      if (this.y < 0 || this.y > canvas.height) {
        this.vy = -this.vy;
        this.baseVy = -this.baseVy;
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.fill();
    }
  }
  
  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections between nodes
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw active connections to the mouse cursor
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        
        if (mdist < mouseConnectionDistance) {
          const alpha = (1 - mdist / mouseConnectionDistance) * 0.16;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animateParticles);
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animateParticles();


  // --- 2. SCROLL REVEAL OBSERVER ---
  const revealItems = document.querySelectorAll('.reveal-item');
  
  const revealObserverOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before scrolling fully into view
  };
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Optional: stop observing once in view
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);
  
  revealItems.forEach(item => {
    revealObserver.observe(item);
  });


  // --- 3. HERO TYPEWRITER EFFECT ---
  const typewriterElement = document.getElementById('typewriter-text');
  const roles = [
    'Artificial Intelligence', 
    'Data Analytics', 
    'Predictive Modeling', 
    'Machine Learning Systems'
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;
  
  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Deleting text
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      // Typing text
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }
    
    // Switch state controls
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full text
      isDeleting = true;
      typingSpeed = 2000; 
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }
    
    setTimeout(type, typingSpeed);
  }
  
  if (typewriterElement) {
    setTimeout(type, 1000);
  }


  // --- 4. SCROLL HANDLING & ACTIONS ---
  const header = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Highlight Active Link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 180)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });


  // --- 5. SKILLS PROGRESS ANIMATION ON VIEW ---
  const skillBars = document.querySelectorAll('.skill-progress');
  const skillsSection = document.getElementById('skills');
  
  const skillObserverOptions = {
    root: null,
    threshold: 0.15
  };
  
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-width');
          bar.style.width = targetWidth;
        });
        observer.unobserve(entry.target);
      }
    });
  }, skillObserverOptions);
  
  if (skillsSection) {
    skillObserver.observe(skillsSection);
  }


  // --- 6. PROJECTS GRID FILTERING ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });


  // --- 7. AI RECRUITER Q&A TERMINAL INTERACTIVE CHAT ---
  const terminalBody = document.getElementById('terminal-body');
  const optionButtons = document.querySelectorAll('.option-btn');
  
  const aiData = {
    skills: `&gt; ACCESSING DIWAS_SKILLS_MANIFEST...<br>
             &gt; PRIMARY DATA STACK IN USE:<br>
             &nbsp;&nbsp;- Programming: Python, SQL, Java, LaTeX.<br>
             &nbsp;&nbsp;- Machine Learning: Regression, Classification, Model Evaluation, Feature Engineering.<br>
             &nbsp;&nbsp;- Data & Analytics: Pandas, NumPy, Data Visualization, Exploratory Data Analysis (EDA).<br>
             &nbsp;&nbsp;- Developer Tools: Git, Firebase, APIs, Cloud Fundamentals.<br>
             &gt; DIWAS SPECIALIZES IN END-TO-END PYTHON PIPELINES AND MODULAR MACHINE LEARNING PIPELINE DEVELOPMENT.`,
             
    goals: `&gt; INITIALIZING STRATEGIC_GOALS_MODULE...<br>
            &gt; CAREER OBJECTIVES FOR DIWAS PARASHAR:<br>
            &nbsp;&nbsp;- Secure Summer Internships & Associate Roles in Machine Learning Engineering or Applied Data Analytics.<br>
            &nbsp;&nbsp;- Build production-ready predictive analytics pipelines and time-series monitoring systems.<br>
            &nbsp;&nbsp;- Integrate explainable AI architectures (like SHAP) to support strategical decision-making.<br>
            &gt; CURRENT STATUS: M.Sc. STUDENT AT AMITY UNIVERSITY; ACTIVELY INTERVIEWING.`,
            
    research: `&gt; RETRIEVING RESEARCH_MODULE: NLP_SARCASM_DETECTION...<br>
               &gt; REVIEW PROJECT: "A Decade Review of Sarcasm Detection in NLP (2015-2025)".<br>
               &nbsp;&nbsp;- Conducted systematic literature review analyzing 50+ papers across ML, DL, and Transformers.<br>
               &nbsp;&nbsp;- Developed methodology taxonomy based on feature engineering, context, and neural networks.<br>
               &nbsp;&nbsp;- Isolated key gaps: cross-domain detection challenges, dataset biases, and multilingual limitations.`,
             
    hire: `&gt; COMPUTING COMPLIANCE_AND_COMPETENCY_MATRIX...<br>
           &gt; TOP VALUE PROPOSITIONS:<br>
           &nbsp;&nbsp;[1] PIPELINE OPTIMIZATION: Boosted Parkinson's severity analysis accuracy from 78% to 86% via feature engineering.<br>
           &nbsp;&nbsp;[2] INDUSTRIAL ANOMALY EXPERTISE: Implemented predictive manufacturing forecasting, saving 25% simulated downtime.<br>
           &nbsp;&nbsp;[3] EXPLAINABLE ML: Leveraged SHAP values and SMOTE inside customer churn pipelines to balance prediction precision.<br>
           &nbsp;&nbsp;[4] DEDICATED PREPARATION: Strong computer applications background (BCA, Pune) coupled with AI M.Sc. (Amity, Noida).<br>
           &gt; READY TO BRING IMMEDIATE DATA ENGINEERING AND ML EXPERTISE TO YOUR TEAM.`
  };

  let isTyping = false;

  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isTyping) return; // Prevent clicking while streaming response
      
      const questionKey = btn.getAttribute('data-question');
      const questionText = btn.textContent;
      
      // 1. Append User Question Bubble
      appendMessage('user', `&gt; query_agent --opt "${questionText}"`);
      
      // Disable buttons temporarily
      optionButtons.forEach(b => b.style.opacity = '0.5');
      isTyping = true;
      
      // 2. Append simulated typing bubble
      const typingBubble = appendTypingIndicator();
      
      // Simulate "AI Model Inference" delay
      setTimeout(() => {
        // Remove typing indicator bubble
        typingBubble.remove();
        
        // Append actual streaming response
        const botBubble = appendMessage('bot', '');
        streamBotResponse(botBubble, aiData[questionKey]);
      }, 1000);
    });
  });

  function appendMessage(sender, text) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text;
    terminalBody.appendChild(bubble);
    scrollTerminal();
    return bubble;
  }

  function appendTypingIndicator() {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot';
    bubble.innerHTML = `
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    terminalBody.appendChild(bubble);
    scrollTerminal();
    return bubble;
  }

  function streamBotResponse(element, fullHtml) {
    let currentIdx = 0;
    const streamSpeed = 4; // ms per block/char
    const tokens = parseHtmlToTokens(fullHtml);
    
    function printNextToken() {
      if (currentIdx < tokens.length) {
        element.innerHTML += tokens[currentIdx];
        currentIdx++;
        scrollTerminal();
        setTimeout(printNextToken, streamSpeed);
      } else {
        isTyping = false;
        optionButtons.forEach(b => b.style.opacity = '1');
      }
    }
    
    printNextToken();
  }

  function parseHtmlToTokens(html) {
    const tokens = [];
    let i = 0;
    while (i < html.length) {
      if (html[i] === '<') {
        let tag = '';
        while (i < html.length && html[i] !== '>') {
          tag += html[i];
          i++;
        }
        tag += '>';
        i++;
        tokens.push(tag);
      } else if (html[i] === '&') {
        let entity = '';
        while (i < html.length && html[i] !== ';') {
          entity += html[i];
          i++;
        }
        entity += ';';
        i++;
        tokens.push(entity);
      } else {
        tokens.push(html[i]);
        i++;
      }
    }
    return tokens;
  }

  function scrollTerminal() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }


  // --- 8. CONNECT CONTACT FORM ACTION ---
  const contactForm = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('btn-submit-message');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const subject = document.getElementById('subject').value;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Sending... <i data-lucide="loader" class="status-blink" style="margin-left: 0.5rem; width: 16px; height: 16px;"></i>`;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      
      setTimeout(() => {
        alert(`Thank you, ${name}! Your query regarding "${subject}" was logged. Note: This is a static portfolio presentation; Diwas will receive your email if you click the mail icon directly.`);
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Send Message <i data-lucide="send" style="margin-left: 0.5rem; width: 16px; height: 16px;"></i>`;
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }, 1500);
    });
  }

  // --- 9. MOBILE NAV BURGER TOGGLE ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isVisible = navMenu.style.display === 'block';
      if (isVisible) {
        navMenu.style.display = 'none';
        menuToggle.innerHTML = `<i data-lucide="menu"></i>`;
      } else {
        navMenu.style.display = 'block';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = 'rgba(7, 10, 19, 0.95)';
        navMenu.style.borderBottom = '1px solid var(--border-color)';
        navMenu.style.padding = '1.5rem 2rem';
        
        const navUl = navMenu.querySelector('ul');
        navUl.style.flexDirection = 'column';
        navUl.style.gap = '1.5rem';
        
        menuToggle.innerHTML = `<i data-lucide="x"></i>`;
        
        const mobileLinks = navMenu.querySelectorAll('.nav-link');
        mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
            navMenu.style.display = 'none';
            menuToggle.innerHTML = `<i data-lucide="menu"></i>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
          });
        });
      }
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }
});
