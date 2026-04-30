document.addEventListener('DOMContentLoaded', () => {
    const flavorImage = document.getElementById('flavor-preview');
    const container = document.querySelector('.interactive-flavor-container');
    
    const flavors = [
        'cookie1.png',
        'cookie2.png',
        'cookie3.png'
    ];
    
    let currentFlavorIndex = 0;

    if (container && flavorImage) {
        container.addEventListener('mouseenter', () => {
            // Muda para o próximo sabor ao entrar com o mouse
            currentFlavorIndex = (currentFlavorIndex + 1) % flavors.length;
            
            flavorImage.style.opacity = '0';
            
            setTimeout(() => {
                flavorImage.src = flavors[currentFlavorIndex];
                flavorImage.style.opacity = '1';
            }, 150);
        });

        // Opcional: Efeito de rotação contínua enquanto o mouse estiver sobre
        let interval;
        container.addEventListener('mouseover', () => {
             if(!interval) {
                interval = setInterval(() => {
                    currentFlavorIndex = (currentFlavorIndex + 1) % flavors.length;
                    flavorImage.src = flavors[currentFlavorIndex];
                }, 800);
             }
        });

        container.addEventListener('mouseleave', () => {
            clearInterval(interval);
            interval = null;
        });
    }

    // Lógica do Cookie que cresce e gira ao Scroll
    const scrollingCookie = document.getElementById('scrolling-cookie');
    const featuredSection = document.getElementById('featured-section');

    window.addEventListener('scroll', () => {
        if (!featuredSection || !scrollingCookie) return;

        const rect = featuredSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Verifica se a seção está visível
        if (rect.top < windowHeight && rect.bottom > 0) {
            // Calcula o progresso do scroll dentro da seção (0 a 1)
            let progress = (windowHeight - rect.top) / (windowHeight + rect.height);
            progress = Math.min(Math.max(progress, 0), 1);

            // Aplica escala (de 0.8 a 1.5) e rotação (até 360 graus)
            const scale = 0.8 + (progress * 0.7);
            const rotation = progress * 360;

            scrollingCookie.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        }
    });

    // Lógica de Alternância de Tema (Modo Escuro/Claro)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            // Opcional: Salvar a preferência no localStorage
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // Verificar preferência salva ao carregar
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }

    // Lógica do Menu Hambúrguer
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-item');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Impede o scroll do body quando o menu está aberto
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Fechar menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Lógica de Slider Horizontal (Puxar para o lado)
    const slider = document.querySelector('.horizontal-slider');
    const packagingSection = document.getElementById('packaging-showcase');
    const locationsSection = document.getElementById('locations-section');
    
    let isDragging = false;
    let startX;

    const startDrag = (e) => {
        isDragging = true;
        startX = e.pageX - slider.offsetLeft;
    };

    const endDrag = () => {
        isDragging = false;
    };

    const moveDrag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX);
        
        if (walk < -50) { // Puxou para a esquerda -> Vai para Locais
            slider.style.transform = 'translateX(-100vw)';
        } else if (walk > 50) { // Puxou para a direita -> Volta para Embalagens
            slider.style.transform = 'translateX(0)';
        }
    };

    if (slider && packagingSection && locationsSection) {
        // ... (lógica de drag anterior mantida)
        [packagingSection, locationsSection].forEach(section => {
            section.addEventListener('mousedown', startDrag);
            section.addEventListener('mousemove', moveDrag);
            section.addEventListener('mouseup', endDrag);
            section.addEventListener('mouseleave', endDrag);

            section.addEventListener('wheel', (e) => {
                if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                    if (e.deltaX > 20) {
                        slider.style.transform = 'translateX(-100vw)';
                    } else if (e.deltaX < -20) {
                        slider.style.transform = 'translateX(0)';
                    }
                }
            });
        });
    }

    // Lógica das Telas (Login e Carrinho)
    const loginOverlay = document.getElementById('login-overlay');
    const cartOverlay = document.getElementById('cart-overlay');
    const openLogin = document.getElementById('open-login');
    const openCart = document.getElementById('open-cart');
    const userBtn = document.getElementById('user-icon-btn');
    const cartBtn = document.getElementById('cart-icon-btn');
    const closeLogin = document.getElementById('close-login');
    const closeCart = document.getElementById('close-cart');

    const toggleOverlay = (overlay, show) => {
        overlay.style.display = show ? 'flex' : 'none';
        document.body.style.overflow = show ? 'hidden' : 'auto';
        if (show) menuOverlay.classList.remove('active'); // Fecha o menu ao abrir a tela
    };

    if (openLogin) openLogin.addEventListener('click', () => toggleOverlay(loginOverlay, true));
    if (userBtn) userBtn.addEventListener('click', () => toggleOverlay(loginOverlay, true));
    
    if (openCart) openCart.addEventListener('click', () => toggleOverlay(cartOverlay, true));
    if (cartBtn) cartBtn.addEventListener('click', () => toggleOverlay(cartOverlay, true));
    
    if (closeLogin) closeLogin.addEventListener('click', () => toggleOverlay(loginOverlay, false));
    if (closeCart) closeCart.addEventListener('click', () => toggleOverlay(cartOverlay, false));

    // Alternar entre Login e Cadastro
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });
});
