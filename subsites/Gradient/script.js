document.addEventListener('DOMContentLoaded', function() {
    initParticles();
});

function toggleMenu() {
    var menu = document.getElementById('animated-menu');
    menu.style.left = menu.style.left === '0px' ? '-100%' : '0px';
}


class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.1;
        if (this.size <= 0.2) this.reset(); // Reset particle when it shrinks
    }

    draw() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.classList.add('dynamic-canvas');
    document.getElementById('dynamic-background').appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 100;

    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle(canvas));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let particle of particlesArray) {
            particle.update();
            particle.draw();
        }
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Reset particles on resize
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle(canvas));
        }
    });
}
