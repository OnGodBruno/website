
function plotRittsModel(ids, mts) {
    // Prepare data for regression calculation
    const dataPoints = ids.map((id, index) => [id, mts[index]]);
    
    // Calculate the regression line
    const regression = ss.linearRegression(dataPoints);
    const regressionLine = ss.linearRegressionLine(regression);

    // Generate points for the regression line (use more points for a smooth line)
    const minId = Math.min(...ids);
    const maxId = Math.max(...ids);
    const regressionPoints = [];
    for (let i = minId; i <= maxId; i += 0.1) {
        regressionPoints.push({
            x: i,
            y: regressionLine(i)
        });
    }

    // Create the data for Chart.js
    const data = {
        datasets: [
            {
                label: 'Ritts Model Data',
                data: ids.map((id, index) => ({ x: id, y: mts[index] })),
                backgroundColor: '#F7EDFF',
                borderColor: '#000',
                pointBackgroundColor: '#D3BBFF',
                pointBorderColor: '#000',
                pointHoverBackgroundColor: '#000',
                pointHoverBorderColor: '#D3BBFF',
                showLine: false
            },
            {
                label: 'Regression Line',
                data: regressionPoints,
                backgroundColor: '#895EDB',
                borderColor: '#D3BBFF',
                type: 'line',
                fill: false
            }
        ]
    };

    // Config for Chart.js
    const config = {
        type: 'scatter',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    type: 'linear'
                }
            }
        }
    };

    // Render the chart
    const ctx = document.getElementById('rittsModelChart').getContext('2d');
    new Chart(ctx, config);
}


const preview = document.getElementById('preview');
const input = document.getElementById('inputtext');
const buttons = document.querySelectorAll('button');
const buttonPositions = {};
let lastButtonPosition = null;
let lastPressTime = null;
let keyWidth = null; // Assume a fixed width for simplicity

let counter = 1;
let maxCounter = 20;
let str = Math.round(Math.random()*900)/100 + "*" + Math.round(Math.random()*900)/100;
preview.value = "Task " + counter + "/" + maxCounter + ": " + str;
let ids = [];
let mts = [];
let lastButton = '';

function calculate(expression) {
    try {
        return new Function('return ' + expression)();
    } catch (error) {
        return 'Malformed Operation';
    }
}

function operation(buttonValue, button) {
    let correct = false;
    if (buttonValue === '=' && str == '') {
        if (counter < maxCounter) {
            counter++;
            str = Math.round(Math.random()*900)/100 + "*" + Math.round(Math.random()*900)/100;
            preview.value = "Task " + counter + "/" + maxCounter + ": " + str;
            input.value = "";
            correct = true;
        }
        else {
            preview.value = "Task Done!"
            plotRittsModel(ids, mts);
        }
    } else {
        if (str.startsWith(buttonValue)) {
            input.value += buttonValue;
            str = str.substring(1);
            correct = true;
        }
    }
    if (correct && lastButton != buttonValue) {
        lastButton = buttonValue;
        // Calculate and log ID and MT
        if (lastButtonPosition) {
            const currentPosition = getButtonPosition(button);
            const D = calculateDistance(lastButtonPosition, currentPosition);
            const ID = Math.log2(2 * D / keyWidth);
            const MT = Date.now() - lastPressTime;
            console.log(`Key: ${buttonValue}, ID: ${ID.toFixed(2)}, MT: ${MT}ms`);
            ids.push(ID);
            mts.push(MT);
        }
        
        lastButtonPosition = getButtonPosition(button);
        lastPressTime = Date.now();
    }
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

