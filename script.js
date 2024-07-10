// made by p1anes running off hopes, dreams, and prayers

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

    headingText = document.createElement('div');
    headingText.classList.add('heading');
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
        angle += 360; // Convert angle to positive if it's negative
    }

    // Adjust the angle to match compass headings
    let adjustedAngle = (angle + 90) % 360;

    line.style.width = `${length}px`;
    line.style.transformOrigin = '0 0'; // Ensure the rotation origin is at the start of the line
    line.style.transform = `rotate(${angle}deg)`; // Use original angle for rotation

    // Display heading text dynamically during drag
    const midX = (startX + currentX) / 2;
    const midY = (startY + currentY) / 2;
    displayHeadingText(adjustedAngle, midX, midY);
});

radar.addEventListener('mouseup', (e) => {
    if (isDragging) {
        isDragging = false;

        const rect = radar.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        if (angle < 0) {
            angle += 360; // Convert angle to positive if it's negative
        }

        // Adjust the angle to match compass headings
        let adjustedAngle = (angle + 90) % 360;

        // Display heading text in XXX format
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        headingText.textContent = `${padNumber(Math.round(adjustedAngle))}°`; // Pad number to XXX format
        headingText.style.left = `${midX}px`;
        headingText.style.top = `${midY}px`;
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
function displayHeadingText(angle, x, y) {
    if (headingText) {
        headingText.style.left = `${x}px`;
        headingText.style.top = `${y}px`;

        // Ensure angle is positive and within 0 to 360 degrees
        angle = (angle + 360) % 360;

        headingText.textContent = `${padNumber(Math.round(angle))}°`; // Update heading text
    }
}
