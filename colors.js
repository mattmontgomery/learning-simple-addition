const brain = require('brain.js');
const readline = require('readline');
const args = require('args');

args
    .option('iterations', 'Number of iterations', 1000)
    .option('verbose', 'Output extra data');
const flags = args.parse(process.argv)
const iterations = flags.iterations;
const verbose = flags.verbose;

const network = new brain.NeuralNetwork({
    // activation: 'relu',
    // hiddenLayers: [3, 3, 3]
});

console.log(`Beginning data generation`);
console.time(`Generating data...`);
const trainingData = generateTrainingData(iterations);
console.timeEnd(`Generating data...`);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(`Training data...`);
network.train(trainingData, {
    // learningRate: 0.5,
    log: verbose,
    // iterations: 200000
});
console.log(`Training data done...`);

console.log(`Running with ${trainingData.length} training sets`);
console.log(network.test(generateTrainingData(iterations)))

function generateTrainingData(rows = 5000) {
    const data = [];
    for (let i = 0; i < rows; i++) {
        const set = generateRandomNumberSet();
        const output = {
            red: set[0] > set[1] && set[0] > set[2],
            green: set[1] > set[0] && set[1] > set[2],
            blue: set[2] > set[0] && set[2] > set[1]
        };
        data.push({
            input: set,
            output
        })
    }
    return data;
}

function generateRandomNumberSet(length = 3) {
    const set = [];
    for (let i = 0; i < length; i++) {
        set.push(Math.random());
    }
    return set;
}


function ask() {
    rl.question('Input three numbers (r,g,b)', a => {
        const result = network.run(a.split(/[,\s]/i));
        if (result.mix > 0.5) {
            console.log('mostly a mix');
        } else if (result.red > 0.5) {
            console.log("mostly red");
        } else if (result.green > 0.5) {
            console.log("mostly green");
        } else if (result.blue > 0.5) {
            console.log("mostly blue");
        }
        console.log(result);
        if (a === '') {
            rl.close();
        } else {
            ask();
        }
    })
}

ask();
