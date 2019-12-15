async function getCallbackRequests() {
    return await fetch('/callback-requests')
        .then((response) => response.json())
        .then((data) => data);
}

let requestsBlock = document.querySelector('#v-pills-callbacks');

requestsBlock.addEventListener('click', function(e) {
    if(e.target.classList.contains('btn-remove')) {
        let id = e.target.parentNode.parentNode.querySelector('.id').value;
        fetch('/callback-requests/' + id, {
            method: 'DELETE'
        }).then((resp) => resp.text())
        .then(() => window.history.go());
    }
})