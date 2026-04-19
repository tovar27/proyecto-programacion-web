/*carga y coloca funcione*/
document.addEventListener('DOMContentLoaded', () => {

  initAOS();        
  initNavbar();       
  initBackToTop();    
  initNavHighlight(); 
  initTestimonios();  
  initContactForm(); 
  initLightbox();    

});


/*animaciones al hacer scroll*/
function initAOS() {
  AOS.init({
    duration: 700,
    once: true,
    offset: 60,
    easing: 'ease-out-cubic'
  });
}


/*navegación barra*/
function initNavbar() {
  const navbar = document.getElementById('mainNav');
  if (!navbar) return;

  /*sombra cuando baja*/
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /*cierra menu*/
  const navLinks = navbar.querySelectorAll('.nav-link');
  const navbarCollapse = document.getElementById('navbarNav');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
}


/*boton arriba*/
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  /*muestra y cierra el boton*/
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  /*sube inicio*/
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/*resalta seccion*/
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;

          navLinks.forEach(link => link.classList.remove('active'));

          const activeLink = document.querySelector(`.navbar a[href="#${id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    {
      threshold: 0.4,
      rootMargin: '-70px 0px -30% 0px'
    }
  );

  sections.forEach(section => observer.observe(section));
}


/*likes y dislikes*/
function initTestimonios() {
  const testimonios = document.querySelectorAll('.card-testimonio');

  testimonios.forEach(card => {
    const likeBtn = card.querySelector('.like');
    const dislikeBtn = card.querySelector('.dislike');

    let reacted = false;

    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        if (reacted) return;
        reacted = true;

        const contador = likeBtn.querySelector('.contador');
        contador.textContent = parseInt(contador.textContent) + 1;

        likeBtn.style.background = '#d1e7ff';
        likeBtn.style.color = '#0d6efd';
        likeBtn.style.fontWeight = 'bold';

        likeBtn.disabled = true;
        dislikeBtn.disabled = true;
        dislikeBtn.style.opacity = '0.5';
      });
    }

    if (dislikeBtn) {
      dislikeBtn.addEventListener('click', () => {
        if (reacted) return;
        reacted = true;

        const contador = dislikeBtn.querySelector('.contador');
        contador.textContent = parseInt(contador.textContent) + 1;

        dislikeBtn.style.background = '#ffe0e0';
        dislikeBtn.style.color = '#d00000';
        dislikeBtn.style.fontWeight = 'bold';

        dislikeBtn.disabled = true;
        likeBtn.disabled = true;
        likeBtn.style.opacity = '0.5';
      });
    }
  });
}


/*ormulario contacto*/
function initContactForm() {
  const btnEnviar = document.getElementById('btnEnviar');
  if (!btnEnviar) return;

  btnEnviar.addEventListener('click', () => {
    const nombre = document.getElementById('nombre');
    const correo = document.getElementById('correo');
    const mensaje = document.getElementById('mensaje');

    [nombre, correo, mensaje].forEach(field => {
      if (field) field.style.borderColor = '';
    });

    let valido = true;

    if (!nombre || nombre.value.trim() === '') {
      if (nombre) {
        nombre.style.borderColor = '#dc3545';
        nombre.focus();
      }
      valido = false;
    }

    if (!correo || !isValidEmail(correo.value)) {
      if (correo) {
        correo.style.borderColor = '#dc3545';
        if (valido) correo.focus();
      }
      valido = false;
    }

    if (!mensaje || mensaje.value.trim().length < 10) {
      if (mensaje) {
        mensaje.style.borderColor = '#dc3545';
        if (valido) mensaje.focus();
      }
      valido = false;
    }

    if (!valido) {
      const modal = document.getElementById('modalEnviado');
      if (modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
      }
      mostrarAlerta('Completa bien los campos.', 'danger');
    } else {
      setTimeout(() => limpiarFormulario(), 3500);
    }
  });

  /*quita error al escribir*/
  ['nombre', 'correo', 'asunto', 'mensaje'].forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      });
    }
  });
}


/*correo valido?*/
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/*vacia form*/
function limpiarFormulario() {
  ['nombre', 'correo', 'asunto', 'mensaje'].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.value = '';
  });
}


/*mensaje*/
function mostrarAlerta(mensaje, tipo = 'danger') {
  const existing = document.getElementById('alertaFormulario');
  if (existing) existing.remove();

  const alerta = document.createElement('div');
  alerta.id = 'alertaFormulario';
  alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
  alerta.style.cssText =
    'position:fixed; bottom:80px; left:50%; transform:translateX(-50%);' +
    'z-index:9999; min-width:300px; max-width:90%; text-align:center;';
  alerta.innerHTML = `
    <i class="fa-solid fa-triangle-exclamation me-2"></i>
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  document.body.appendChild(alerta);

  setTimeout(() => {
    if (alerta && alerta.parentNode) alerta.remove();
  }, 4000);
}


/*galeria*/
function initLightbox() {
  if (typeof lightbox === 'undefined') return;

  lightbox.option({
    resizeDuration: 300,
    wrapAround: true,
    albumLabel: 'Foto %1 de %2',
    fadeDuration: 300,
    imageFadeDuration: 300,
    positionFromTop: 60,
    disableScrolling: true
  });
}


/*scrol*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const navbar = document.getElementById('mainNav');
    const navHeight = navbar ? navbar.offsetHeight : 70;
    const headerEl = document.querySelector('header');
    const headerH = headerEl ? headerEl.offsetHeight : 70;
    const offset = navHeight + headerH;

    const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});