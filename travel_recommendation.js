document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const clearBtn = document.getElementById("clearBtn");
    const resultsContainer = document.getElementById("results");
  
    // Seleziona H1 e P della hero
    const heroH1 = document.querySelector(".hero-text h1");
    const heroP = document.querySelector(".hero-text p");
  
    async function loadData() {
      const response = await fetch("travel_recommendation_api.json");
      if (!response.ok) throw new Error("JSON loading error");
      return await response.json();
    }
  
    function showResults(results) {
      resultsContainer.innerHTML = ""; // pulisce risultati precedenti
  
      if (results.length === 0) {
        resultsContainer.innerHTML = "<p>No result found.</p>";
        return;
      }
  
      results.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("result-card");
  
        // Inserisce immagine solo se presente
        const imgHTML = item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}">` : "";
  
        card.innerHTML = `
          ${imgHTML}
          <h3 class="card-title">${item.name}</h3>
          <p>${item.description}</p>
          <button class="visit-btn">Visit</button>
        `;
  
        resultsContainer.appendChild(card);
      });
    }
  
    async function searchPlaces(query) {
      const data = await loadData();
      query = query.toLowerCase();
  
      let results = [];
  
      // Cerca per tipo: beach, temple, country
      if (query === "beach") {
        results = data.beaches;
      } else if (query === "temple") {
        results = data.temples;
      } else if (query === "country") {
        results = data.countries.map(c => ({ 
          name: c.name, 
          imageUrl: c.imageUrl || "", 
          description: "Country" 
        }));
      } else {
        // Ricerca per nome
        data.countries.forEach(country => {
          const countryNameLower = country.name.toLowerCase();
  
          // Aggiungi solo le città che corrispondono
          country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(query)) {
              results.push(city);
            }
          });
  
          // Aggiungi il paese solo se il nome non corrisponde esattamente alla query
          if (countryNameLower.includes(query) && countryNameLower !== query) {
            results.push({ 
              name: country.name, 
              imageUrl: country.imageUrl || "", 
              description: "Country" 
            });
          }
        });
  
        data.temples.forEach(temple => {
          if (temple.name.toLowerCase().includes(query)) {
            results.push(temple);
          }
        });
  
        data.beaches.forEach(beach => {
          if (beach.name.toLowerCase().includes(query)) {
            results.push(beach);
          }
        });
      }
  
      // Nascondi hero H1 e P
      heroH1.style.display = "none";
      heroP.style.display = "none";
  
      showResults(results);
    }
  
    searchForm.addEventListener("submit", e => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) searchPlaces(query);
    });
  
    // Gestione clear
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      resultsContainer.innerHTML = "";
  
      // Ripristina hero H1 e P
      heroH1.style.display = "block";
      heroP.style.display = "block";
    });
  });