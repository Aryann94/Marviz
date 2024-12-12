document.addEventListener("DOMContentLoaded", function () {
  const dpr = window.devicePixelRatio || 1;
  const canvas = document.getElementById("visualization");
  const ctx = canvas.getContext("2d");

  // Dimensions logiques souhaitées
  const logicalWidth = 1470;
  const logicalHeight = 800;

  ctx.fillStyle = "#160202";
  ctx.fillRect(0, 0, logicalWidth, logicalHeight);

  // Ajuster la taille du canvas pour le DPR
  canvas.width = logicalWidth * dpr;
  canvas.height = logicalHeight * dpr;

  // Définir la taille d'affichage CSS
  canvas.style.width = `${logicalWidth}px`;
  canvas.style.height = `${logicalHeight}px`;

  // Mettre à l'échelle le contexte
  ctx.scale(dpr, dpr);

  // Configuration de base
  const centerX = logicalWidth / 2;
  const centerY = logicalHeight / 2;
  const radius = Math.min(centerX, centerY) * 0.85;
  const maxArcAngle = Math.PI * 1.5;
  const strokeWidth = 12;

  const startColor = { r: 176, g: 18, b: 58 }; // #B0123A
  const endColor = { r: 253, g: 181, b: 168 }; // #FDB5A8
  const textSize = 16;

  function interpolateColor(color1, color2, factor) {
    return {
      r: Math.round(color1.r + (color2.r - color1.r) * factor),
      g: Math.round(color1.g + (color2.g - color1.g) * factor),
      b: Math.round(color1.b + (color2.b - color1.b) * factor),
    };
  }

  function formatBoxOffice(value) {
    const euroValue = value * 0.92;
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(euroValue);
  }

  function createTooltip() {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip box-office-tooltip";
    tooltip.id = "box-office-tooltip";
    document.body.appendChild(tooltip);
    return tooltip;
  }

  // Fonction de dessin du canvas initial
  function drawInitialCanvas(
    ctx,
    top10,
    maxBoxOffice,
    logicalWidth,
    logicalHeight
  ) {
    // Nettoyer complètement le canvas
    ctx.fillStyle = "#160202";
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    top10.forEach((film, index) => {
      const arcPercent = Number(film.totalBoxOffice) / maxBoxOffice;
      const arcLength = arcPercent * maxArcAngle;

      const currentRadius = radius - index * (strokeWidth + 8);

      // Position du texte
      const textAngle = -Math.PI / 2;
      const textRadius = currentRadius;
      const textX = centerX + Math.cos(textAngle) * textRadius - 20;
      const textY = centerY + Math.sin(textAngle) * textRadius + 0.5;

      // Couleur de l'arc
      const colorFactor = index / 9;
      const color = interpolateColor(startColor, endColor, colorFactor);
      const arcColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

      // Dessin de l'arc
      ctx.beginPath();
      ctx.strokeStyle = arcColor;
      ctx.lineWidth = strokeWidth;
      ctx.arc(
        centerX,
        centerY,
        currentRadius,
        -Math.PI / 2,
        -Math.PI / 2 + arcLength,
        false
      );
      ctx.stroke();

      // Texte du film
      ctx.save();
      ctx.fillStyle = "white";
      ctx.font = `bold ${textSize}px Satoshi-Bold`;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(`${film.filmLabel}`, textX, textY);
      ctx.restore();
    });
  }

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  function animateArcs(ctx, top10, maxBoxOffice, logicalWidth, logicalHeight) {
    let hasAnimated = false;

    function performAnimation() {
      let startTime = null;
      const animationDuration = 2000;
      const textAppearanceDuration = 500;

      function draw(currentTime) {
        if (!startTime) startTime = currentTime;

        const elapsed = currentTime - startTime;
        // Appliquer la fonction ease-out à la progression
        const linearProgress = Math.min(elapsed / animationDuration, 1);
        const progress = easeOutCubic(linearProgress);

        ctx.fillStyle = "#160202";
        ctx.fillRect(0, 0, logicalWidth, logicalHeight);

        top10.forEach((film, index) => {
          const arcPercent = Number(film.totalBoxOffice) / maxBoxOffice;
          const fullArcLength = arcPercent * maxArcAngle;
          const currentArcLength = fullArcLength * progress;
          const currentRadius = radius - index * (strokeWidth + 8);

          const textAngle = -Math.PI / 2;
          const textRadius = currentRadius;
          const textX = centerX + Math.cos(textAngle) * textRadius - 20;
          const textY = centerY + Math.sin(textAngle) * textRadius + 0.5;

          const colorFactor = index / 9;
          const color = interpolateColor(startColor, endColor, colorFactor);
          const arcColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

          ctx.beginPath();
          ctx.strokeStyle = arcColor;
          ctx.lineWidth = strokeWidth;
          ctx.arc(
            centerX,
            centerY,
            currentRadius,
            -Math.PI / 2,
            -Math.PI / 2 + currentArcLength,
            false
          );
          ctx.stroke();

          if (progress > 0.7) {
            const textProgress = Math.min((progress - 0.7) / 0.3, 1);
            const easedTextProgress = easeOutCubic(textProgress); // Appliquer ease-out aussi au texte

            ctx.save();
            ctx.globalAlpha = easedTextProgress;
            ctx.fillStyle = "white";
            ctx.font = `bold ${textSize}px Satoshi-Bold`;
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";

            const translateOffset = 20 * (1 - easedTextProgress);
            ctx.translate(0, translateOffset);

            ctx.fillText(`${film.filmLabel}`, textX, textY);
            ctx.restore();
          }
        });

        if (progress < 1) {
          requestAnimationFrame(draw);
        }
      }

      requestAnimationFrame(draw);
    }

    // Créer l'Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Vérifier si l'élément est visible ET n'a pas déjà été animé
          if (entry.isIntersecting && !hasAnimated) {
            performAnimation();
            hasAnimated = true;
            // Arrêter d'observer une fois l'animation déclenchée
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // Options de l'observateur
        root: null, // utilise la viewport
        rootMargin: "0px", // marge autour de la viewport
        threshold: 0.1, // déclenche quand au moins 10% de l'élément est visible
      }
    );

    // Commencer à observer le canvas
    observer.observe(canvas);
  }

  fetch("marvelData.json")
    .then((response) => response.json())
    .then((data) => {
      const top10 = data
        .sort((a, b) => Number(b.totalBoxOffice) - Number(a.totalBoxOffice))
        .slice(0, 15);

      const maxBoxOffice = Math.max(
        ...top10.map((film) => Number(film.totalBoxOffice))
      );

      animateArcs(ctx, top10, maxBoxOffice, logicalWidth, logicalHeight);

      drawInitialCanvas(ctx, top10, maxBoxOffice, logicalWidth, logicalHeight);

      let lastHoveredIndex = -1;

      canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * dpr;
        const y = (event.clientY - rect.top) * dpr;

        canvas.style.cursor = "default";
        const tooltip =
          document.querySelector("#box-office-tooltip") || createTooltip();
        tooltip.style.display = "none";

        if (!tooltip) {
          tooltip = createTooltip();
        }
        tooltip.style.display = "none";

        let hoveredIndex = -1;

        top10.forEach((film, index) => {
          const arcPercent = Number(film.totalBoxOffice) / maxBoxOffice;
          const arcLength = arcPercent * maxArcAngle;
          const currentRadius = radius - index * (strokeWidth + 8);

          const dx = x - centerX * dpr;
          const dy = y - centerY * dpr;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let angle = Math.atan2(dy, dx);
          if (angle < 0) angle += 2 * Math.PI;
          angle = (angle + Math.PI / 2) % (2 * Math.PI);

          const detectionWidth = strokeWidth * 1.5;

          const isNearRadius =
            Math.abs(distance - currentRadius * dpr) < detectionWidth * dpr;
          const isWithinArcAngle = angle >= 0 && angle <= arcLength;

          if (isNearRadius && isWithinArcAngle) {
            canvas.style.cursor = "pointer";
            hoveredIndex = index;

            tooltip.innerHTML = `
                        <img src="${film.urlAffiche}" alt="${film.filmLabel}">
                        <div class="tooltip-info">
                            <h3>${film.filmLabel}</h3>
                            <p>Box Office: ${formatBoxOffice(
                              film.totalBoxOffice
                            )}</p>
                            <p>Année de sortie: ${film.releaseYear}</p>
                        </div>
                    `;
            tooltip.style.display = "block";
            tooltip.style.left = event.pageX + 20 + "px";
            tooltip.style.top = event.pageY - 20 + "px";
          }
        });

        // Redessiner uniquement si l'arc survolé change
        if (hoveredIndex !== lastHoveredIndex) {
          // Réutiliser la fonction de dessin initial comme base
          drawInitialCanvas(
            ctx,
            top10,
            maxBoxOffice,
            logicalWidth,
            logicalHeight
          );

          // Ajouter l'effet de hover uniquement sur l'arc survolé
          if (hoveredIndex !== -1) {
            const film = top10[hoveredIndex];
            const arcPercent = Number(film.totalBoxOffice) / maxBoxOffice;
            const arcLength = arcPercent * maxArcAngle;

            const currentRadius = radius - hoveredIndex * (strokeWidth + 8);
            const currentStrokeWidth = strokeWidth * 1.5;

            const textAngle = -Math.PI / 2;
            const textRadius = currentRadius;
            const textX = centerX + Math.cos(textAngle) * textRadius - 20;
            const textY = centerY + Math.sin(textAngle) * textRadius + 0.5;

            // Couleur de l'arc
            const colorFactor = hoveredIndex / 9;
            const color = interpolateColor(startColor, endColor, colorFactor);
            const hoverArcColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`;

            // Dessin de l'arc survolé
            ctx.beginPath();
            ctx.strokeStyle = hoverArcColor;
            ctx.lineWidth = currentStrokeWidth;
            ctx.arc(
              centerX,
              centerY,
              currentRadius,
              -Math.PI / 2,
              -Math.PI / 2 + arcLength,
              false
            );
            ctx.stroke();

            // Texte du film survolé
            ctx.save();
            ctx.fillStyle = "red";
            ctx.font = `bold ${textSize}px Satoshi-Bold`;
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillText(`${film.filmLabel}`, textX, textY);
            ctx.restore();
          }

          lastHoveredIndex = hoveredIndex;
        }
      });

      // Réinitialisation au mouseout
      canvas.addEventListener("mouseout", () => {
        const tooltip = document.querySelector("#box-office-tooltip");
        if (tooltip) {
          tooltip.style.display = "none";
        }

        drawInitialCanvas(
          ctx,
          top10,
          maxBoxOffice,
          logicalWidth,
          logicalHeight
        );
        lastHoveredIndex = -1;
      });

      canvas.addEventListener("click", (event) => {
        const tooltip = document.querySelector("#box-office-tooltip");
        if (tooltip) {
          tooltip.style.display = "none";
        }

        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * dpr;
        const y = (event.clientY - rect.top) * dpr;

        top10.forEach((film, index) => {
          const arcPercent = Number(film.totalBoxOffice) / maxBoxOffice;
          const arcLength = arcPercent * maxArcAngle;
          const currentRadius = radius - index * (strokeWidth + 8);

          const dx = x - centerX * dpr;
          const dy = y - centerY * dpr;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let angle = Math.atan2(dy, dx);
          if (angle < 0) angle += 2 * Math.PI;
          angle = (angle + Math.PI / 2) % (2 * Math.PI);

          const detectionWidth = strokeWidth * 1.5;

          const isNearRadius =
            Math.abs(distance - currentRadius * dpr) < detectionWidth * dpr;
          const isWithinArcAngle = angle >= 0 && angle <= arcLength;

          if (isNearRadius && isWithinArcAngle) {
            openTrailerModal(film);
          }
        });
      });

      function openTrailerModal(film) {
        // Créer ou récupérer la modal existante
        let modal = document.getElementById("trailerModal");
        if (!modal) {
          modal = document.createElement("div");
          modal.id = "trailerModal";
          modal.className = "modal";
          modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title"></h2>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-trailer-container">
                    <iframe class="modal-trailer" src="" allowfullscreen></iframe>
                </div>
            </div>
        `;
          document.body.appendChild(modal);

          // Ajouter les écouteurs d'événements
          modal
            .querySelector(".modal-close")
            .addEventListener("click", closeModal);
          modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
          });
        }

        // Mettre à jour le contenu
        const title = modal.querySelector(".modal-title");
        const trailer = modal.querySelector(".modal-trailer");

        title.textContent = film.filmLabel;
        trailer.src = film.urlBandeAnnonce;

        // Afficher la modal
        modal.classList.add("active");
      }

      function closeModal() {
        const modal = document.getElementById("trailerModal");
        if (modal) {
          const trailer = modal.querySelector(".modal-trailer");

          modal.classList.remove("active");

          // Réinitialiser la source de l'iframe pour arrêter la vidéo
          setTimeout(() => {
            trailer.src = "";
          }, 300);
        }
      }
    });
});
