const cardSection = document.getElementById('card-section')

populate()

document.addEventListener('click', function(e){
    if(e.target.dataset.movie){
        document.getElementById(e.target.dataset.movie).classList.toggle('hidden')
    }else if(e.target.dataset.watchlist){
        // need to change this
        deleteMovie(e.target.dataset.watchlist)
    }
})

async function deleteMovie(id) {
    try {
        const response = await fetch("/api/watchlist", {
            method: 'DELETE',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ id : id})
        })
        const result = await response.json()
        console.log(result)
        await populate()
        
    } catch (error) {
        console.log(error)
    }

}

async function populate(){
    const data = await getmovies()
    cardSection.innerHTML = ''
    data.forEach(movie => 
        cardSection.innerHTML += 
        `<div class="cards">
        <img src="${movie.data.Poster}" class="card-image">
        <div class="card-contents">
        <h3 class="movie-name">${movie.data.Title}</h3>
                        <div class="runtimeGenre">
                            <h4>Year: ${movie.data.Year}</h4>
                            
                            <button data-watchlist="${movie.data.imdbID}">-</button>
                            <h4 class="watchlist">Remove</h4>
                            </div>
                            <h4 class="movie-type">Type: ${movie.data.Type}</h4>
                            <button data-movie="${movie.data.imdbID}" id="view-details" class="view-details">View Details</button>
                            <div class="hidden details" id="${movie.data.imdbID}">
                            <div class="ratings">
                            <div class="rating-sites">
                            <img src="images/star.png">
                            <p>${movie.data.Ratings[0]?.Value}<p>
                            </div>
                            <div class="rating-sites">
                            <img src="images/meta.png">
                            <p>${movie.data.Ratings[2]?.Value}<p>
                            </div>
                            
                            </div>
                            <h4>${movie.data.Genre}</h4>
                                <p class="description">${movie.data.Plot}</p>
                                </div>
                                </div>`
            )
    
}

async function getmovies() {
    const response = await fetch('/api/watchlist')
    const result = await response.json()
    console.log(result)
    return result
    
}
