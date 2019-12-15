let addPostButton = document.querySelector('.create-post-btn')
let logOutButton = document.querySelector('.log-out-btn');

document.addEventListener('DOMContentLoaded', async function() {
    addPosts();
    addCallbackRequests();
    addEmails();
})

addPostButton.addEventListener('click', function() {
    let articlesTab = document.getElementById('v-pills-articles');
    articlesTab.classList.remove('show');
    articlesTab.classList.remove('active');

    let createTab = document.getElementById('v-pills-create-post');
    createTab.classList.add('show');
    createTab.classList.add('active');
})

async function addPosts() {
    let posts = await getPosts();
    let articles = document.querySelector('.articles');
    let i = 1;
    articles.innerHTML = '';
    posts.forEach((post) => {
        let postHtml = `
            <article class="d-flex justify-content-between align-items-center article-inline">
                <div class="num w5">${i++}</div>
                <input class="id" type="hidden" value="${post.id}">
                <div class="name w30">${post.title}</div>
                <div class="date w30">${post.date}</div>
                <div class="country w20">${post.country}</div>
                <div class="edit w10"><button class="btn btn-link btn-edit">Edit</button></div>
                <div class="remove w5"><button class="btn btn-link btn-remove">X</button></div>
            </article>`;
        articles.insertAdjacentHTML('beforeend', postHtml);
    })
}

async function addCallbackRequests() {
    let requests = await getCallbackRequests();
    let requestsBlock = document.querySelector('#v-pills-callbacks');
    let i = 1;
    requestsBlock.innerHTML = '';
    requests.forEach((request) => {
        let requestHtml = `
            <article class="d-flex justify-content-between align-items-center article-inline">
                <div class="num w5">${i++}</div>
                <input class="id" type="hidden" value="${request.id}">
                <div class="name w60">${request.phoneNumber}</div>
                <div class="date w30">${request.date}</div>
                <div class="remove w5"><button class="btn btn-link btn-remove">X</button></div>
            </article>`;
        requestsBlock.insertAdjacentHTML('beforeend', requestHtml);
    })
}


async function addEmails() {
    let emails = await getEmails();
    let emailsBlock = document.querySelector('#v-pills-emails');
    let i = 1;
    emailsBlock.innerHTML = '';
    emails.forEach((email) => {
        let emailHtml = `
            <article class="d-flex justify-content-between align-items-center article-inline">
                <div class="num w5">${i++}</div>
                <input class="id" type="hidden" value="${email.id}">
                <div class="name w30">${email.name}</div>
                <div class="email w30">${email.email}</div>
                <div class="date w30">${email.date}</div>
                <div class="remove w5"><button class="btn btn-link btn-remove">X</button></div>
                <div class="text" w100>${email.text}</div>
            </article>`;
        emailsBlock.insertAdjacentHTML('beforeend', emailHtml);
    })
}

logOutButton.addEventListener('click', function() {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    window.location.href = '/';
})