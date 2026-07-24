(function () {
    const envelope = document.getElementById('envelope');
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('closeBtn');
    const letterBody = document.getElementById('letterBody');
    const hint = document.getElementById('hint');

      // Texto de la carta
      // `messageText` se usa para el efecto de escritura (sin HTML visible)
      const messageText = `You, 
      Hola HOLA hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola
          
            COQUETA`;

      // `messageHTML` contiene el HTML final con el enlace (se inyecta al completar)
      const messageHTML = `You, 
      Hola HOLA hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola
          
              <div style="text-align:center;"><a href="..." target="_blank" rel="noopener noreferrer">....</a></div>`;

    let typed = false;

      // Efecto de escritura
    function typeText(element, text, speed = 20, onComplete) {
      let i = 0;
      element.textContent = "";

      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          if (typeof onComplete === 'function') onComplete();
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
        typeText(letterBody, messageText, 15, () => {
          // Reemplaza el contenido final por HTML para que el enlace sea clicable
          letterBody.innerHTML = messageHTML;
        });
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
