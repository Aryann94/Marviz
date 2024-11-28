document.addEventListener("DOMContentLoaded", () => {

    let filmsData = [];

    fetch('marvelData.json')
        .then((response) => response.json())
        .then((data) => {
            filmsData = data;
            filmsData.sort((a, b) => a.anneemarvel - b.anneemarvel);
            dessineHistogramme();
        })

    const svg = document.getElementById("histogrammeChrono");
    const infobulle = document.getElementById("infobulle");

    const largeurHistogramme = svg.clientWidth;
    const hauteurHistogramme = svg.clientHeight - 40;
    const largeurBarre = 25;
    const espacementBarre = 5;
    const decaleaxe = 40;

    const reelanneemax = 2025;
    const reelanneemin = 2007;
    const ratioHauteur = hauteurHistogramme / (reelanneemax - reelanneemin);


    function dessineHistogramme() {
        dessineAxes();

        let barres = '';
        filmsData.forEach((film, num) => {

            const x = decaleaxe + num * (largeurBarre + espacementBarre);
            const hauteurBarre = (film.releaseYear - reelanneemin) * ratioHauteur;

            barres += `<rect class="barre" x="${x}" y="${hauteurHistogramme - hauteurBarre}" width="${largeurBarre}" height="${hauteurBarre}" 
                          nom-film="${film.filmLabel}" anneemarvel="${film.anneemarvel}" releaseyear="${film.releaseYear}"></rect>`;
        });

        svg.innerHTML += barres;


        document.querySelectorAll('.barre').forEach(barre => {
            barre.addEventListener("mouseover", (event) => {
                const filmLabel = barre.getAttribute("nom-film");
                const anneemarvel = barre.getAttribute("anneemarvel");
                const releaseYear = barre.getAttribute("releaseyear");

                infobulle.style.display = "block";
                infobulle.innerHTML = `Film: ${filmLabel}<br>Année Marvel: ${anneemarvel}<br>Année de Réalisation: ${releaseYear}`;
                infobulle.style.left = `${event.pageX + 10}px`;
                infobulle.style.top = `${event.pageY - 30}px`;
            });

            barre.addEventListener("mouseleave", () => {
                infobulle.style.display = "none";
            });
        });

        function dessineAxes() {

            const longueurAxeX = filmsData.length * (largeurBarre + espacementBarre) + decaleaxe;
            svg.innerHTML += `<path style="stroke:white;" d="M ${decaleaxe} ${hauteurHistogramme} L ${longueurAxeX} ${hauteurHistogramme}" />
                          <path style="stroke:white;" d="M ${decaleaxe} ${hauteurHistogramme} L ${decaleaxe} 0" />`;

            filmsData.forEach((film, i) => {
                const x = decaleaxe + i * (largeurBarre + espacementBarre) + largeurBarre / 2;
                svg.innerHTML += `<text x="${x - 10}" y="${hauteurHistogramme + 15}" font-size="10" style="fill:white;">${film.anneemarvel}</text>`;
            });

            for (let annee = reelanneemin; annee <= reelanneemax; annee += 1) {
                const y = hauteurHistogramme - ((annee - reelanneemin) * ratioHauteur);
                svg.innerHTML += `<text x="${decaleaxe - 5}" y="${y}" font-size="10" text-anchor="end" style="fill:white;">${annee}</text>`;
            }
        }
    }

    dessineHistogramme();
});