//selectores
const form = document.querySelector('#form');
const hero = document.querySelector('.hero-content');
const results = document.querySelector('.results');
const modal = document.querySelector('.container-modal');
const closeModal = document.querySelector('#close');
const paginationContainer = document.querySelector('.pagination');
const favoritesContainer = document.querySelector('.container-favorites-list');
const registerPerPage = 60;
let totalPages;
let iterador;
let currentlyPage = 1;

window.onload = () =>{
    if(favoritesContainer){
        getFavorites();
        return;
    }
    form.addEventListener('submit',formValidation);
}

//funciones
function formValidation(e){
    const term = document.querySelector('#term').value;
    e.preventDefault();
    if(term.trim() === ''){
        message();
        
    }else{
        searchImages();
    }

}

function message(){
    if(document.querySelector('.error')){
        return
    }else{
        const msg = document.createElement('P');
        msg.textContent='El campo no puede estar vacio';
        msg.className='error';
        hero.appendChild(msg);
        setTimeout(()=>{
            msg.remove();
        },3000);
    }
}

function searchImages(){

    const searchTerm = document.querySelector('#term').value;
    const key='39451969-2a77607aab0487eee42367f07';
    const url=`https://pixabay.com/api/?key=${key}&q=${searchTerm}&per_page=${registerPerPage}&page=${currentlyPage}`;

    fetch(url)
        .then(result => result.json())
        .then(data => {
            totalPages = calculatePagination(data.totalHits);
            showImages(data.hits);
        }); 

}

function showImages(resultsImages){

    const btnFavoritesModal = document.querySelector('#modal-favorites');

    //clean HTML
   cleanHTML(results);
    
    resultsImages.forEach(image => {
        const{id,previewURL,previewWidth,previewHeight,largeImageURL,userImageURL,likes ,user, views,downloads} = image;
        //create div card
        const card = document.createElement('DIV');
        card.className='card';
        results.appendChild(card);
        //create a to link
        const link = document.createElement('A');
        card.appendChild(link);
        link.onclick = function(){
            modal.classList.toggle('active');
            getModal(largeImageURL,likes,user,views,userImageURL,downloads,previewURL,id,previewHeight,authorImage);
            closeModal.onclick = function(){
                modal.classList.toggle('active');
                if(existStorage(id)){
                    btnFavorites.classList.toggle('favorites-selected');
                }else{
                    btnFavorites.classList.toggle('favorites-selected');
                }
            }

        }

        //create div favorites
        const favorites = document.createElement('DIV');
        favorites.className='favorites';
        card.appendChild(favorites);
        //create button favorites
        const btnFavorites = document.createElement('BUTTON');
        btnFavorites.innerHTML=`<i class="fa-regular fa-heart"></i>`;
        btnFavorites.id = 'button-favorite-card';
        favorites.appendChild(btnFavorites);

        

        if(existStorage(id)){
            btnFavorites.classList.toggle('favorites-selected');
            btnFavoritesModal.classList.toggle('modal-favorites-active');
        }
        btnFavorites.onclick = function(){
            if(existStorage(id)){
                btnFavorites.classList.toggle('favorites-selected');
                btnFavoritesModal.classList.toggle('modal-favorites-active');
                deleteFavorite(id);

                if(favoritesContainer){
                    cleanHTML(results);
                    getFavorites();
                    return;
                }
                return;
                
            }else{
                btnFavorites.classList.toggle('favorites-selected');
                btnFavoritesModal.classList.toggle('modal-favorites-active');

            }
            AddToFavorites({
                id: id,
                previewURL: previewURL,
                previewHeight: previewHeight,
                largeImageURL: largeImageURL,
                userImageURL: userImageURL,
                authorImage: authorImage,
                user: user,
                likes: likes
            });
        }
        //add preview image
        if(previewHeight >= 150){
            card.classList.add('large');

        }
        const img = document.createElement('IMG');
        img.className='preview-photo';
        img.src=`${largeImageURL}`;
        link.appendChild(img);
        //create div to info
        const text = document.createElement('DIV');
        text.className = 'text';
        link.appendChild(text);
        //create div to author image
        const imgDiv = document.createElement('DIV');
        imgDiv.className = 'image';
        text.appendChild(imgDiv);
        // add author image
        const authorImage = document.createElement('IMG');
        authorImage.className = 'image';
        authorImage.src = `${userImageURL}`;
        imgDiv.appendChild(authorImage);
        //create div info extra
        const info = document.createElement('DIV');
        info.className = 'info';
        text.appendChild(info);
        //add name author
        info.innerHTML=`
        <p class="author">${user}</p>
        <p class="aditional"><i class="fa-solid fa-heart"></i> likes ${likes} </p>
        `;
    
    });

    // iterador = createPagination(totalPages);
    if(favoritesContainer){
        return;
    }
    showPagination();
    

}

