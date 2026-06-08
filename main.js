/* ==========================================
   AGRO NEXUS - LÓGICA INTERATIVA
   ========================================== */

// Aguardar o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializar sistema de partículas
    initParticles();
    
    // Inicializar dashboard dinâmica
    initDashboard();
    
    // Configurar navbar com scroll
    initNavbar();
    
    // configurar menu responsivo
    initMobileMenu();

    // Smooth scroll para links internos
    initSmoothScroll();
});

/* ==========================================
   1. SISTEMA DE PARTÍCULAS (BACKGROUND)
   ========================================== */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    // Ajustar tamanho
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Configurações das partículas
    const particlesArray = [];
    const numberOfParticles = 80;
    
    // Propriedades de resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles(); // Reinicia ao redimensionar
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() * 0.5) - 0.25;
            this.speedY = (Math.random() * 0.5) - 0.25;
            this.color = `rgba(0, 242, 255, ${Math.random() * 0.5})`; // Azul Neon
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Colisão com as bordas
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Criar partículas
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }

    // Conexões entre partículas próximas
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance/20000);
                    ctx.strokeStyle = 'rgba(0, 242, 255,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animação
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connect();
        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================
   2. DASHBOARD DINÂMICA (SIMULAÇÃO DE DADOS)
   ========================================== */
function initDashboard() {
    // Elementos do DOM
    const tempEl = document.getElementById('temp-val');
    const humEl = document.getElementById('hum-val');
    const cattleEl = document.getElementById('cattle-val');
    const cropEl = document.getElementById('crop-val');

    // Valores base
    let temp = 24;
    let hum = 65;
    let cattle = 1240;
    let crop = 98;

    // Função para fluctuate valores (simular dadosIoT)
    setInterval(() => {
        // Variação de temperatura (18 a 30°C)
        temp = fluctuanteFloat(24, 2);
        tempEl.innerText = temp.toFixed(1) + '°C';
        
        // Variação de umidade (50% a 80%)
        hum = fluctuanteInt(65, 5);
        humEl.innerText = hum + '%';
        
        // Atualizar barra de status da temperatura
        const tempFill = document.querySelector('.monitor-card:nth-child(1) .fill');
        if(tempFill) tempFill.style.width = (temp / 35 * 100) + '%';

        // Número de gado muda raramente
        if(Math.random() > 0.95) {
            cattle = fluctuanteInt(1240, 2);
            cattleEl.innerText = cattle;
            document.querySelector('.monitor-card:nth-child(2) h3').style.color = '#00ff88';
            setTimeout(() => {
                document.querySelector('.monitor-card:nth-child(2) h3').style.color = '#fff';
            }, 500);
        }

    }, 2000); // Atualiza a cada 2 segundos

    // Função utilitária para flutuar números float
    function fluctuanteFloat(base, variance) {
        let change = (Math.random() * variance) - (variance / 2);
        return base + change;
    }

    // Função utilitária para flutuar números inteiros
    function fluctuanteInt(base, variance) {
        let change = Math.floor(Math.random() * variance) - Math.floor(variance / 2);
        return base + change;
    }

    // Animação de entrada dos Cards
    const cards = document.querySelectorAll('.monitor-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });
}

/* ==========================================
   3. NAVBAR COM Scroll (Efeito Glass)
   ========================================== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.padding = '15px 50px';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 242, 255, 0.1)';
        } else {
            navbar.style.background = 'rgba(5, 5, 5, 0.8)';
            navbar.style.padding = '20px 50px';
            navbar.style.boxShadow = 'none';
        }
    });
}

/* ==========================================
   4. MENU RESPONSIVO (MOBILE)
   ========================================== */
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    toggle.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.right = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = '#000';
            navLinks.style.padding = '20px';
            navLinks.style.borderBottom = '1px solid #00f2ff';
        } else {
            navLinks.style.display = 'flex';
        }
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                navLinks.style.display = 'none';
            }
        });
    });
}

/* ==========================================
   5. SMOOTH SCROLL (Navegação)
   ========================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================
   6. EFEITOS Adicionais (Mouse Trail)
   ========================================== */
document.addEventListener('mousemove', (e) => {
    // Pequeno efeito de brilho ao mover o mouse (opcional)
    // Isso pode ser expandido para criar um rastro de luz
});