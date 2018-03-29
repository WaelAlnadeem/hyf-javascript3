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

    const newData = {};
    fetchJSON(APIUrl, function (error, data) {
        if (error) {
            root.innerHTML = error.message;
            return;
        }
        data.forEach(function (element) {
            newData[element.name] = {
                name: element.name,
                description: element.description,
                forks: element.forks,
                updatedAt: element.updated_at,
                contribute: element.url,
                gitHubAdress: element.html_url,
            };
        });
        const keysOfData = Object.keys(newData);
        keysOfData.forEach(element => {
            const option = document.createElement('option');
            option.innerHTML = element;
            option.value = element;
            select.appendChild(option);
        });
        result(newData[select.selectedOptions[0].innerText]);
    });

    select.addEventListener('change', event => {
        const repoName = event.target.value;
        details.innerHTML = '';
        contributor.innerHTML = '';
        result(newData[repoName]);
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

function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status < 400) {
                cb(null, xhr.response);

            } else {
                cb(new Error(xhr.statusText));
            }
        }
    };
    xhr.send();
}

function result(repoData) {
    const details = document.querySelector('.details');
    const contributor = document.querySelector('.contributor');
    const contributions = document.createElement('h2');
    contributor.appendChild(contributions);
    contributions.innerHTML = "contributions";
    const detailsText = document.createElement('p');
    detailsText.innerHTML = 'name : <a href = "' + repoData.gitHubAdress + '">  ' + repoData.name + ' </a><br>' + 'description : ' + repoData.description + '<br>' + 'forks : ' + repoData.forks + '<br>' + 'updated : ' + repoData.updatedAt;
    detailsText.className = "detailsText";
    details.appendChild(detailsText);
    fetchJSON(repoData.contribute, function (error, data) {
        fetchJSON(data.contributors_url, function (error, data) {
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
        });
    });

}
window.onload = main;
