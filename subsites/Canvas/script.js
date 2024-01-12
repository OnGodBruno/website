document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let drawMode = true;

    // Resize canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('resize', resizeCanvas);

    document.getElementById('colorChange').addEventListener('click', changeColor);
    document.getElementById('drawMode').addEventListener('click', toggleDrawMode);
    document.getElementById('clearCanvas').addEventListener('click', clearCanvas);



    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }

    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!isDrawing || !drawMode) return;
        ctx.lineWidth = 5; // Change as needed
        ctx.lineCap = 'round'; // Smooth lines
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    }

    function changeColor() {
        ctx.strokeStyle = '#' + Math.floor(Math.random()*16777215).toString(16);
    }

    function toggleDrawMode() {
        drawMode = !drawMode;
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
