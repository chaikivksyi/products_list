let products = [];
let filteredProducts = [];
const countCardsForPage = 10;
let currentPage = 1;

const ref = {
    pages: document.querySelector('.pages'),
    cards: document.querySelector('.cards'),
    search: document.querySelector('#searchProducts'),
    filters: document.querySelector("#filters"),
    btnFilters: document.querySelector("#btn-filter"),
    showFilter: document.querySelector('.show-filter'),
    hideFilter: document.querySelector('.hide-filter'),
    notFound: document.querySelector('.products-not-found')
}

fetch('products.json')
    .then(res => res.json())
    .then(data => {
        console.log(data.products[0])
        products = data.products
        filteredProducts = data.products
        renderCards()
    })

ref.search.addEventListener('input', function (e) {
    currentPage = 1
    filterProducts()
});

ref.showFilter.addEventListener('click', () => {
    ref.filters.classList.add('show');
})

ref.hideFilter.addEventListener('click', () => {
    ref.filters.classList.remove('show');
})

ref.btnFilters.addEventListener('click', () => {
    currentPage = 1;
    filterProducts();
    ref.filters.classList.remove('show');
})

function renderCards() {
    let out = '';

    printPages(Math.ceil(filteredProducts.length / countCardsForPage))
    filteredProducts
        .slice((currentPage - 1) * countCardsForPage, currentPage * countCardsForPage)
        .forEach((card) => {
            out += `
                <div class="card">
                    <a href="#"><img src="${card.image.src}" alt="${card.title}" loading="lazy"></a>
                    <a href="#"><span>${card.title}</span></a>
                    <span class="price">${card.variants[0].price}</span>
                    <button>Add to cart</button>
                </div>
            `
        })

    if(out !== '') {
        ref.notFound.classList.remove('show');
        ref.cards.innerHTML = out;
    }else {
        ref.notFound.classList.add('show');
        ref.cards.innerHTML = '';
    }
}

function printPages(countPages) {
    ref.pages.innerHTML = ''
    let out = [];

    for(let i = 0; i < countPages; i++) {
        const el = document.createElement('div');
        el.textContent = (i + 1).toString();
        el.classList.add('page');

        if(currentPage === i + 1) el.classList.add('active');

        el.addEventListener('click', () => {
            currentPage = i + 1;
            filterProducts();
        })

        out.push(el)
    }

    ref.pages.append(...out);
}

function filterProducts() {
    const filters = ref.filters;
    const search = ref.search.value;
    const price = {
        from: document.querySelector('#price_from').value,
        to: document.querySelector('#price_to').value,
    }
    const colors = [...filters.querySelectorAll("[data-filter='color']:checked")].map((item) => item.value);
    const sizes = [...filters.querySelectorAll("[data-filter='size']:checked")].map((item) => item.value);
    const materials = [...filters.querySelectorAll("[data-filter='material']:checked")].map((item) => item.value);

    filteredProducts = products.filter(card =>
        (!search.length || card.title.toLowerCase().includes(search.toLowerCase())) &&
        (!price.from || price.from <= Number(card.variants[0].price)) &&
        (!price.to || price.to >= Number(card.variants[0].price)) &&
        (!colors.length || colors.includes(...card.variants[0].colors)) &&
        (!sizes.length || sizes.includes(card.variants[0].size)) &&
        (!materials.length || materials.includes(card.variants[0].material)))

    renderCards();
}