import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHtml(results) {
    return results.map(result => {
        return `<a href="/restaurant/${result.slug}" class="search__result">
        <span>${result.name}</span></a>`
    }).join('');
};

function typeAhead(search) {
    if(!search) return;
    const searchInput = search.querySelector('input[name="search"]');
    const searchResults = search.querySelector('.search__results');

    searchInput.on('input', function() {
        if(!this.value) {
            searchResults.style.display = 'none';
            return;
        }

    searchResults.style.display = 'block';

    axios.get(`/api/search?q=${this.value}`)
        .then(res => {
            if(res.data.length) {
                searchResults.innerHTML = dompurify.sanitize(searchResultsHtml(res.data));
                return;
            }
            searchResults.style.display = dompurify.sanitize(`<div class='search__result'>No results found for ${this.value}</div>`);
        })
        // TODO: add sentry
        .catch(err => {
            throw Error(err)
        });
    });

    searchInput.on('keyup', (e) => {
        if(![13, 38, 40].includes(e.keyCode)) return;
        const activeClass = 'search__result--active';
        const current = search.querySelector(`.${activeClass}`);
        const items = search.querySelectorAll('.search__result');
        let next;
        // handle nav tab list
        if((e.keyCode === 40 || e.keyCode === 9) && current) {
            next = current.nextElementSibling || items[0];
        } else if (e.keyCode === 40) {
            next = items[0];
        } else if (e.keyCode === 38 && current) {
            next = current.previousElementSibling || items[items.length -1];
        } else if (e.keyCode === 38) {
            next = items[items.length -1];
        } else if (e.keyCode === 13 && current.href) {
            window.location = current.href;
            return;
        }
        if(current) {
            current.classList.remove(activeClass)
        }
        next.classList.add(activeClass);
    });
};

export default typeAhead;