const apiKey = 'd922c2b6'; // Replace with your OMDb API key

async function searchMovies() {
  const query = document.getElementById('searchInput').value.trim();
  const movieGrid = document.getElementById('movieGrid');
  movieGrid.innerHTML = '';

  if (!query) {
    movieGrid.innerHTML = `<p style="text-align:center;">Please enter a search term.</p>`;
    return;
  }

  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.Response === "True") {
      data.Search.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
          <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.Title}" />
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>
          
        `;

         movieCard.addEventListener('click', () => {
          
  window.location.href = `movie.html?id=${movie.imdbID}`;
});


        movieGrid.appendChild(movieCard);
      });
    } else {
      movieGrid.innerHTML = `<p style="text-align:center;">No movies found for "${query}".</p>`;
    }
  } catch (error) {
    movieGrid.innerHTML = `<p style="text-align:center; color: red;">Error fetching data. Please try again later.</p>`;
    console.error(error);
  }
}

document.getElementById('searchInput').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    searchMovies();
  }
});