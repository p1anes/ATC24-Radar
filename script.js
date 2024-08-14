document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('info-modal');
    const closeModalButton = document.getElementById('close-modal');

    modal.style.display = 'flex';

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

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

    radar.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    radar.addEventListener('mousedown', (e) => {
        if (e.button === 0 || e.button === 2) {
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

        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;

        if (e.buttons === 1) {
            const displayedAngle = (angle + 90) % 360;
            displayHeadingText(`${padNumber(Math.round(displayedAngle))}°`, (startX + currentX) / 2, (startY + currentY) / 2);
        } else if (e.buttons === 2) {
            const distanceInNauticalMiles = (length / 39.92) * 0.6447084;
            displayHeadingText(`${distanceInNauticalMiles.toFixed(2)} NM`, (startX + currentX) / 2, (startY + currentY) / 2);
        }
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

    function displayHeadingText(text, midX, midY) {
        if (headingText) {
            radar.removeChild(headingText);
        }

        headingText = document.createElement('div');
        headingText.classList.add('heading');
        headingText.textContent = text;
        headingText.style.left = `${midX}px`;
        headingText.style.top = `${midY}px`;
        radar.appendChild(headingText);
    }
});