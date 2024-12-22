const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const cardSection = document.getElementById('card-section')


searchInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        handleClick()
    }
})
searchBtn.addEventListener('click',handleClick)
document.addEventListener('click', function(e){
    if(e.target.dataset.movie){
        addDetails(e.target.dataset.movie)
    }else if(e.target.dataset.watchlist){
        addToWatchlist(e.target.dataset.watchlist)
    }
})

async function addToWatchlist(id) {
    const response = await fetch('api/watchlist', {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ id: id }),
    })
    const result = await response.json()
    console.log(result)
}

async function handleClick(){
    const searchText = searchInput.value.replace(/ /g,'+')
    console.log(searchText)
    const res = await fetch(`http://www.omdbapi.com/?s=${searchText}&apikey=1170f02c`)
    const data = await res.json()
    if(data.Search){
        populate(data.Search)
        console.log(data.Search)
    }else{
        cardSection.innerHTML = '<h4 class="error-message">Unable to find what you’re looking for. Please try another search.</h4>'
    }
    searchInput.value = ''
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
                            
                            <button data-watchlist="${movie.imdbID}">+</button>
                            <h4 class="watchlist">Watchlist</h4>
                        </div>
                        <h4 class="movie-type">Type: ${movie.Type}</h4>
                        <button data-movie="${movie.imdbID}" id="view-details" class="view-details">View Details</button>
                        <div class="hidden details" id="${movie.imdbID}">
                            <div class="ratings">
                                <div class="rating-sites">
                                    <img src="images/star.png">
                                    <p>9.0<p>
                                </div>
                                <div class="rating-sites">
                                    <img src="images/meta.png">
                                    <p>76/100<p>
                                </div>
                                
                            </div>
                            <h4>Drama,Mystery,Sci-fi</h4>
                            <p class="description">A blade runner must pursue and terminate 
                                four replicants who stole a ship in space, 
                                and have returned to Earth to find their
                                    creator.</p>
                        </div>
                    </div>`
            )
    
}
async function addDetails(id) {
    const detailDiv = document.getElementById(id);
    let details;

    if (!details) {
        details = await getresult(id);
    }

    const rating1 = details.Ratings[0] ? details.Ratings[0].Value : '';
    const rating2 = details.Ratings[2] ? details.Ratings[2].Value : '';

    detailDiv.innerHTML = `
        <div class="ratings">
            <div class="rating-sites">
                <img src="images/star.png">
                <p>${rating1}<p>
            </div>
            <div class="rating-sites">
                <img src="images/meta.png">
                <p>${rating2}<p>
            </div>
        </div>
        <h4>${details.Genre}</h4>
        <p class="description">${details.Plot}</p>
    `;
    
    detailDiv.classList.toggle('hidden');
}

async function getWatchlist(id){
    const movie = await getresult(id)
    return movie
    
}
async function getresult(id) {
    const res = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=1170f02c`)
    const data = await res.json()
    return data
}
