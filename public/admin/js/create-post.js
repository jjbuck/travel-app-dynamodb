let createForm = document.querySelector('.create-post-form');
let createTitle = document.querySelector('#create-title');
let createCountry = document.querySelector('#create-country');
let createImageUrl = document.querySelector('#create-image-url');
let createText = document.querySelector('#create-text');
let createImageFile = document.querySelector('#create-image-file');

createForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let text = createText.value;
    let data = new FormData();
    data.append('title', createTitle.value);
    data.append('country', createCountry.value);
    data.append('text', text);
    data.append('description', text.substring(0, text.indexOf('.') + 1));
    data.append('imageUrl', createImageUrl.value);
    data.append('imageFile', createImageFile.files[0]);

    fetch('/posts', {
        method: 'POST',
        body: data
    }).then(async (response) => {
        let msg = await response.text()
        console.log(msg);
        if(response.status === 400) {
            console.log('Received 400.');
            throw new Error(msg);
        }
        return msg;
    }).then((data) => window.history.go()
    ).catch((err) => {
        console.log('Inside catch.');
        alert(`${err}`);
    })
})

function disablePairedInput(input1, input2) {
    if (input1.value) {
        input1.disabled = false;
        input2.disabled = true;
    } else {
        input1.disabled = true;
        input2.disabled = false;
    }
}

createImageUrl.addEventListener('change', function() {
    disablePairedInput(this, createImageFile);
})

createImageFile.addEventListener('change', function() {
    disablePairedInput(this, createImageUrl);
})