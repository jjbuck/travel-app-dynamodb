let callMeForm = document.querySelector('.call-me-form');

document.addEventListener('DOMContentLoaded', async function() {
    let posts = await getPosts();
    let articles = document.querySelector('.articles');
    articles.innerHTML = '';
    posts.forEach((post) => {
        let postHtml = `
        <div class="col-4">
            <div class="card">
                <img src="${post.imageUrl}" alt="${post.title}" class="card-img-top img-fix-height">
                <div class="card-body">
                    <h4 class="card-title">${post.title}</h4>
                    <p class="card-text">${post.description}</p>
                    <a href="/sight?id=${post.id}" class="btn btn-primary">Learn More</a>
                </div>
            </div>
        </div>`;
        articles.insertAdjacentHTML('beforeend', postHtml);
    })
})

callMeForm.addEventListener('submit', function(e) {
    console.log('hello world');
    e.preventDefault();
    let phoneInp = callMeForm.querySelector('input');
    console.log(phoneInp.value);
    fetch('/callback-requests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phoneNumber: phoneInp.value
        })
    }).then((resp) => resp.text()).then(() => alert('We will call you back!'))
})