function getModal(largeImageURL,likes,user,views,userImageURL,downloads,previewURL,id,previewHeight,authorImage){
    const perfilAuthor = document.querySelector('.perfil-author');
    const nameAuthor = document.querySelector('.name-author');
    const imgModal = document.querySelector('.img-modal');
    const likesModal = document.querySelector('.likes');
    const downloadsModal = document.querySelector('.downloads');
    const viewsModal = document.querySelector('.views');
    const btnDownloads = document.querySelector('.download');
    const imgDownload = document.querySelector('.download-img');
    const btnFavoritesModal = document.querySelector('#modal-favorites');
    const btnFavorites = document.querySelector('#button-favorite-card');
    if(existStorage(id)){
        btnFavoritesModal.classList.add('modal-favorites-active');
    }else{
        btnFavoritesModal.classList.remove('modal-favorites-active');

    }
    perfilAuthor.src=`${userImageURL}`;
    nameAuthor.textContent=`${user}`;
    imgModal.src=`${largeImageURL}`;
    likesModal.innerHTML = ` <i class="fa-regular fa-heart"></i> Likes ${likes}`;
    downloadsModal.innerHTML = ` <i class="fa-regular fa-circle-down"></i> Downloads ${downloads}`;
    viewsModal.innerHTML = ` <i class="fa-regular fa-eye"></i> Wiews ${views}`;
    btnDownloads.onclick = function (){
        imgDownload.href = `${previewURL}`;

    }
    btnFavoritesModal.onclick = function(){
        // btnFavorites.classList.toggle('favorites-selected');
        
        if(existStorage(id)){
                deleteFavorite(id);
                btnFavoritesModal.classList.toggle('modal-favorites-active');
                if(favoritesContainer){
                    cleanHTML(results);
                    getFavorites();
                }
                return
                
            }else{
                
                btnFavoritesModal.classList.toggle('modal-favorites-active');
               

            }
            AddToFavorites({
                id: id,
                previewURL: previewURL,
                previewHeight: previewHeight,
                largeImageURL: largeImageURL,
                userImageURL: userImageURL,
                authorImage: authorImage,
                user: user,
                likes: likes
            });
 
    }
    
    
}

function cleanHTML(selector){
    while(selector.firstChild){
        selector.firstChild.remove();

    }

}
// to calculate the number of images per page
function calculatePagination(total){
    return parseInt(Math.ceil(total/registerPerPage));

}  

//Generator of paginations
function *createPagination (total){
    for(let i=1; i <= total; i++){
        yield i;
    }

}

//show pagination inside web
function showPagination (){
    cleanHTML(paginationContainer);
    iterador = createPagination(totalPages);
    while(true){
        const {value, done} = iterador.next();
        if(done){
            return;
        }

        const button = document.createElement('a');
        button.href='#';
        button.dataset.page = value;
        button.textContent = value;
        button.className = 'pagination-button';

        paginationContainer.appendChild(button);

        if(value == currentlyPage){
            button.classList.add('selected');
        }

        button.onclick = function() {
            currentlyPage = value;
            searchImages();
        }



    }
}
// get favorites
function getFavorites(){
    const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
    if(favorites.length){
        showImages(favorites); 
        return;

        
    }else{

        const noFavorites = document.createElement('P');
        noFavorites.textContent='There are not favorites yet';
        results.appendChild(noFavorites);

    }
}

// add to favorites
function AddToFavorites(image){
    const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
    localStorage.setItem('favorites', JSON.stringify([...favorites,image]));

}

//to know if ID exist
function existStorage(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
    return favorites.some(favorite => favorite.id === id);
}

//delete of favorites
function deleteFavorite(id){
    const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
    const newFavorites = favorites.filter(favorite => favorite.id !== id );
    localStorage.setItem('favorites',JSON.stringify(newFavorites));

}

