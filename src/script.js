(function () {
    const envelope = document.getElementById('envelope');
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('closeBtn');
    const letterBody = document.getElementById('letterBody');
    const hint = document.getElementById('hint');

      // Texto de la carta
    const message = `Melisa,

A veces las palabras parecen pequeñas al intentar describir lo que siento por ti; aun así, las elijo con cuidado porque tú mereces cada una.

Eres la calma en mis mañanas, la risa que invade mis días y la certeza que acompaña mis pasos cuando todo tiembla.

Esta carta es un instante detenido para agradecerte por ser como eres y por hacer que todo parezca posible.

Guarda este papel como recuerdo de un te amo que no conoce tiempo ni distancia.

Con todo mi cariño,`;

    let typed = false;

      // Efecto de escritura
    function typeText(element, text, speed = 20) {
        let i = 0;
        element.textContent = "";
        
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
        
        type();
    }

      // Abrir modal
    function openLetter() {
        modal.classList.add('active');
        hint.style.opacity = '0';
        document.body.style.overflow = 'hidden';
        
    if (!typed) {
        setTimeout(() => {
            typeText(letterBody, message, 15);
            typed = true;
        }, 300);
    }
        
        closeBtn.focus();
    }

      // Cerrar modal
    function closeLetter() {
        modal.classList.remove('active');
        hint.style.opacity = '1';
        document.body.style.overflow = 'auto';
        envelope.focus();
    }

      // Event listeners
    envelope.addEventListener('click', openLetter);
    envelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLetter();
        }
    });

    closeBtn.addEventListener('click', closeLetter);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
        closeLetter();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeLetter();
        }
    });

      // Animación del sello al pasar el mouse
    const seal = document.querySelector('.seal');
    seal.addEventListener('mouseenter', () => {
        seal.animate([
        { transform: 'translateX(-50%) scale(1)' },
        { transform: 'translateX(-50%) scale(1.1) rotate(5deg)' },
        { transform: 'translateX(-50%) scale(1)' }
        ], {
        duration: 400,
        easing: 'ease-out'
        });
    });

      // Accesibilidad: motion reducido
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
        document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
        });
    }

      // Focus inicial
    envelope.focus();
})();
