const radar = document.getElementById('radar');
let isDragging = false;
let startX, startY, line, headingText;

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

// Prevent default drag behavior on the radar element
radar.addEventListener('dragstart', (e) => {
    e.preventDefault(); // Prevent default drag behavior
});

radar.addEventListener('mousedown', (e) => {
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
});

radar.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

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

    // Display heading text dynamically during drag
    displayHeadingText(angle, (startX + currentX) / 2, (startY + currentY) / 2);
});

radar.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
    }
});

radar.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        removeExistingLineAndHeading();
    }
});

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

    // Calculate the correct heading based on the mouse movement
    let displayedAngle;
    if (angle >= 0 && angle < 90) {
        displayedAngle = 90 - angle;
    } else if (angle >= 90 && angle < 180) {
        displayedAngle = 450 - angle; // 360 + 90 - angle
    } else if (angle >= 180 && angle < 270) {
        displayedAngle = 270 - (angle - 180);
    } else if (angle >= 270 && angle < 360) {
        displayedAngle = 90 - (angle - 270);
    } else if (angle === 360 || angle === 0) {
        displayedAngle = 0; // Special case for 360 or 0 degrees
    }

    headingText.textContent = `${padNumber(Math.round(displayedAngle))}°`;
    headingText.style.left = `${midX}px`;
    headingText.style.top = `${midY}px`;
    radar.appendChild(headingText);
}