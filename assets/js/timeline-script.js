document.addEventListener("DOMContentLoaded", function () {
  const margin = { top: 50, right: 250, bottom: 50, left: 250 };
  const width = 1000 - margin.left - margin.right;
  const height = 2000 - margin.top - margin.bottom;

  const svg = d3
    .select("#timeline")
    .append("svg")
    .attr("width", "100%")
    .attr("height", height + margin.top + margin.bottom)
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${
        height + margin.top + margin.bottom
      }`
    )
    .append("g")
    .attr("transform", `translate(${margin.left + width / 2},${margin.top})`);

  d3.json("marvelData.json").then((data) => {
    data.sort((a, b) => parseInt(a.anneemarvel) - parseInt(b.anneemarvel));

    data.forEach((d, i) => {
      d.viewingOrder = i + 1;
    });

    const yScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, height]);

    // Ligne centrale
    svg
      .append("line")
      .attr("class", "timeline-line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", -20)
      .attr("y2", height + 20);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip timeline-tooltip")
      .attr("id", "timeline-tooltip")
      .style("opacity", 0);

    const movies = svg
      .selectAll(".movie")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "movie")
      .attr("transform", (d, i) => `translate(0,${yScale(i)})`);

    // Lignes de connexion
    movies
      .append("line")
      .attr("class", "connection-line")
      .attr("x1", 0)
      .attr("x2", (d, i) => (i % 2 === 0 ? -120 : 120))
      .attr("y1", 0)
      .attr("y2", 0);

    // Points
    movies
      .append("circle")
      .attr("class", "movie-point")
      .attr("r", 6)
      .attr("fill", "#e62429")
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    // Conteneur pour le texte
    const textGroups = movies
      .append("g")
      .attr("class", "text-group")
      .attr("transform", (d, i) => `translate(${i % 2 === 0 ? -140 : 140}, 0)`);

    // Titres avec numéro intégré
    textGroups
      .append("text")
      .attr("class", "movie-label")
      .attr("x", 0)
      .attr("y", 0)
      .style("text-anchor", (d, i) => (i % 2 === 0 ? "end" : "start"))
      .style("fill", "white")
      .text((d) => d.filmLabel);

    // Numéro en petit à côté du titre
    textGroups
      .append("text")
      .attr("class", "movie-number")
      .attr("x", (d, i) => (i % 2 === 0 ? 20 : -20))
      .attr("y", 0)
      .style("text-anchor", "middle")
      .text((d) => `#${d.viewingOrder}`);

    // Années
    textGroups
      .append("text")
      .attr("class", "movie-year")
      .attr("x", 0)
      .attr("y", 20)
      .style("text-anchor", (d, i) => (i % 2 === 0 ? "end" : "start"))
      .text((d) => `Marvel: ${d.anneemarvel} | Sortie: ${d.releaseYear}`);

// Animation au scroll avec Intersection Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        d3.select(entry.target)
          .transition()
          .duration(800)
          .style("opacity", 1);
      }
    });
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  }
);


// Ajouter une classe initiale et des styles
movies
  .style("opacity", 0)
  .classed("not-visible", true);

// Observer chaque élément de film
movies.each(function() {
  observer.observe(this);
});

    function openModal(movie) {
      const modal = document.getElementById("trailerModal");
      const title = modal.querySelector(".modal-title");
      const trailer = modal.querySelector(".modal-trailer");

      title.textContent = movie.filmLabel;
      trailer.src = movie.urlBandeAnnonce;

      modal.classList.add("active");
    }

    function closeModal() {
      const modal = document.getElementById("trailerModal");
      const trailer = modal.querySelector(".modal-trailer");

      modal.classList.remove("active");
      // Réinitialiser la source de l'iframe pour arrêter la vidéo
      setTimeout(() => {
        trailer.src = "";
      }, 300);
    }

    // Configuration des événements de la modale
    document
      .querySelector(".modal-close")
      .addEventListener("click", closeModal);
    document.getElementById("trailerModal").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) closeModal();
    });

    movies
      .on("mouseover", function (event, d) {
        const tooltip = d3.select("#timeline-tooltip");
        // Ajout de l'image de fond
        const backgroundImage = document.querySelector(
          ".timeline-background-image"
        );
        backgroundImage.style.backgroundImage = `url(${d.urlAffiche})`;
        backgroundImage.style.opacity = "0.3";

        // Effet d'agrandissement du point
        d3.select(this)
          .select(".movie-point")
          .transition()
          .duration(200)
          .attr("r", 9);

        // Affichage du tooltip
        tooltip.transition().duration(200).style("opacity", 1);

        tooltip
          .html(
            `
                    <div class="tooltip-content">
                        <img class="tooltip-image" src="${d.urlAffiche}" alt="${d.filmLabel}"/>
                        <div class="tooltip-info">
                            <h3 class="tooltip-title">${d.filmLabel}</h3>
                            <p class="tooltip-details">Ordre de visionnage: #${d.viewingOrder}</p>
                            <p class="tooltip-details">Année Marvel: ${d.anneemarvel}</p>
                            <p class="tooltip-details">Année de sortie: ${d.releaseYear}</p>
                        </div>
                    </div>
                `
          )
          .style("left", event.pageX + 20 + "px")
          .style("top", event.pageY - 20 + "px")
          .style("transform", "scale(1)");
      })
      .on("mouseout", function () {
        const backgroundImage = document.querySelector(
          ".timeline-background-image"
        );
        backgroundImage.style.opacity = "0";

        d3.select(this)
          .select(".movie-point")
          .transition()
          .duration(200)
          .attr("r", 6);

        const tooltip = d3.select("#timeline-tooltip");
        tooltip
          .transition()
          .duration(500)
          .style("opacity", 0)
          .style("transform", "scale(0.95)");
      })

      .on("click", function (event, d) {
        openModal(d);
      })

      .style("cursor", "pointer");
  });
});
