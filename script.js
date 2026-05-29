/**
 * Diwas Parashar - Portfolio Logic (v3.0 Master Edition)
 * Features:
 *  1. Mouse-Interactive Neural Canvas (Attraction & Connecting Links)
 *  2. Scroll-driven Reveal Observer (Slide & Staggered Fade-in)
 *  3. Interactive SVG Radar Skill Graph Split Panel
 *  4. Live ML Inference Sandbox: Parkinson's Voice Gauge & Churn SHAP Bars
 *  5. Clickable Pipeline System Architecture Flowchart
 *  6. Interactive NLP Sarcasm Detector terminal component
 *  7. Floating Theme Switcher: standard Cyber vs. Matrix Green Mode
 *  8. Standard typing effects, header scrolls, contact validations
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
  
  let mouse = {
    x: null,
    y: null,
    radius: 180
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
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
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.vx += (dx / dist) * force * 0.05;
          this.vy += (dy / dist) * force * 0.05;
        } else {
          this.vx += (this.baseVx - this.vx) * 0.05;
          this.vy += (this.baseVy - this.vy) * 0.05;
        }
      } else {
        this.vx += (this.baseVx - this.vx) * 0.05;
        this.vy += (this.baseVy - this.vy) * 0.05;
      }

      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x += this.vx;
      this.y += this.vy;
      
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
    rootMargin: '0px 0px -50px 0px'
  };
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);
  
  revealItems.forEach(item => {
    revealObserver.observe(item);
  });


  // --- 3. INTERACTIVE SVG RADAR GRAPH SPLIT PANEL ---
  const radarNodes = document.querySelectorAll('.radar-point');
  const radarLabels = document.querySelectorAll('.radar-axis-label');
  const detailsCard = document.getElementById('radar-details-card');

  const radarData = {
    ml: {
      title: "Machine Learning",
      icon: "brain",
      desc: "Strong focus on end-to-end ML architectures, statistical model selections, and optimization features. Specialized in supervised algorithms, cross-validation metrics, and predictive classification.",
      tags: ["Python", "Scikit-Learn", "Classification", "Regression", "Feature Selection"]
    },
    dl: {
      title: "Deep Learning",
      icon: "binary",
      desc: "Experienced building deep sequence classification models, neural network layers, and NLP architectures. Competent in recurrent networks, tokenization steps, and padding optimization.",
      tags: ["TensorFlow", "PyTorch", "LSTM Networks", "Tokenization", "Hyperparameters"]
    },
    analytics: {
      title: "Data Wrangling",
      icon: "bar-chart-3",
      desc: "Adept at wrangling, transforming, and isolating critical business data structures. Experienced in exploratory data analysis, outlier detections, and statistical hypothesis tests.",
      tags: ["Pandas", "NumPy", "EDA", "Data Cleaning", "Matplotlib", "Seaborn"]
    },
    database: {
      title: "Databases & SQL",
      icon: "database",
      desc: "Solid mastery writing efficient, robust relational database queries. Skilled in PostgreSQL, schema designing, index setups, complex table joints, and data integrity operations.",
      tags: ["SQL", "PostgreSQL", "Database Design", "Table Joints", "Indexing"]
    },
    engineering: {
      title: "Developer Tools",
      icon: "terminal",
      desc: "Writes modular, clean Python environments using version control standards. Competent in API connections, Firebase integrations, and Linux shell automation scripting.",
      tags: ["Git", "APIs", "Firebase", "Linux shell", "LaTeX"]
    },
    math: {
      title: "Math & Stats",
      icon: "activity",
      desc: "Strong analytical foundations supporting algorithmic designs. Skilled in probability distributions, linear algebra systems, multi-variable calculus, and statistical metrics.",
      tags: ["Probability", "Linear Algebra", "Calculus", "Hypothesis Testing", "RMSE"]
    }
  };

  function updateRadarDetails(axisKey) {
    // Reset active states
    radarNodes.forEach(node => node.classList.remove('active'));
    radarLabels.forEach(lbl => lbl.classList.remove('active'));

    // Set active target
    const targetNode = document.getElementById(`pt-${axisKey}`);
    const targetLabel = document.querySelector(`.radar-axis-label[data-axis="${axisKey}"]`);
    if (targetNode) targetNode.classList.add('active');
    if (targetLabel) targetLabel.classList.add('active');

    // Fade out details card slightly and update content
    detailsCard.style.opacity = '0.3';
    detailsCard.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      const data = radarData[axisKey];
      
      let tagsHtml = '';
      data.tags.forEach(tag => {
        tagsHtml += `<span class="radar-tech-tag">${tag}</span>`;
      });

      detailsCard.innerHTML = `
        <h3><i data-lucide="${data.icon}" style="color: var(--accent-cyan);"></i> ${data.title}</h3>
        <p class="radar-details-desc">${data.desc}</p>
        <div class="radar-tech-tags">
          ${tagsHtml}
        </div>
      `;
      
      if (typeof lucide !== 'undefined') lucide.createIcons();
      
      detailsCard.style.opacity = '1';
      detailsCard.style.transform = 'translateY(0)';
    }, 250);
  }

  radarNodes.forEach(node => {
    node.addEventListener('mouseover', () => {
      const axis = node.getAttribute('data-axis');
      updateRadarDetails(axis);
    });
  });

  radarLabels.forEach(label => {
    label.addEventListener('mouseover', () => {
      const axis = label.getAttribute('data-axis');
      updateRadarDetails(axis);
    });
  });


  // --- 4. LIVE ML INFERENCE SANDBOX CALCULATIONS ---
  // Panel Toggles
  const sandboxTabButtons = document.querySelectorAll('.sandbox-tab-btn');
  const sandboxPanels = document.querySelectorAll('.sandbox-panel');

  sandboxTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sandboxTabButtons.forEach(b => b.classList.remove('active'));
      sandboxPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Panel 1: Parkinson's voice logic
  const sliderJitter = document.getElementById('slider-jitter');
  const sliderShimmer = document.getElementById('slider-shimmer');
  const sliderHnr = document.getElementById('slider-hnr');
  
  const valJitter = document.getElementById('val-jitter');
  const valShimmer = document.getElementById('val-shimmer');
  const valHnr = document.getElementById('val-hnr');
  
  const gaugeFill = document.getElementById('parkinsons-gauge-fill');
  const probReadout = document.getElementById('parkinsons-prob');
  const statusAlert = document.getElementById('parkinsons-status');

  function runParkinsonsInference() {
    const jitter = parseFloat(sliderJitter.value);
    const shimmer = parseFloat(sliderShimmer.value);
    const hnr = parseFloat(sliderHnr.value);

    // Update value readouts
    valJitter.textContent = `${jitter.toFixed(1)}%`;
    valShimmer.textContent = `${shimmer.toFixed(1)}%`;
    valHnr.textContent = `${hnr.toFixed(1)} dB`;

    // Formula: simulated voice diagnostic logistic regression
    // Higher jitter/shimmer and lower HNR yields higher disease severity probability
    const z = -2.2 + (jitter * 1.3) + (shimmer * 0.35) - ((hnr - 10) * 0.18);
    const probability = 1 / (1 + Math.exp(-z));
    const percent = Math.round(probability * 100);

    // Update gauge readout text
    probReadout.textContent = `${percent}%`;

    // Update circular SVG gauge dashboard (stroke-dasharray=502)
    const dashoffset = 502 - (502 * (percent / 100));
    gaugeFill.style.strokeDashoffset = dashoffset;

    // Update status labels
    if (percent < 45) {
      statusAlert.textContent = "DIAGNOSIS: HEALTHY VOICE SPECTRUM";
      statusAlert.className = "sandbox-status-alert active-safe";
    } else {
      statusAlert.textContent = "DIAGNOSIS: CLINICAL RISK DETECTED";
      statusAlert.className = "sandbox-status-alert active-danger";
    }
  }

  if (sliderJitter && sliderShimmer && sliderHnr) {
    sliderJitter.addEventListener('input', runParkinsonsInference);
    sliderShimmer.addEventListener('input', runParkinsonsInference);
    sliderHnr.addEventListener('input', runParkinsonsInference);
    runParkinsonsInference(); // Run first time
  }

  // Panel 2: Churn SHAP logic
  const sliderTenure = document.getElementById('slider-tenure');
  const sliderBilling = document.getElementById('slider-billing');
  const sliderContract = document.getElementById('slider-contract');

  const valTenure = document.getElementById('val-tenure');
  const valBilling = document.getElementById('val-billing');
  const valContract = document.getElementById('val-contract');

  const fillTenure = document.getElementById('shap-tenure-fill');
  const fillBilling = document.getElementById('shap-billing-fill');
  const fillContract = document.getElementById('shap-contract-fill');

  const shapTenureText = document.getElementById('shap-tenure-val');
  const shapBillingText = document.getElementById('shap-billing-val');
  const shapContractText = document.getElementById('shap-contract-val');
  const churnStatus = document.getElementById('churn-status');

  const contractNames = ["Month-to-month", "One year", "Two year"];

  function runChurnInference() {
    const tenure = parseInt(sliderTenure.value);
    const billing = parseInt(sliderBilling.value);
    const contract = parseInt(sliderContract.value);

    // Update text labels
    valTenure.textContent = `${tenure} months`;
    valBilling.textContent = `$${billing}`;
    valContract.textContent = contractNames[contract];

    // Compute forces
    // Tenure decreases churn: max tenure (72) gives -0.75 force
    const forceTenure = -0.1 - (tenure * 0.009);
    // High billing increases churn: max billing (120) gives +0.45 force
    const forceBilling = 0.05 + (billing * 0.0035);
    // Short term contract increases churn: month-to-month (0) gives +0.45 force, 2yr gives -0.15 force
    const forceContract = 0.45 - (contract * 0.3);

    // Update SHAP visual bars width
    fillTenure.style.width = `${Math.abs(forceTenure) * 100}%`;
    fillBilling.style.width = `${Math.abs(forceBilling) * 100}%`;
    fillContract.style.width = `${Math.abs(forceContract) * 100}%`;

    // Render bar fills based on positive/negative forces
    fillTenure.className = `shap-bar-fill ${forceTenure >= 0 ? 'push-churn' : 'push-stay'}`;
    fillBilling.className = `shap-bar-fill ${forceBilling >= 0 ? 'push-churn' : 'push-stay'}`;
    fillContract.className = `shap-bar-fill ${forceContract >= 0 ? 'push-churn' : 'push-stay'}`;

    // Update SHAP text labels
    shapTenureText.textContent = `${forceTenure >= 0 ? '+' : ''}${forceTenure.toFixed(2)}`;
    shapTenureText.className = `shap-val ${forceTenure >= 0 ? 'push-churn' : 'push-stay'}`;
    
    shapBillingText.textContent = `${forceBilling >= 0 ? '+' : ''}${forceBilling.toFixed(2)}`;
    shapBillingText.className = `shap-val ${forceBilling >= 0 ? 'push-churn' : 'push-stay'}`;
    
    shapContractText.textContent = `${forceContract >= 0 ? '+' : ''}${forceContract.toFixed(2)}`;
    shapContractText.className = `shap-val ${forceContract >= 0 ? 'push-churn' : 'push-stay'}`;

    // Compute total churn probability
    const z = 0.2 + forceTenure + forceBilling + forceContract;
    const probability = 1 / (1 + Math.exp(-z));
    const percent = Math.round(probability * 100);

    // Update Churn status text
    if (percent < 50) {
      churnStatus.textContent = `CHURN RISK: LOW (PROBABILITY: ${percent}%)`;
      churnStatus.className = "sandbox-status-alert active-safe";
    } else {
      churnStatus.textContent = `CHURN RISK: HIGH (PROBABILITY: ${percent}%)`;
      churnStatus.className = "sandbox-status-alert active-danger";
    }
  }

  if (sliderTenure && sliderBilling && sliderContract) {
    sliderTenure.addEventListener('input', runChurnInference);
    sliderBilling.addEventListener('input', runChurnInference);
    sliderContract.addEventListener('input', runChurnInference);
    runChurnInference(); // Run first time
  }


  // --- 5. CLICKABLE PIPELINE SYSTEM ARCHITECTURE FLOWCHART ---
  const pipelineSteps = document.querySelectorAll('.pipeline-step');
  const detailsTitle = document.querySelector('#pm-pipeline-details h4');
  const detailsText = document.querySelector('#pm-pipeline-details p');
  const codeDrawer = document.querySelector('#pm-pipeline-details .pipeline-code-drawer');

  const pipelineData = {
    sensor: {
      title: "Sensors Feed Capture [10,000+ records]",
      desc: "Ingesting real-time temperature, load, and rotational velocity sensor logs representing high-frequency industrial manufacturing stats.",
      code: "df_sensors = pd.read_csv(\"manufacturing_feed.csv\")\nprint(df_sensors.head())"
    },
    etl: {
      title: "ETL & Database Normalization",
      desc: "Handling missing telemetry logs, normalizing numerical distributions, and storing aligned transactional records inside structured PostgreSQL databases.",
      code: "df_clean = df_sensors.dropna()\n# Store inside database\ndf_clean.to_sql('sensors_clean', engine, if_exists='append')"
    },
    features: {
      title: "Rolling Window Feature Engineering",
      desc: "Extracting temporal degradation features over rolling windows (e.g., standard deviation of temperature, moving average velocity) to isolate anomaly signals.",
      code: "df_clean['temp_rolling_std'] = df_clean['temperature'].rolling(window=10).std()\n# Calculate degradation trend\ndf_clean['trend_deg'] = df_clean['load'].diff(periods=5)"
    },
    model: {
      title: "Time-Series Anomaly Detection Model",
      desc: "Training a custom Random Forest classifier on sequential temporal features to forecast equipment breakdowns before failure points happen (achieving 84% accuracy).",
      code: "from sklearn.ensemble import RandomForestClassifier\nmodel = RandomForestClassifier(n_estimators=100, random_state=42)\nmodel.fit(X_train, y_train)"
    },
    alerts: {
      title: "Operational Alerts Output",
      desc: "Triggering proactive alerts to operational teams when equipment failure risks exceed 80%, successfully reducing manufacturing downtime by 25%.",
      code: "if failure_probability &gt;= 0.80:\n    trigger_slack_notification(\"WARNING: Failure expected in 48 hours!\")\n    schedule_maintenance_ticket()"
    }
  };

  pipelineSteps.forEach(step => {
    step.addEventListener('click', () => {
      pipelineSteps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');

      const stepKey = step.getAttribute('data-step');
      const data = pipelineData[stepKey];

      // Update flowchart details panel
      detailsTitle.textContent = data.title;
      detailsText.textContent = data.desc;
      codeDrawer.innerHTML = data.code;
    });
  });


  // --- 6. INTERACTIVE NLP SARCASM DETECTOR TERMINAL ---
  const sarcasmInput = document.getElementById('sarcasm-text-input');
  const sarcasmBtn = document.getElementById('btn-detect-sarcasm');
  const sarcasmPercentage = document.getElementById('sarcasm-percentage');
  const sarcasmBarWrapper = document.getElementById('sarcasm-bar-wrapper');
  const sarcasmBarFill = document.getElementById('sarcasm-bar-fill');

  if (sarcasmBtn && sarcasmInput) {
    sarcasmBtn.addEventListener('click', () => {
      const text = sarcasmInput.value.trim().toLowerCase();
      if (!text) {
        alert("Please enter a sentence to test!");
        return;
      }

      sarcasmBtn.disabled = true;
      sarcasmBtn.textContent = "Analyzing NLP...";

      // Simple simulated NLP logic
      let score = 5; // base score
      
      // Look for sarcastic keywords and combinations
      if (text.includes('oh') || text.includes('great') || text.includes('wonderful') || text.includes('amazing')) score += 25;
      if (text.includes('love') && (text.includes('work') || text.includes('weekend') || text.includes('exam'))) score += 35;
      if (text.includes('perfect') || text.includes('flawless')) score += 15;
      if (text.includes('totally') || text.includes('absolutely') || text.includes('really')) score += 10;
      if (text.includes('!') || text.includes('?')) score += 10;
      
      // Constrain score
      score = Math.min(98, Math.max(8, score));
      
      // Animate score bar reveal
      sarcasmBarWrapper.style.display = 'block';
      sarcasmBarFill.style.width = '0%';
      sarcasmPercentage.textContent = '0%';

      setTimeout(() => {
        sarcasmPercentage.textContent = `${score}%`;
        sarcasmBarFill.style.width = `${score}%`;
        sarcasmBtn.disabled = false;
        sarcasmBtn.textContent = "Run NLP Inference";
      }, 800);
    });
  }


  // --- 7. FLOATING THEME SWITCHER (CYBER VS. HACKER MATRIX MODE) ---
  const themeSwitchBtn = document.getElementById('theme-switch-btn');
  
  if (themeSwitchBtn) {
    themeSwitchBtn.addEventListener('click', () => {
      const isMatrix = document.body.classList.toggle('matrix-mode');
      
      // Update toggle icon and text labels
      if (isMatrix) {
        themeSwitchBtn.innerHTML = `<i data-lucide="shield-check"></i><span>Dashboard Mode</span>`;
      } else {
        themeSwitchBtn.innerHTML = `<i data-lucide="terminal"></i><span>Hacker Mode</span>`;
      }
      
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }


  // --- 8. HERO TYPEWRITER EFFECT ---
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
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
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


  // --- 9. SCROLL HANDLING & ACTIONS ---
  const header = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
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


  // --- 10. SKILLS PROGRESS ANIMATION ON VIEW ---
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


  // --- 11. PROJECTS GRID FILTERING ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
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


  // --- 12. AI RECRUITER Q&A TERMINAL INTERACTIVE CHAT ---
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
      if (isTyping) return;
      
      const questionKey = btn.getAttribute('data-question');
      const questionText = btn.textContent;
      
      appendMessage('user', `&gt; query_agent --opt "${questionText}"`);
      
      optionButtons.forEach(b => b.style.opacity = '0.5');
      isTyping = true;
      
      const typingBubble = appendTypingIndicator();
      
      setTimeout(() => {
        typingBubble.remove();
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
    const streamSpeed = 4;
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


  // --- 13. CONNECT CONTACT FORM ACTION ---
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

  // --- 14. MOBILE NAV BURGER TOGGLE ---
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
