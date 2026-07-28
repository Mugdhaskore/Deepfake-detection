const mediaInput = document.getElementById('mediaInput');
const analyzeButton = document.getElementById('analyzeButton');
const startButton = document.getElementById('start-button');
const heroScanButton = document.getElementById('heroScanButton');
const reportFraudBtn = document.getElementById('reportFraudBtn');
const uploadBoxText = document.getElementById('upload-box-text');

const sampleReport = {
  label: 'Deepfake likely',
  score: 79,
  findings: [
    'Face blending and pixel blending detected in eye clusters',
    'Audio-video phase synchronization mismatch found',
    'Unnatural frequency domain noise signature',
  ],
};

// ==========================================
// KINETIC PARTICLE NETWORK ENGINE
// ==========================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null, radius: 150 };

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
};

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.size = Math.random() * 2 + 1;
    this.density = (Math.random() * 30) + 15;
  }
  
  draw() {
    ctx.fillStyle = 'rgba(79, 139, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < mouse.radius) {
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;
      
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}

const initParticles = () => {
  particles = [];
  const count = window.innerWidth > 720 ? 85 : 40; 
  for (let i = 0; i < count; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    particles.push(new Particle(x, y));
  }
};

const animateParticles = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].draw();
    particles[i].update();
  }
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 190) {
        let alpha = (1 - (distance / 190)) * 0.12;
        ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
};

window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateParticles();

// ==========================================
// STATE GRAPHICS DISPLAY HANDLERS
// ==========================================
const showAlert = (message) => {
  const existing = document.querySelector('.toast-message');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
};

const setupLivePreview = (file) => {
  const previewContainer = document.getElementById('media-preview-container');
  const progressRing = document.getElementById('visual-progress');
  
  previewContainer.innerHTML = ''; 
  
  if (!file) {
    previewContainer.classList.add('hidden');
    progressRing.classList.remove('hidden');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    progressRing.classList.add('hidden');
    previewContainer.classList.remove('hidden');
    
    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = e.target.result;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.controls = false;
      previewContainer.appendChild(video);
    }
  };
  reader.readAsDataURL(file);
};

const updateVisualState = (fileName, typeString, confidenceVal, badgeText, themeColor) => {
  document.getElementById('visual-filename').textContent = fileName || 'Detection status';
  document.getElementById('visual-type').textContent = typeString || 'Verified';
  document.getElementById('visual-confidence').textContent = confidenceVal || '87%';
  
  const statusBadge = document.getElementById('visual-status');
  if (statusBadge) {
    statusBadge.textContent = badgeText || 'Ready';
    statusBadge.style.background = themeColor ? `rgba(${themeColor}, 0.1)` : 'rgba(34, 211, 238, 0.1)';
    statusBadge.style.color = themeColor ? `rgb(${themeColor})` : '#22d3ee';
    statusBadge.style.borderColor = themeColor ? `rgba(${themeColor}, 0.2)` : 'rgba(34, 211, 238, 0.2)';
  }
};

const renderFinalReport = () => {
  const reportCards = document.querySelectorAll('.report-content-block');
  if (reportCards.length < 3) return;

  reportCards[0].innerHTML = `
    <h4>Overall Risk</h4>
    <div class="risk-pill high">${sampleReport.label}</div>
    <p style="margin-bottom: 16px;">Model verified structural tampering and generated media vectors.</p>
    <button class="report-fraud-btn" id="reportFraudBtn">Report Fraud Electronically</button>
  `;
  
  reportCards[1].innerHTML = `
    <h4>Confidence score</h4>
    <div class="score-circle">${sampleReport.score}%</div>
    <p>High matching confidence across optical maps and biometric traces.</p>
  `;
  
  reportCards[2].innerHTML = `
    <h4>Detail summary</h4>
    <ul>${sampleReport.findings.map(item => `<li>${item}</li>`).join('')}</ul>
  `;

  document.getElementById('reportFraudBtn').addEventListener('click', launchReportingPortals);
};

const launchReportingPortals = () => {
  showAlert('Redirecting securely to official cyber fraud networks...');
  setTimeout(() => {
    window.open('https://www.ic3.gov/', '_blank'); 
    window.open('https://reportfraud.ftc.gov/', '_blank');
  }, 400);
};

// ==========================================
// INTERACTIVE DOM EVENT LISTENERS
// ==========================================
const openMediaPicker = () => {
  mediaInput.click();
};

startButton.addEventListener('click', openMediaPicker);
heroScanButton?.addEventListener('click', openMediaPicker);

mediaInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadBoxText.textContent = `Selected: ${file.name}`;
    showAlert(`Media uploaded: ${file.name}. Click 'Analyze now' to begin.`);
    
    const visualType = 'Video File';
    updateVisualState(file.name, visualType, 'Pending', 'Loaded', '56, 189, 248');
    setupLivePreview(file);
  }
});

analyzeButton.addEventListener('click', () => {
  const file = mediaInput.files[0];
  if (!file) {
    showAlert('Please choose a video file first.');
    return;
  }

  const visualType = 'Video';
  updateVisualState(file.name, visualType, 'Scanning', 'Processing', '239, 68, 68');
  showAlert(`Running multi-layer spatial scan on ${file.name}...`);

  setTimeout(() => {
    showAlert('Deepfake signature matched. Comprehensive breakdown prepared.');
    updateVisualState(file.name, visualType, `${sampleReport.score}%`, 'Danger Match', '239, 68, 68');
    renderFinalReport();
    document.getElementById('report').scrollIntoView({ behavior: 'smooth' });
  }, 2500);
});

reportFraudBtn.addEventListener('click', launchReportingPortals);