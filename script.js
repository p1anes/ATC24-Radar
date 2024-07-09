const radar = document.getElementById('radar');
const mapContainer = document.getElementById('map-container');
let scale = 1;
let translateX = 0;
let translateY = 0;
let isPanning = false;
let startX, startY;
let isDragging = false;
let line, headingText;

// Zoom and Pan Functionality
radar.addEventListener('wheel', (e) => {
    e.preventDefault();
    scale += e.deltaY * -0.01;
    scale = Math.min(Math.max(.125, scale), 4);
    mapContainer.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
});

radar.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // Left click for panning
        isPanning = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
    } else if (e.button === 2) { // Right click for dragging
        e.preventDefault();
        removeExistingLineAndHeading();

        const rect = radar.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        isDragging = true;

        line = document.createElement('div');
        line.classList.add('line');
        line.style.left = `${startX}px`;
        line.style.top = `${startY}px`;
        radar.appendChild(line);
    }
});

radar.addEventListener('mousemove', (e) => {
    if (isPanning) {
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        mapContainer.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    }

    if (isDragging) {
        const rect = radar.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        if (angle < 0) {
            angle += 360; // Convert angle to positive if it's negative
        }

        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;

        displayHeadingText(angle, (startX + currentX) / 2, (startY + currentY) / 2);
    }
});

radar.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
    }
    if (isPanning) {
        isPanning = false;
    }
});

radar.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        removeExistingLineAndHeading();
    }
    if (isPanning) {
        isPanning = false;
    }
});

// Prevent default context menu on right click
radar.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

function removeExistingLineAndHeading() {
    if (line) {
        radar.removeChild(line);
        line = null;
    }
    if (headingText) {
        radar.removeChild(headingText);
        headingText = null;
    }
}

// Function to pad number to XXX format
function padNumber(number) {
    return number.toString().padStart(3, '0');
}

// Function to dynamically display heading text during drag
function displayHeadingText(angle, midX, midY) {
    if (headingText) {
        radar.removeChild(headingText);
    }

    headingText = document.createElement('div');
    headingText.classList.add('heading');

    let displayedAngle;
    if (angle >= 0 && angle < 90) {
        displayedAngle = 90 - angle;
    } else if (angle >= 90 && angle < 180) {
        displayedAngle = 450 - angle; // 360 + 90 - angle
    } else if (angle >= 180 && angle < 270) {
        displayedAngle = 270 - (angle - 180);
    } else if (angle >= 270 && angle < 360) {
        displayedAngle = 90 - (angle - 270);
    } else if (angle === 360) {
        displayedAngle = 0; // Special case for 360 degrees
    }

    headingText.textContent = `${padNumber(Math.round(displayedAngle))}°`;
    headingText.style.left = `${midX}px`;
    headingText.style.top = `${midY}px`;
    radar.appendChild(headingText);
}
