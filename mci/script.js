const preview = document.getElementById('preview');
const input = document.getElementById('inputtext');
const buttons = document.querySelectorAll('button');
const buttonPositions = {};
let lastButtonPosition = null;
let lastPressTime = null;
let keyWidth = null; // Assume a fixed width for simplicity

let counter = 1;
let maxCounter = 20;
let str = Math.round(Math.random()*9) + "*" + Math.round(Math.random(9)*9);
preview.value = "Task " + counter + "/" + maxCounter + ": " + str;

function calculate(expression) {
    try {
        return new Function('return ' + expression)();
    } catch (error) {
        return 'Malformed Operation';
    }
}

function operation(buttonValue, button) {
    if (buttonValue === '=' && str == '') {
        if (counter < maxCounter) {
            counter++;
            str = Math.round(Math.random()*9) + "*" + Math.round(Math.random(9)*9);
            preview.value = "Task " + counter + "/" + maxCounter + ": " + str;
            input.value = "";
        }
        else {
            preview.value = "Task Done!"
        }
    } else {
        if (str.startsWith(buttonValue)) {
            input.value += buttonValue;
            str = str.substring(1);
        }
    }
    
    // Calculate and log ID and MT
    if (lastButtonPosition) {
        const currentPosition = getButtonPosition(button);
        const D = calculateDistance(lastButtonPosition, currentPosition);
        const ID = Math.log2(2 * D / keyWidth);
        const MT = Date.now() - lastPressTime;
        console.log(`Key: ${buttonValue}, ID: ${ID.toFixed(2)}, MT: ${MT}ms`);
    }
    
    lastButtonPosition = getButtonPosition(button);
    lastPressTime = Date.now();
}

buttons.forEach(button => {
    let buttonValue = button.innerText;
    buttonPositions[buttonValue] = getButtonPosition(button);
    button.addEventListener('click', function () {
        operation(buttonValue, button);
    });
});

// Get the width of a key dynamically
window.onload = function() {
    if (buttons.length > 0) {
        keyWidth = buttons[0].getBoundingClientRect().width;
        console.log(`Key width: ${keyWidth}px`);
    }
};

function getButtonPosition(button) {
    const rect = button.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

function calculateDistance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
}
