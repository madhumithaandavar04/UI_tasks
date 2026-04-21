/**
 * Helper to create jQuery elements with classes and attributes
 */
function createCustomElement(tag, className, attributes = {}) {
    const $element = $(`<${tag}>`);

    if (className) {
        if (Array.isArray(className)) {
            $element.addClass(className.join(' '));
        } else {
            $element.addClass(className);
        }
    }
    // Specifically handle textContent 
    if (attributes.textContent) {
        $element.text(attributes.textContent);
        delete attributes.textContent;
    }
    // Set attributes
    $element.attr(attributes);

    return $element;
}

/**
 * loadMovie: Fetches and renders from mocki.io API
 */
async function loadMovie() {
    try {
        const movie = await $.getJSON("https://mocki.io/v1/6ec3cbb1-8853-4d2f-9bb0-a587886df33e");
        const $primaryContent = $('#primaryContent').addClass('primary-content');
        // Video Section
        const $video = createCustomElement('video', 'movie', {
            src: movie.videoUrl,
            poster: "https://www.slashcam.de/images/news/sprite_fright1-16857_PIC1.jpg"

        });
        $video.on('error', function () {
            $(this).removeAttr('poster');
        });
        const $playIcon = createCustomElement('i', ['fa-solid', 'fa-play', 'play-icon']);
        const $playBtn = createCustomElement('div', 'play-container').append($playIcon);
        const $videoContainer = createCustomElement('div', 'video-container').append($video, $playBtn);

        const $videoTitle = createCustomElement('h3', 'movie__title', { textContent: movie.title });
        const $videoDescription = createCustomElement('p', 'movie__description', { textContent: movie.description });
        // Video Event Listeners 
        $playBtn.on('click', function () {
            $video[0].controls = true;
            $video[0].play();
            $(this).hide();
        });

        $video.on('pause', () => {
            $video[0].controls = true;
            $playBtn.css('display', 'flex');
        });

        $video.on('play', () => {
            $playBtn.hide();
        });

        // Comment Section
        const $commentSection = createCustomElement('section', 'movie__comments');
        $commentSection.append(createCustomElement('h3', 'comment-heading', { textContent: "Comments" }));

        movie.comments.forEach(comment => {
            const $commentImg = createCustomElement('img', 'comment__img', { src: comment.image });
            const $commentFigure = createCustomElement('figure', 'comment__img-wrapper').append($commentImg);

            const $author = createCustomElement('h3', 'comment-details__author', { textContent: comment.name });
            const $content = createCustomElement('p', 'comment-details__content', { textContent: comment.comment });
            const $details = createCustomElement('div', 'comment-details').append($author, $content);

            const $container = createCustomElement('article', 'comment-container').append($commentFigure, $details);
            $commentSection.append($container);
        });

        $primaryContent.append($videoContainer, $videoTitle, $videoDescription, $commentSection);

    } catch (error) {
        console.error("Failed to load movie data:", error);
    }
}

/**
 * loadUpcomingMovies: Fetches posters from mocki.io API
 */
async function loadUpcomingMovies() {
    const $secondaryContent = $('#secondaryContentProjects');

    try {
        const response = await $.getJSON("https://mocki.io/v1/2fcc44b7-e0e8-4949-bb4c-fe5b1b265818");
        const posters=response.data;
        posters.forEach(poster =>{
            const $img = createCustomElement('img', 'poster-img', {
                src: poster.imageUrl,
                alt: poster.title
            }).on('error',function(){$(this).attr('src','https://www.dummyimg.in/placeholder?width=266&height=373&text=No%20image')});
            const $figure = createCustomElement('figure', 'poster-wrapper').append($img);
            $secondaryContent.append($figure);
        });
    } catch (error) {
        console.error("Failed to load upcoming movies:", error);
    }
}

// load movies and upcoming movies
$(document).ready(() => {
    loadMovie();
    loadUpcomingMovies();
});