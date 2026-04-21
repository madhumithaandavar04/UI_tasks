/**
 * function to create DOM elements with classes and attributes
 * @param {string} tag 
 * @param {string|string[]} className 
 * @param {object} attributes
 */
function createCustomElement(tag, className, attributes = {}) {
    const element = document.createElement(tag);
    
    if (className) {
        if (Array.isArray(className)) {
            element.classList.add(...className);
        } else {
            element.classList.add(className);
        }
    }
    // merge two objects
    Object.assign(element, attributes);
    return element;
}
/**
 * loadMovie: Fetches and renders the main video and its comments
 */
async function loadMovie() {
    try {
        const response = await fetch("video.json");
        const movie = await response.json();
        const primaryContent = document.getElementById('primaryContent');
        primaryContent.classList.add('primary-content');
        //Video Section
        const video = createCustomElement('video', 'movie', {
            src: movie.videoUrl,
            poster: "https://www.slashcam.de/images/news/sprite_fright1-16857_PIC1.jpg",
            onerror:removePoster
        });

        // play button and icon
        const playIcon = createCustomElement('i', ['fa-solid', 'fa-play', 'play-icon']);
        const playBtn = createCustomElement('div', 'play-container');
        playBtn.append(playIcon);
        
        const videoContainer = createCustomElement('div', 'video-container');
        videoContainer.append(video, playBtn);

        const videoTitle = createCustomElement('h3', 'movie__title', { textContent: movie.title});
        const videoDesc = createCustomElement('p', 'movie__description', { textContent: movie.description });

        // Video Event Listeners
        playBtn.addEventListener('click', () => { 
            video.controls = true; 
            video.play(); 
            playBtn.style.display = "none"; 
        });
        
        video.addEventListener('pause', () => { 
            video.controls = true; 
            playBtn.style.display = "flex"; 
        });
        
        video.addEventListener('play', () => { 
            playBtn.style.display = "none"; 
        });

        //Comment Section
        const commentSection = createCustomElement('section', 'movie__comments');
        commentSection.append(createCustomElement('h3', 'comment-heading', { textContent: "Comments" }));
        const commentFragment = document.createDocumentFragment();
        movie.comments.forEach(comment => {
            //author Image
            const commentImg = createCustomElement('img', 'comment__img', { src: comment.image });
            const commentFigure = createCustomElement('figure', 'comment__img-wrapper');
            commentFigure.append(commentImg);
            //Details
            const author = createCustomElement('h3', 'comment-details__author', { textContent: comment.name });
            const content = createCustomElement('p', 'comment-details__content', { textContent: comment.comment });
            const details = createCustomElement('div', 'comment-details');
            details.append(author, content);
            // Container
            const container = createCustomElement('article', 'comment-container');
            container.append(commentFigure, details);
            commentFragment.append(container);
        });
        commentSection.append(commentFragment);

        primaryContent.append(videoContainer, videoTitle, videoDesc, commentSection);

    } catch (error) {
        console.error("Failed to load movie data:", error);
    }
   
}

/**
 * remove poster if error occurs in video
 */
function removePoster(event){
    const video=event.target;
    video.removeAttribute('poster');
}

/**
 * loadUpcomingMovies fetch and renders upcoming movie posters
 */
async function loadUpcomingMovies() {
    const secondaryContentProjects = document.getElementById('secondaryContentProjects');
    
    try {
        const response = await fetch("posters.json");
        const posters = await response.json();
        const postersFragment = document.createDocumentFragment();

        posters.forEach(poster => {
            const img = createCustomElement('img', 'poster-img', { 
                src: poster.imageUrl, 
                alt: poster.title 
            });
            const figure = createCustomElement('figure', 'poster-wrapper');
            
            figure.append(img);
            postersFragment.append(figure);
        });

        secondaryContentProjects.append(postersFragment);
    } catch (error) {
        console.error("Failed to load upcoming movies:", error);
    }
}

// load movies and upcoming movies
loadMovie();
loadUpcomingMovies();
