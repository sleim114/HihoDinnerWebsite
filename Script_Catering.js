document.addEventListener('DOMContentLoaded', function () {
    // Hamburger toggle code (placed at the top-level)
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            console.log("Hamburger clicked");
            const nav = document.querySelector('nav');
            nav.classList.toggle('active');
            console.log("Nav active status:", nav.classList.contains('active'));
        });
    } else {
        console.error("nav-toggle element not found");
    }

    // Fetch CSV and process menu data
    fetch('/Menu/Catering.csv')
        .then(response => response.text())
        .then(csvData => {
            Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true,
                complete: function (result) {
                    const menuContent = document.getElementById('menu-content');
                    const dropdownMenu = document.getElementById('dropdown-menu');
                    const dropdownHeader = document.getElementById('dropdown-header');
                    const selectedCategorySpan = document.getElementById('selected-category');

                    let categories = new Set();
                    let menuItems = {};

                    result.data.forEach(item => {
                        const { Category, Name, Description, Price, Options, Image } = item;
                        categories.add(Category);

                        if (!menuItems[Category]) {
                            menuItems[Category] = [];
                        }

                        let imageHTML = "";
                        if (Image && Image.trim() !== "") {
                            imageHTML = `<img src="${Image}" alt="${Name} image" class="menu-item-image">`;
                        }

                        let priceHTML = "";
                        if (Options && Options.trim() !== "") {
                            const optionsArray = Options.split(/\s*\|\s*/).map(option => option.trim());
                            if (optionsArray.length === 1) {
                                priceHTML = `<div class="single-price">${removeDollarSignAndFormat(optionsArray[0])}</div>`;
                            } else {
                                priceHTML = `<ul class="options-list">`;
                                optionsArray.forEach(option => {
                                    priceHTML += `<li>${removeDollarSignAndFormat(option)}</li>`;
                                });
                                priceHTML += `</ul>`;
                            }
                        } else if (Price && Price.trim() !== "") {
                            let priceFloat = parseFloat(Price);
                            let formattedPrice = (priceFloat % 1 === 0) ? priceFloat.toString() : priceFloat.toFixed(2);
                            priceHTML = `<div class="single-price">${formattedPrice}</div>`;
                        }

                        menuItems[Category].push(`
                            <div class="menu-item">
                                <div class="menu-text">
                                    <div class="name">${Name}
                                        <div class="description">${Description}</div>
                                    </div>
                                    <div class="price">
                                        ${priceHTML}
                                    </div>
                                </div>
                                ${imageHTML}
                            </div>
                        `);
                    });

                    const sortedCategories = Array.from(categories).sort();
                    sortedCategories.forEach(category => {
                        const item = document.createElement('div');
                        item.textContent = category;
                        item.setAttribute('data-category', category);
                        item.classList.add('dropdown-item');
                        item.addEventListener('click', function (e) {
                            selectedCategorySpan.textContent = category;
                            dropdownMenu.style.display = 'none';
                            renderCategory(category);
                        });
                        dropdownMenu.appendChild(item);
                    });

                    function renderCategory(category) {
                        menuContent.innerHTML = menuItems[category].join('');
                    }

                    function getCategoryBasedOnTime() {
                        const currentHour = new Date().getHours();
                        if (currentHour < 12) return "Breakfast";
                        else if (currentHour < 18) return "Lunch";
                        else return "Dinner";
                    }

                    const defaultCategory = getCategoryBasedOnTime();
                    if (sortedCategories.includes(defaultCategory)) {
                        selectedCategorySpan.textContent = defaultCategory;
                        renderCategory(defaultCategory);
                    } else {
                        selectedCategorySpan.textContent = sortedCategories[0];
                        renderCategory(sortedCategories[0]);
                    }

                    dropdownHeader.addEventListener('click', function (e) {
                        e.stopPropagation();
                        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
                    });

                    document.addEventListener('click', function () {
                        dropdownMenu.style.display = 'none';
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error loading menu:', error);
            const menuContent = document.getElementById('menu-content');
            menuContent.innerHTML = '<p>Sorry, we couldn’t load the menu at this time.</p>';
        });
});

// Function to remove dollar signs and decimals from price values
function removeDollarSignAndFormat(priceText) {
    return priceText.replace(/\$?(\d+)(\.\d{2})?/g, "$1");
}
