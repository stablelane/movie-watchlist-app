const cardSection = document.getElementById('card-section')
const movie = getMovieArray()
populate(movie)
document.addEventListener('click', function(e){
    if(e.target.dataset.movie){
        document.getElementById(e.target.dataset.movie).classList.toggle('hidden')
    }else if(e.target.dataset.watchlist){
        localStorage.removeItem(e.target.dataset.watchlist)
        populate(getMovieArray())
    }
})
function getMovieArray(){
    return Object.keys(localStorage).map(key => 
                JSON.parse(localStorage.getItem(key)))
}

function populate(data){
    
    cardSection.innerHTML = ''
    data.forEach(movie => 
        cardSection.innerHTML += 
            `<div class="cards">
                    <img src="${movie.Poster}" class="card-image">
                    <div class="card-contents">
                        <h3 class="movie-name">${movie.Title}</h3>
                        <div class="runtimeGenre">
                            <h4>Year: ${movie.Year}</h4>
                            
                            <button data-watchlist="${movie.imdbID}">-</button>
                            <h4 class="watchlist">Remove</h4>
                        </div>
                        <h4 class="movie-type">Type: ${movie.Type}</h4>
                        <button data-movie="${movie.imdbID}" id="view-details" class="view-details">View Details</button>
                        <div class="hidden details" id="${movie.imdbID}">
                            <div class="ratings">
                                <div class="rating-sites">
                                    <img src="images/star.png">
                                    <p>${movie.Ratings[0].Value}<p>
                                </div>
                                <div class="rating-sites">
                                    <img src="images/meta.png">
                                    <p>${movie.Ratings[2].Value}<p>
                                </div>
                                
                            </div>
                                <h4>${movie.Genre}</h4>
                                <p class="description">${movie.Plot}</p>
                        </div>
                    </div>`
            )
    
}