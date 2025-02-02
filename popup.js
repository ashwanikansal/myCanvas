// Check if canvas is already injected
if (!document.getElementById("drawingCanvas")) {
    // Create canvas
    let canvas = document.createElement("canvas");
    canvas.id = "drawingCanvas";
    document.body.appendChild(canvas);

    // Create floating toolbar
    let toolbar = document.createElement("div");
    toolbar.id = "drawingToolbar";
    toolbar.innerHTML = `
        <input type="color" id="colorPicker" value="#000000">
        <input type="range" id="brushSize" min="1" max="20" value="5">
        <button id="clearCanvas">Clear</button>
        <button id="undo">Undo</button>
        <button id="redo">Redo</button>
        <button id="exit">✖</button>
    `;
    document.body.appendChild(toolbar);

    // Setup canvas
    let ctx = canvas.getContext("2d");
    let drawing = false;
    let paths = [];
    let redoStack = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Drawing events
    canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
        paths.push([{ x: e.clientX, y: e.clientY, color: ctx.strokeStyle, size: ctx.lineWidth }]);
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!drawing) return;
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        paths[paths.length - 1].push({ x: e.clientX, y: e.clientY, color: ctx.strokeStyle, size: ctx.lineWidth });
    });

    canvas.addEventListener("mouseup", () => {
        drawing = false;
        ctx.closePath();
    });

    // Brush controls
    document.getElementById("colorPicker").addEventListener("input", (e) => {
        ctx.strokeStyle = e.target.value;
    });

    document.getElementById("brushSize").addEventListener("input", (e) => {
        ctx.lineWidth = e.target.value;
    });

    // Undo
    document.getElementById("undo").addEventListener("click", () => {
        if (paths.length > 0) {
            redoStack.push(paths.pop());
            redrawCanvas();
        }
    });

    // Redo
    document.getElementById("redo").addEventListener("click", () => {
        if (redoStack.length > 0) {
            paths.push(redoStack.pop());
            redrawCanvas();
        }
    });

    // Clear
    document.getElementById("clearCanvas").addEventListener("click", () => {
        paths = [];
        redrawCanvas();
    });

    // Exit
    document.getElementById("exit").addEventListener("click", () => {
        canvas.remove();
        toolbar.remove();
    });

    // Redraw canvas
    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paths.forEach(path => {
            ctx.beginPath();
            ctx.strokeStyle = path[0].color;
            ctx.lineWidth = path[0].size;
            ctx.moveTo(path[0].x, path[0].y);
            path.forEach(point => {
                ctx.strokeStyle = point.color;
                ctx.lineWidth = point.size;
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            });
            ctx.closePath();
        });
    }
}
