document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const clearBtn = document.getElementById("clearBtn");
    const resultsContainer = document.getElementById("results");
  
    // Seleziona h1 e p della hero
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
  
        card.innerHTML = `
          <img src="${item.imageUrl}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <button id="visitBtn">Visit</button>
        `;
  
        resultsContainer.appendChild(card);
      });
    }
  
    async function searchPlaces(query) {
      const data = await loadData();
      query = query.toLowerCase();
  
      let results = [];
  
      data.countries.forEach(country => {
        if (country.name.toLowerCase().includes(query)) {
          results.push({ name: country.name, imageUrl: "", description: "Country" });
        }
        country.cities.forEach(city => {
          if (city.name.toLowerCase().includes(query)) {
            results.push(city);
          }
        });
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