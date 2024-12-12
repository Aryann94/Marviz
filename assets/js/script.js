document.addEventListener("DOMContentLoaded", function () {
  const lenis = new Lenis({
    smooth: true,
    smoothTouch: true,
    duration: 1.2,
  });

  // Fonction pour activer Lenis
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  gsap.set("header", {
    y: 100,
    opacity: 0,
  });

  setTimeout(() => {
    gsap.to("header", {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
    });
  }, 7000);

  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  const aboutSection = document.querySelector('.about-section');
  const aboutContent = aboutSection.querySelector('.about-content');

  // Créer le paragraphe s'il n'existe pas
  let paragraphElement = aboutSection.querySelector('p.typing-text');
  if (!paragraphElement) {
    paragraphElement = document.createElement('p');
    paragraphElement.classList.add('typing-text');
    aboutContent.appendChild(paragraphElement);
  }

  const paragraphText = `Cette visualisation de données vous propose une immersion dans l'univers du MCU (Marvel Cinematic Universe) en mettant en lumière les acteurs et réalisateurs marquants de la franchise. Explorez des statistiques fascinantes à travers des éléments interactifs et animés, et découvrez l'empreinte laissée par chaque talent au fil des années. Ce projet a été réalisé par trois étudiants en deuxième année de Bachelor en Métiers du Multimédia et de l'Internet. Bonne exploration dans l'univers Marvel !`;

  // Pré-remplir le paragraphe avec un espace pour maintenir la mise en page
  paragraphElement.textContent = '';

  // Animation de typing
  gsap.to(paragraphElement, {
    scrollTrigger: {
      trigger: aboutSection,
      start: 'top 80%', 
      toggleActions: 'play none none none',
    },
    duration: 3,
    text: {
      value: paragraphText,
      delimiter: "" 
    },
    ease: "none"
  });

  const animationContainer = aboutSection;

  // Écouteur de mouvement
  animationContainer.addEventListener('mousemove', (e) => {
    const rect = animationContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const moveX = (e.clientX - centerX) / 20;
    const moveY = (e.clientY - centerY) / 20;

    gsap.to(aboutContent, {
      x: moveX,
      y: moveY,
      rotation: moveX * 0.05, // Léger effet de rotation
      ease: "power1.out",
      duration: 0.5
    });
  });

  // Réinitialisation au mouseout
  animationContainer.addEventListener('mouseout', () => {
    gsap.to(aboutContent, {
      x: 0,
      y: 0,
      rotation: 0,
      ease: "power1.out",
      duration: 0.5
    });
  });
});