document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        const scrollPos = window.scrollY + window.innerHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;

            if (scrollPos >= sectionTop) {
                section.style.opacity = 1;
                section.style.transform = "translateX(0)";
            }
        });
    });
});

document.querySelector('.toggle-heading').addEventListener('click', function() {
    var boxContainer = document.querySelector('.box-container');
    if (boxContainer.style.display === 'none' || boxContainer.style.display === '') {
        boxContainer.style.display = 'block';
    } else {
        boxContainer.style.display = 'none';
    }
});