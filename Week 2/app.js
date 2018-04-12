'use strict';
const APIUrl = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';


function main() {
    document.getElementById("root");

    const header = createAndAppend('div', root, { class: 'header' });
    createAndAppend('h2', header, { class: 'head', html: 'HYF Repositories' });
    const select = createAndAppend('select', header, { class: 'select' });
    const main = createAndAppend('div', root, { class: 'main' });
    const details = createAndAppend('div', main, { class: 'details' });
    const contributor = createAndAppend('div', main, { class: 'contributor' });

    let repos;
    fetchJSON(APIUrl)
        .then(data => {
            repos = data;
            repos.forEach((repo, index) => {
                createAndAppend('option', select, { html: repo.name, value: index });
            });
        })
        .then(() => { result(repos[0]); })
        .catch(err => {
            root.innerHTML = err.message;
            alert("err.message");
        });

    select.addEventListener('change', () => {
        const index = select.value;
        details.innerHTML = '';
        contributor.innerHTML = '';
        result(repos[index]);
    });
}

function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
        const value = options[key];
        if (key === 'html') {
            elem.innerHTML = value;
        } else {
            elem.setAttribute(key, value);
        }
    });
    return elem;
}

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status < 400) {
                    resolve(xhr.response);
                } else {
                    reject(new Error(xhr.statusText));
                }
            }
        };
        xhr.send();
    });
}

function result(repoData) {
    const details = document.querySelector('.details');
    const contributor = document.querySelector('.contributor');
    const contributions = document.createElement('h2');
    contributor.appendChild(contributions);
    contributions.innerHTML = "contributions";
    const detailsText = document.createElement('p');
    detailsText.innerHTML = 'name : <a href = "' + repoData.html_url + '">  ' + repoData.name + ' </a><br>' + 'description : ' + repoData.description + '<br>' + 'forks : ' + repoData.forks + '<br>' + 'updated :  ' + repoData.updated_at;
    detailsText.className = "detailsText";
    details.appendChild(detailsText);
    fetchJSON(repoData.contributors_url)
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                const img = document.createElement('img');
                img.setAttribute('src', data[i].avatar_url);
                img.setAttribute("class", "Img");
                contributor.appendChild(img);
                const contribution = document.createElement('p');
                contribution.className = "contribution";
                contribution.innerHTML = data[i].contributions;
                contribution.className = "contribution";
                contributor.appendChild(contribution);
                const login = document.createElement('h3');
                login.className = "login";
                login.innerHTML = data[i].login;
                contributor.appendChild(login);
            }
        })
        .catch(err => {
            root.innerHTML = err.message;
            alert("err.message");
        });
}
window.onload = main;
