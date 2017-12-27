const brain = require('brain');
const meanBy = require('lodash/meanBy');

const iterations = 10000;
const verbose = false;

const network = new brain.NeuralNetwork();

const trainingData = generateTrainingData(iterations);
// xor example
network.train(trainingData, {
    iterations
});

runSamples(500000);

function learnedSuccess({ win, loss }) {
    return win > loss;
}

function generateTrainingData(rows = 5000) {
    const data = [];
    for (let i = 0; i < rows; i++) {
        const set = generateRandomNumberSet();
        data.push({
            input: set,
            output: {
                win: getResult(set, 1, 0),
                loss: getResult(set, 0, 1),
            }
        })
    }
    return data;
}

function generateRandomNumberSet(length = 6) {
    const set = [];
    for (let i = 0; i < length; i++) {
        set.push(Math.round(Math.random()));
    }
    return set;
}

function getResult(set = [], successValue, failValue) {
    return success(set) ? successValue : failValue;
}

function success(set) {
    return set[0] === 1; // win if first switch is on
    // return set.reduce((a, i) => a + i) > (set.length / 2); // win if more than half are 1
}

function runSamples(iterations = 1000) {
    console.log(`Running with ${trainingData.length} training sets; ${iterations} samples`);
    // let failures = 0;
    // let runs = [];
    // for (let i = 0; i < iterations; i++) {
    //     const set = generateRandomNumberSet();
    //     const run = network.run(set);
    //     const success = learnedSuccess(run);
    //     runs.push(run);
    //     if (success !== getResult(set, true, false)) {
    //         if (verbose) {
    //             console.log(`Set: ${set.join(',')}`);
    //         }
    //         failures++;
    //     }
    // }
    // console.log(`Failures: ${failures} / ${iterations}; WIN: ${meanBy(runs, r => r.win)}, LOSE: ${meanBy(runs, r => r.loss)}`);
    console.log(network.test(generateTrainingData(iterations)))
}
