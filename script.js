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
    e.preventDefault();
});

radar.addEventListener('mousedown', (e) => {
    removeExistingLineAndHeading();

    const rect = radar.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDragging = true;

    line = document.createElement('div');
    line.className = 'line';
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    radar.appendChild(line);

    headingText = document.createElement('div');
    headingText.className = 'heading';
    radar.appendChild(headingText);
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
        angle += 360;
    }

    // Adjust the angle to get the correct heading
    angle = (90 - angle + 360) % 360;

    line.style.width = `${length}px`;
    line.style.transform = `translate(${0}px, ${0}px) rotate(${angle}deg)`;
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;

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

function padNumber(number) {
    return number.toString().padStart(3, '0');
}

function displayHeadingText(angle, midX, midY) {
    if (!headingText) {
        headingText = document.createElement('div');
        headingText.className = 'heading';
        radar.appendChild(headingText);
    }

    let displayAngle = (angle + 360) % 360; // Adjust for display

    headingText.textContent = `${padNumber(Math.round(displayAngle))}°`;
    headingText.style.left = `${midX}px`;
    headingText.style.top = `${midY}px`;
}