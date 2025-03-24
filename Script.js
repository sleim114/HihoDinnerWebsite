document.addEventListener('DOMContentLoaded', function () {
    // Hamburger toggle code (placed at the top-level)
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            console.log("Hamburger clicked");
            const navUl = document.querySelector('nav ul');
            navUl.classList.toggle('show');  // Use 'show' if your CSS uses that
            console.log("Nav menu active:", navUl.classList.contains('show'));
        });
    } else {
        console.error("nav-toggle element not found");
    }
});