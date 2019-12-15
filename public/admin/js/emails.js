async function getEmails() {
    return await fetch('/emails')
        .then((response) => response.json())
        .then((data) => data);
}

let emailsBlock = document.querySelector('#v-pills-emails');

emailsBlock.addEventListener('click', function(e) {
    if(e.target.classList.contains('btn-remove')) {
        let id = e.target.parentNode.parentNode.querySelector('.id').value;
        fetch('/emails/' + id, {
            method: 'DELETE'
        }).then((resp) => resp.text())
        .then(() => window.history.go());
    }
})
