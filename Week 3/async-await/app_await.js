'use strict';
const APIUrl = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';


async function main() {
    try {
        document.getElementById("root");

        const header = createAndAppend('div', root, { class: 'header' });
        createAndAppend('h2', header, { class: 'head', html: 'HYF Repositories' });
        const select = createAndAppend('select', header, { class: 'select' });
        const main = createAndAppend('div', root, { class: 'main' });
        const details = createAndAppend('div', main, { class: 'details' });
        const contributor = createAndAppend('div', main, { class: 'contributor' });
        let repos;

        const data = await fetchJSON(APIUrl);
        repos = data;
        repos.forEach((repo, index) => {
            createAndAppend('option', select, { html: repo.name, value: index });
        });

        renderResult(repos[0]);
        sortList(select);

        select.addEventListener('change', () => {
            const index = select.value;
            details.innerHTML = '';
            contributor.innerHTML = '';
            renderResult(repos[index]);
        });

    }

    catch (err) {
        root.innerHTML = err.message;
        alert("err.message");
    }
}

function sortList(element) {
    const repoSort = new Array();
    for (let i = 1; i < element.length; i++) {
        repoSort[i - 1] =
            element.options[i].text.toUpperCase() + "," +
            element.options[i].text + "," +
            element.options[i].value;
    }

    repoSort.sort();

    for (let i = 1; i < element.length; i++) {
        const parts = repoSort[i - 1].split(',');

        element.options[i].text = parts[1];
        element.options[i].value = parts[2];
    }
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


async function renderResult(repoData) {
    try {
        const details = document.querySelector('.details');
        const contributor = document.querySelector('.contributor');
        createAndAppend('h2', contributor, { html: 'contributions' });
        createAndAppend('p', details, {
            class: 'detailsText',
            html: 'Name : ' + "<a href=" + repoData.html_url + ' target ="_blank" >' + repoData.name + ' </a><br>' +
                'description : ' + repoData.description + '<br>' +
                'forks : ' + repoData.forks + '<br>' +
                'updated :  ' + repoData.updated_at
        });
        const data = await fetchJSON(repoData.contributors_url);
        for (let i = 0; i < data.length; i++) {
            createAndAppend('img', contributor, { class: 'Img', src: data[i].avatar_url });
            createAndAppend('p', contributor, { class: 'contribution', html: data[i].contributions });
            createAndAppend('h3', contributor, { class: 'login', html: data[i].login });
        }
    }
    catch (err) {
        root.innerHTML = err.message;
        alert("err.message");
    }
}
window.onload = main;
