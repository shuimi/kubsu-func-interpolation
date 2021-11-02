import * as math from 'mathjs';
import Plotly from 'plotly.js-dist-min';
import _ from 'lodash';

document.addEventListener('DOMContentLoaded', function () {

    const parser = math.parser();

    const sourceFunctionInput = document.getElementById('function');
    const leftBoundInput = document.getElementById('function_left_bound');
    const rightBoundInput = document.getElementById('function_right_bound');

    let sourceFunction = (x) => x;
    let leftBound = -10.;
    let rightBound = 10.;

    const plot = () => {

        let x = _.range(leftBound, rightBound + 1);
        let y = x.map(value => sourceFunction(value));

        Plotly.newPlot('chart', {
            data: [ { x: x, y: y } ],
            layout: {
                width: 600,
                height: 400
            }
        });
    }

    const onInputChange = () => {
        try {
            sourceFunction = parser.evaluate(sourceFunctionInput.value);
        } catch (e) {
        }
    }

    const onLeftBoundChange = () => {
        leftBound = Number(leftBoundInput.value);
    }

    const onRightBoundChange = () => {
        rightBound = Number(rightBoundInput.value);
    }

    sourceFunctionInput.addEventListener('input', onInputChange);
    leftBoundInput.addEventListener('input', onLeftBoundChange);
    rightBoundInput.addEventListener('input', onRightBoundChange);

    sourceFunctionInput.addEventListener('blur', plot);
    leftBoundInput.addEventListener('blur', plot);
    rightBoundInput.addEventListener('blur', plot);

});

// accuracy