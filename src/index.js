import * as math from 'mathjs';
import Plotly from 'plotly.js-dist-min';
import _ from 'lodash';

document.addEventListener('DOMContentLoaded', function () {

    const parser = math.parser();

    const sourceFunctionInput = document.getElementById('function');
    const leftBoundInput = document.getElementById('function_left_bound');
    const rightBoundInput = document.getElementById('function_right_bound');
    const stepInput = document.getElementById('step');
    const functionSplit = document.getElementById('function_split');

    let sourceFunction = (x) => x;
    let leftBound = -5.;
    let rightBound = 5.;
    let step = 1;

    const interpolation = (x, y) => {

        if (x.length !== y.length) {
            throw new Error('Invalid x, y size.');
        }

        const n = x.length;

        const subpoly = (t, i) => {
            let multiply = 1.;

            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    multiply *= (t - x[j]) / (x[i] - x[j]);
                }
            }
            return multiply;
        }

        return (t) => {
            let summation = 0;
            for (let i = 0; i < n; i++) {
                summation += y[i] * subpoly(t, i);
            }
            return summation;
        }

    }

    const plot = () => {

        let x = _.range(leftBound, rightBound + 1, step);
        let y = x.map(value => sourceFunction(value));

        functionSplit.value = y;

        const interpolate = interpolation(x, y);

        let xpoly = _.range(leftBound, rightBound + 1, 0.1);
        let poly = xpoly.map(value => interpolate(value));

        Plotly.newPlot('chart', {
            data: [ { x: x, y: y }, { x: xpoly, y: poly } ],
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

    const onStepChange = () => {
        step = Number(stepInput.value);
    }

    sourceFunctionInput.addEventListener('input', onInputChange);
    leftBoundInput.addEventListener('input', onLeftBoundChange);
    rightBoundInput.addEventListener('input', onRightBoundChange);
    stepInput.addEventListener('input', onStepChange);

    sourceFunctionInput.addEventListener('blur', plot);
    leftBoundInput.addEventListener('blur', plot);
    rightBoundInput.addEventListener('blur', plot);
    stepInput.addEventListener('blur', plot);

    plot();
});

// accuracy