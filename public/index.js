/* let's go! */
// response.map((repo) => {
//     sendReq(repo.languages_url, (response) => {
//         let langs = [];
//         const lang = Object.keys(response);
//         langs.push(lang);
//         console.log(langs);
//     });
// });

const $userName = document.getElementById('github-user-handle');
const $userProfileLink = document.getElementById('github-user-link');
const $avatar = document.getElementById('github-user-avatar');
const $repoNo = document.getElementById('github-user-repos');
const $repoLangs = document.getElementById('github-repos-languages');
const $repoStars = document.getElementById('github-repos-stars');
const $repoUrl = document.getElementById('github-repo-link');
const $repoName = document.getElementById('github-repo-name');
const $repoCreated = document.getElementById('github-repo-created');
const $issues = document.getElementById('github-repo-open-issues');
const $watched = document.getElementById('github-repo-watchers');
const $contributors = document.getElementById('github-repo-contributors');

const $input = document.getElementById('search');
const $form = document.querySelector('#form');
const $submitBtn = document.getElementById('submit');
const sendReq = (url, cb) => {
    const req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState === 4 && req.status === 200) {
            cb(JSON.parse(req.responseText));
        }
    };

    req.open('GET', url);

    req.setRequestHeader(
        'Authorization',
        `token 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`
    );

    req.send();
};

window.onload = () => {
    $input.value = `amjed-98`;
    $submitBtn.click();
};

$submitBtn.addEventListener('click', (e) => {
    const url = `https://api.github.com/users/${$input.value}`;
    const repoUrl = `https://api.github.com/users/${$input.value}/repos`;

    // req to get user profile
    sendReq(url, (response) => {
        $userName.innerText = response.name;
        $userProfileLink.href = response.html_url;
        $avatar.src = response.avatar_url;
        $repoNo.innerText = response.public_repos;
    });

    // req to get user repos
    sendReq(repoUrl, (response) => {
        $repoStars.innerText = response.reduce(function (a, b) {
            return a + b.stargazers_count;
        }, 0);

        $repoName.innerText = response[0].name;
        $repoUrl.href = response[0].html_url;
        $issues.innerText = response[0].open_issues;
        $repoCreated.innerText = response[0].created_at;
        $watched.innerText = response[0].watchers_count;

        // req to get user contributors
        const userName = response[0].owner.login;
        const contributorsUrl = `https://api.github.com/repos/${userName}/${response[0].name}/contributors`;
        sendReq(contributorsUrl, (response) => {
            $contributors.innerText = response[0].login;
        });

        let langsArr = [];

        for (let i = 0; i < response.length; i++) {
            // get langs
            sendReq(
                `https://api.github.com/repos/${userName}/${response[i].name}/languages`,
                (response) => {
                    const keys = Object.keys(response);
                    langsArr.push(...keys);
                }
            );
        }

        setTimeout(() => {
            const langs = [...new Set(langsArr)];
            langs.forEach((lang) => {
                const $langEl = document.createElement('span');
                $langEl.classList.add('lang');
                $langEl.append(lang);

                $repoLangs.append($langEl);
            });
        }, 100);
    });
});

// todo fix langs bug
