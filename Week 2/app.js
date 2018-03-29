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
const contributor = document.createElement('div');
main.appendChild(contributor);
const contributions = document.createElement('h2');
main.className = "main";
select.className = "select";
details.className = "details";
contributor.className = "contributor";
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
        data.forEach(element => {
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
            option.className = "option";
            option.innerHTML = element;
            option.value = element;
            select.appendChild(option);
        });
        return (newData[select.selectedOptions[0].innerText]);
    })
    .then(data => { result(data); })
    .catch(err => {
        root.innerHTML = err.message;
        alert("err.message");
    });

select.addEventListener('change', event => {
    const repoName = event.target.value;
    details.innerHTML = '';
    contributor.innerHTML = '';
    result(newData[repoName]);
});
function result(repoData) {
    contributor.appendChild(contributions);
    contributions.innerHTML = "contributions";
    const detailsText = document.createElement('p');
    detailsText.innerHTML = 'name : <a href = "' + repoData.gitHubAdress + '">  ' + repoData.name + ' </a><br>' + 'description : ' + repoData.description + '<br>' + 'forks : ' + repoData.forks + '<br>' + 'updated :  ' + repoData.updatedAt;
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
        })
        .catch(err => {
            root.innerHTML = err.message;
            alert("err.message");
        });
}