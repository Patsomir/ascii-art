const mouseState = {
    isDown: false,
};

document.addEventListener('mousedown', () => mouseState.isDown = true);
document.addEventListener('mouseup', () => mouseState.isDown = false);