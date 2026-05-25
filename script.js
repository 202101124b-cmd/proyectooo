/* ============================================================
   FERRETERÍA DE LA MINERÍA – SCRIPT.JS
   Interactividad completa: navbar, partículas, contadores,
   filtros de productos, formulario, WhatsApp y más.
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     1. NAVBAR: scroll effect + active link + hamburger
     ============================================================ */
  const navbar    = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("navLinks");
  const allLinks  = document.querySelectorAll(".nav-link");

  // Scroll: añade clase 'scrolled' al navbar
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
    toggleBackToTop();
    updateActiveLink();
  });

  // Hamburger: abre/cierra menú móvil
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  // Cierra menú al hacer click en un enlace
  allLinks.forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  // Actualiza el enlace activo según la sección visible
  function updateActiveLink() {
    const sections = document.querySelectorAll("section[id]");
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    allLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  /* ============================================================
     2. HERO PARTICLES: partículas animadas de polvo/minería
     ============================================================ */
  const particlesContainer = document.getElementById("heroParticles");

  function createParticle() {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Posición y tamaño aleatorios
    const size     = Math.random() * 4 + 2;
    const startX   = Math.random() * 100;
    const startY   = Math.random() * 100;
    const duration = Math.random() * 8 + 4;
    const delay    = Math.random() * 5;

    particle.style.cssText = `
      left: ${startX}%;
      top: ${startY}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    particlesContainer.appendChild(particle);

    // Remover partícula y crear nueva
    setTimeout(() => {
      particle.remove();
      createParticle();
    }, (duration + delay) * 1000);
  }

  // Crear 20 partículas iniciales
  for (let i = 0; i < 20; i++) {
    createParticle();
  }

  /* ============================================================
     3. STATS COUNTER: animación de contadores al hacer scroll
     ============================================================ */
  const statItems = document.querySelectorAll(".stat-item");
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;

    const statsBar = document.querySelector(".stats-bar");
    if (!statsBar) return;

    const rect = statsBar.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      statsAnimated = true;

      statItems.forEach((item, index) => {
        const target    = parseInt(item.getAttribute("data-target"));
        const statNumEl = item.querySelector(".stat-number");
        const duration  = 1800;
        const startTime = Date.now();

        // Easing easeOutExpo
        function easeOutExpo(t) {
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function updateCounter() {
          const elapsed  = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOutExpo(progress);
          const current  = Math.round(easedProgress * target);

          statNumEl.textContent = current.toLocaleString("es-PE");

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            statNumEl.textContent = target.toLocaleString("es-PE");
          }
        }

        // Delay escalonado por stat
        setTimeout(() => {
          requestAnimationFrame(updateCounter);
        }, index * 150);
      });
    }
  }

  window.addEventListener("scroll", animateStats);
  animateStats(); // Comprobar en caso de que ya sea visible

  /* ============================================================
     4. PRODUCT FILTER: filtrado interactivo por categoría
     ============================================================ */
  const filterBtns   = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Actualizar botón activo
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      productCards.forEach(card => {
        const cardFilter = card.getAttribute("data-filter");

        if (filter === "all" || cardFilter === filter) {
          // Mostrar con animación
          card.classList.remove("hidden");
          card.style.animation = "fadeInCard 0.4s ease forwards";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  /* ============================================================
     5. CONTACT FORM: validación + feedback + redirect WhatsApp
     ============================================================ */
  const contactForm   = document.getElementById("contactForm");
  const formSuccess   = document.getElementById("formSuccess");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name    = document.getElementById("formName").value.trim();
      const phone   = document.getElementById("formPhone").value.trim();
      const email   = document.getElementById("formEmail").value.trim();
      const message = document.getElementById("formMessage").value.trim();

      // Validación básica
      if (!name || !phone || !message) {
        shakeForm(contactForm);
        return;
      }

      // Construir mensaje de WhatsApp
      const waMessage = encodeURIComponent(
        `Hola, me llamo *${name}*.\n` +
        `📞 Teléfono: ${phone}\n` +
        (email ? `📧 Email: ${email}\n` : "") +
        `\n💬 Mensaje:\n${message}`
      );

      const waURL = `https://wa.me/51987654321?text=${waMessage}`;

      // Mostrar mensaje de éxito
      formSuccess.style.display = "block";
      contactForm.reset();

      // Redirigir a WhatsApp después de un momento
      setTimeout(() => {
        window.open(waURL, "_blank");
        setTimeout(() => {
          formSuccess.style.display = "none";
        }, 5000);
      }, 800);
    });
  }

  // Animación de vibración para errores de formulario
  function shakeForm(form) {
    form.style.animation = "shakeForm 0.4s ease";
    setTimeout(() => { form.style.animation = ""; }, 400);
  }

  /* ============================================================
     6. CATEGORY CARDS: click para mostrar info en modal
     ============================================================ */
  const categoryData = {
    maquinaria: {
      title: "Maquinaria Pesada",
      icon: "fas fa-truck-monster",
      items: [
        "Motobombas 2\", 3\" y 4\"",
        "Generadores 2KW – 15KW",
        "Compresoras de aire",
        "Retroexcavadoras (alquiler)",
        "Cargadores frontales",
        "Motores diésel y gasolina"
      ]
    },
    seguridad: {
      title: "Equipos de Seguridad",
      icon: "fas fa-hard-hat",
      items: [
        "Cascos MSA, 3M, Karam",
        "Respiradores y filtros 3M",
        "Lentes de seguridad",
        "Guantes industriales",
        "Botas punta de acero",
        "Arneses y líneas de vida"
      ]
    },
    herramientas: {
      title: "Herramientas Industriales",
      icon: "fas fa-tools",
      items: [
        "Rotomartillos Bosch / Dewalt",
        "Amoladoras angulares 4½\", 7\", 9\"",
        "Taladros percutores",
        "Llaves de impacto",
        "Soldadoras inversoras",
        "Juegos de llaves y ratchets"
      ]
    },
    electrico: {
      title: "Materiales Eléctricos",
      icon: "fas fa-bolt",
      items: [
        "Cables THW / THWN",
        "Tableros eléctricos",
        "Disyuntores y fusibles",
        "Motores eléctricos",
        "Transformadores",
        "Luminarias LED industriales"
      ]
    },
    hidraulica: {
      title: "Sistemas Hidráulicos",
      icon: "fas fa-tint",
      items: [
        "Bombas hidráulicas",
        "Mangueras de alta presión",
        "Conectores y adaptadores",
        "Cilindros hidráulicos",
        "Aceites y fluidos",
        "Válvulas y distribuidores"
      ]
    },
    consumibles: {
      title: "Consumibles y Repuestos",
      icon: "fas fa-cogs",
      items: [
        "Discos de corte y desbaste",
        "Brocas industriales",
        "Aceites y lubricantes",
        "Filtros de aire y aceite",
        "Correas y rodamientos",
        "Soldadura electrodo y MIG"
      ]
    }
  };

  const catCards = document.querySelectorAll(".cat-card");

  catCards.forEach(card => {
    card.addEventListener("click", () => {
      const key  = card.getAttribute("data-category");
      const data = categoryData[key];
      if (!data) return;

      openModal(data);
    });
  });

  /* ============================================================
     7. MODAL: muestra categoría con productos
     ============================================================ */
  function openModal(data) {
    // Crear overlay
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.85);
      display: flex; align-items: center; justify-content: center;
      padding: 24px;
      animation: fadeIn 0.25s ease;
      backdrop-filter: blur(6px);
    `;

    const itemsHTML = data.items.map(item => `
      <li style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:0.9rem;color:#ccc;">
        <i class="fas fa-check-circle" style="color:#f5c400;flex-shrink:0;"></i> ${item}
      </li>
    `).join("");

    overlay.innerHTML = `
      <div style="
        background: #1a1a1a;
        border: 1px solid rgba(245,196,0,0.2);
        border-radius: 16px;
        max-width: 520px;
        width: 100%;
        padding: 40px;
        position: relative;
        animation: slideUp 0.3s ease;
      ">
        <button class="modal-close" style="
          position:absolute; top:16px; right:16px;
          background:#222; border:none; width:36px; height:36px;
          border-radius:8px; color:#fff; font-size:1.1rem; cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:background 0.2s;
        ">✕</button>

        <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
          <div style="
            width:56px;height:56px;background:#f5c400;border-radius:14px;
            display:flex;align-items:center;justify-content:center;
            font-size:1.4rem;color:#000;flex-shrink:0;
          "><i class="${data.icon}"></i></div>
          <div>
            <p style="font-family:'Barlow Condensed',sans-serif;font-size:0.7rem;letter-spacing:3px;color:#f5c400;text-transform:uppercase;">Categoría</p>
            <h3 style="font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:2px;color:#fff;">${data.title}</h3>
          </div>
        </div>

        <ul style="list-style:none;margin-bottom:28px;">
          ${itemsHTML}
        </ul>

        <a href="https://wa.me/51987654321?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20${encodeURIComponent(data.title)}"
           target="_blank"
           style="
             display:flex;align-items:center;justify-content:center;gap:10px;
             background:#25d366;color:#fff;
             font-family:'Barlow Condensed',sans-serif;font-size:0.9rem;font-weight:700;
             letter-spacing:2px;text-transform:uppercase;
             padding:14px;border-radius:8px;
             text-decoration:none;
             transition:background 0.2s;
           ">
          <i class="fab fa-whatsapp" style="font-size:1.2rem;"></i>
          CONSULTAR PRECIO POR WHATSAPP
        </a>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    // Cerrar al click en overlay o botón
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.classList.contains("modal-close") || e.target.closest(".modal-close")) {
        closeModal(overlay);
      }
    });

    // Cerrar con Escape
    document.addEventListener("keydown", function escHandler(e) {
      if (e.key === "Escape") {
        closeModal(overlay);
        document.removeEventListener("keydown", escHandler);
      }
    });
  }

  function closeModal(overlay) {
    overlay.style.animation = "fadeOut 0.2s ease forwards";
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = "";
    }, 200);
  }

  /* ============================================================
     8. BACK TO TOP
     ============================================================ */
  const backToTopBtn = document.getElementById("backToTop");

  function toggleBackToTop() {
    backToTopBtn.classList.toggle("visible", window.scrollY > 400);
  }

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ============================================================
     9. WHATSAPP FLOATING: mostrar/ocultar tooltip auto
     ============================================================ */
  const floatingWA = document.getElementById("floatingWhatsapp");

  // Mostrar tooltip automático a los 3 segundos
  setTimeout(() => {
    if (floatingWA) {
      const tooltip = floatingWA.querySelector(".floating-tooltip");
      if (tooltip) {
        tooltip.style.opacity = "1";
        setTimeout(() => { tooltip.style.opacity = ""; }, 3500);
      }
    }
  }, 3000);

  /* ============================================================
     10. WHATSAPP NAVBAR: efecto de click
     ============================================================ */
  const whatsappNavBtn = document.getElementById("whatsappBtn");

  if (whatsappNavBtn) {
    whatsappNavBtn.addEventListener("click", () => {
      // Efecto visual de click
      whatsappNavBtn.style.transform = "scale(0.95)";
      setTimeout(() => { whatsappNavBtn.style.transform = ""; }, 150);
    });
  }

  /* ============================================================
     11. SMOOTH SCROLL para todos los links internos
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 72; // altura del navbar
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    });
  });

  /* ============================================================
     12. INTERSECTION OBSERVER: animaciones al entrar en vista
     ============================================================ */
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = "1";
        entry.target.style.transform  = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Aplicar observación a tarjetas
  const animatables = document.querySelectorAll(
    ".cat-card, .service-card, .product-card, .stat-item, .about-text, .contact-item"
  );

  animatables.forEach((el, i) => {
    el.style.opacity    = "0";
    el.style.transform  = "translateY(30px)";
    el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
    observer.observe(el);
  });

  /* ============================================================
     13. INJECT KEYFRAMES dinámicos
     ============================================================ */
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to   { opacity: 0; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInCard {
      from { opacity: 0; transform: translateY(16px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes shakeForm {
      0%, 100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-6px); }
      80%      { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(style);

  /* ============================================================
     14. NAVBAR WHATSAPP: botón dinámico con número de teléfono
         (fácil de cambiar en un solo lugar)
     ============================================================ */
  const WA_NUMBER = "51987654321"; // ← Cambiar aquí el número

  // Actualizar todos los links de WhatsApp con el número correcto
  document.querySelectorAll('[href*="wa.me"]').forEach(link => {
    const url      = new URL(link.href);
    const parts    = url.pathname.split("/").filter(Boolean);
    const textParam = url.searchParams.get("text") || "";

    link.href = `https://wa.me/${WA_NUMBER}${textParam ? "?text=" + encodeURIComponent(decodeURIComponent(textParam)) : ""}`;
  });

  /* ============================================================
     15. CONSOLE BRANDING
     ============================================================ */
  console.log(
    "%c⛏ FERRETERÍA DE LA MINERÍA\n%cPuerto Maldonado • Madre de Dios\nDesarrollado con ❤ para la industria minera.",
    "color: #f5c400; font-size: 18px; font-weight: bold;",
    "color: #888; font-size: 12px;"
  );

})();
