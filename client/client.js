console.log("YO");
var CURRENT_USER = "";
const form = document.querySelector('form');
const allDots = document.querySelector('.allDots');
const API_URL = 'http://127.0.0.1:5000/dots';
const SEARCH_URL = 'http://127.0.0.1:5000/search';
const search = document.getElementById('search');
const searchButton = document.getElementById('searchButton');


getAllDots();

form.addEventListener('submit', (event)=> {
    event.preventDefault();
    console.log("Submitted");
    const formData = new FormData(form)
    const input = formData.get('input');

    const dot = {
        input
    };

    //Send 'dot' to the server and await acknowledgement.
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(dot),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
    .then(createdDot => {
        console.log(createdDot);
        form.reset();
        getAllDots();
    });
})

searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    q = search.value.toString();
    const msg = {q};
    console.log("Searching ");
    console.log(q);
    fetch(SEARCH_URL, {
        method: "POST",
        body: JSON.stringify(msg),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
    .then(res => {
        console.log("Thats you!! "+ res);
        alert(res);
    })
})

function getAllDots(){
    allDots.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(dots => {
            console.log(dots);
            dots.reverse();
            dots.forEach(dot => {
                
                const div = document.createElement('div');
                // const id = document.createElement('h3')
                // id.textContent = dot.id;
                const uname = document.createElement('h5')
                uname.textContent = dot.uname;
                const inputs = document.createElement('p');
                inputs.textContent = dot.input;
                const time = document.createElement('p');
                time.textContent = dot.timestamp;
                const seperator = document.createElement('p');
                seperator.textContent = '-------------------------------------------------------------------';

                // div.appendChild(id);
                div.appendChild(uname);
                div.appendChild(inputs);
                div.appendChild(time);
                div.appendChild(seperator);
                allDots.appendChild(div);

            }); 

        });
        fetch('http://127.0.0.1:5000/signIn')
        .then(response => response.json())
        .then(user => {
            console.log("Username  = " + user);
            document.getElementById("user").innerHTML = "Welcome, " + user;
            CURRENT_USER = user;
        })
}