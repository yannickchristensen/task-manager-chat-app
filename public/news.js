const newsList = document.querySelector('.news-list');
const searchForm = document.querySelector('.search-news-form');
const topicValue = document.getElementById('topic-value');
const languageValue = document.getElementById('language-value');
const sourceValue = document.getElementById('source-value');
const apiKey = '13d2a190ee854bfe91b757293e434b00'

btns = document.getElementsByClassName("btn");

const renderNews = (news) =>{
    let output = '';
    news.forEach(news => {
        output += `
            <div class="card mt-4 col-md-6 bg-light">
                <div class="card-body">
                <a href="${news.url}" target="_blank" class="card-link" id="go-to-url">
                    <h5 class="card-title">${news.title}</h5>
                    <img class="card-img-top img-fluid" src="${news.urlToImage}"/></a>
                    <hr>
                    <h6 class="card-subtitle mb-2 text-muted">Author: ${news.author} Published at: ${news.publishedAt}</h6>
                    <p class="card-text">${news.description}</p>
                </div>
            </div>
        `;
    });
    newsList.innerHTML = output;
}

searchForm.addEventListener('submit', getNews)

function getNews(e){
    newsList.innerHTML = ''

    e.preventDefault()

    // sets request parameters
    let topic = topicValue.value
    let language = languageValue.value
    let source = sourceValue.value
    let url= `https://newsapi.org/v2/everything?q=${topic}&language=${language}&source=${source}&apiKey=${apiKey}`

    fetch(url)
        .then(res => res.json())
        .then(data => renderNews(data.articles))
}