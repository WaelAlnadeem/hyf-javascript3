'use strict';
const APIUrl = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

document.getElementById("root");
const header = document.createElement('div');
root.appendChild(header);
const head = document.createElement('h2');
header.appendChild(head);
head.innerHTML = "HYF Repositories";
const select = document.createElement('select');
header.appendChild(select);
const main = document.createElement('div');
root.appendChild(main);
const details = document.createElement('div');
main.appendChild(details);
const contributer = document.createElement('div');
main.appendChild(contributer);
const contributions = document.createElement('h2');
main.className = "main";
select.className = "select";
details.className = "details";
contributer.className = "contributer";
header.className = "header";
head.className = "head";
contributions.className = 'contributionsHead';

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
const newData = {};
fetchJSON(APIUrl)
    .then(data => {
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
    contributer.innerHTML = '';
    result(newData[repoName]);
});


function result(repoData) {
    contributer.appendChild(contributions);
    contributions.innerHTML = "contributions";
    const detailsText = document.createElement('p');
    detailsText.innerHTML = 'name : <a href = "' + repoData.gitHubAdress + '">  ' + repoData.name + ' </a><br>' + 'description : ' + repoData.description + '<br>' + 'forks : ' + repoData.forks + '<br>' + 'updated : ' + repoData.updatedAt;
    detailsText.className = "detailsText";
    details.appendChild(detailsText);
    fetchJSON(repoData.contribute)
        .then(data => {
            fetchJSON(data.contributors_url)
                .then(data => {
                    for (let i = 0; i < data.length; i++) {
                        const img = document.createElement('img');
                        img.setAttribute('src', data[i].avatar_url);
                        img.setAttribute("class", "Img");
                        contributer.appendChild(img);
                        const contribution = document.createElement('p');
                        contribution.className = "contribution";
                        contribution.innerHTML = data[i].contributions;
                        contribution.className = "contribution";
                        contributer.appendChild(contribution);
                        const login = document.createElement('h3');
                        login.className = "login";
                        login.innerHTML = data[i].login;
                        contributer.appendChild(login);

                    }
                });

        });
}
