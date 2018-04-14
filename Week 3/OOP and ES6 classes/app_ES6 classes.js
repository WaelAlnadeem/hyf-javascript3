'use strict';
const APIUrl = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

class Repository {
    constructor(data) {
        this._data = data;
    }
    render(parent) {
        createAndAppend('p', parent, {
            class: 'detailsText',
            html: 'Name : ' + "<a href=" + this._data.html_url + ' target ="_blank" >' + this._data.name + ' </a><br>' +
                'description : ' + this._data.description + '<br>' +
                'forks : ' + this._data.forks + '<br>' +
                'updated :  ' + this._data.updated_at
        });
    }

}

class Contributor {
    constructor(repoData) {
        this._repoData = repoData;
    }

    render(contributor) {
        createAndAppend('h2', contributor, { html: 'contributions' });
        for (let i = 0; i < this._repoData.length; i++) {
            createAndAppend('img', contributor, { class: 'Img', src: this._repoData[i].avatar_url });
            createAndAppend('p', contributor, { class: 'contribution', html: this._repoData[i].contributions });
            createAndAppend('h3', contributor, { class: 'login', html: this._repoData[i].login });
        }
    }


}

class View {
    constructor() {
        this.initialize();
    }

    async initialize() {
        const root = document.getElementById("root");
        const header = createAndAppend('div', root, { class: 'header' });
        createAndAppend('h2', header, { class: 'head', html: 'HYF Repositories' });
        const select = createAndAppend('select', header, { class: 'select' });
        const main = createAndAppend('div', root, { class: 'main' });
        const details = createAndAppend('div', main, { class: 'details' });
        const contributor = createAndAppend('div', main, { class: 'contributor' });
        let repos;
        const data = await this.fetchJSON(APIUrl);
        repos = data;
        repos.forEach((repo, index) => {
            createAndAppend('option', select, { html: repo.name, value: index });
        });
        select.addEventListener('change', () => {
            const index = select.value;
            details.innerHTML = '';
            contributor.innerHTML = '';
            this.render(repos[index]);
        });
        this.render(repos[0]);
        sortList(select);
    }
    fetchJSON(url) {
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

    async render(repoData) {
        try {
            const details = document.querySelector('.details');
            const contributor = document.querySelector('.contributor');
            const data = await this.fetchJSON(repoData.contributors_url);

            const repository = new Repository(repoData);
            repository.render(details);
            const contributors = new Contributor(data);
            contributors.render(contributor);


        }
        catch (err) {
            root.innerHTML = err.message;
            alert("err.message");
        }
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

window.onload = new View();
