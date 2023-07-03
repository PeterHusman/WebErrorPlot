const ctx = document.getElementById('myChart');
const kPSlider = document.getElementById('kP-slide');
const kPCheck = document.getElementById('kP-check');
const kISlider = document.getElementById('kI-slide');
const kICheck = document.getElementById('kI-check');
const kDSlider = document.getElementById('kD-slide');
const kDCheck = document.getElementById('kD-check');

const biasSlider = document.getElementById('bias-slide');
const biasCheck = document.getElementById('bias-check');


const cfg = {
  type: 'line',
  data: {
    datasets: [{
      data: [{x: 0, y: 0}]
    }]
  },
  options: {
    scales: {
        x: {
            type: 'linear',
                suggestedMin: 0,
                suggestedMax: 25
        },
        y: {
                suggestedMin: -20,
                suggestedMax: 20
        }
    }
  }
};


let cht = new Chart(ctx, cfg);

const intervalSeconds = 0.016;
const intervalMillis = 1000 * intervalSeconds;

const maxKP = 2;
const maxKI = 1;
const maxKD = 0.1;
const maxBias = 5;

const impulseStrength = 10;

let addId = 0;

let t = 0;

let err = -15;
let oldErr = err;
let accErr = 0;

let vel = 0;

myReset();


    function addOne() {
        cht.data.datasets[0].data.push({x: t, y: err});
        systemUpdate();
        t += intervalSeconds;
        cht.update('none');

        if (t >= 100) {
            stop();
        }
    }

    function stop() {
        clearInterval(addId);
    }

    function myReset() {
        stop();
        t = 0;
        err = -15;
        oldErr = err;
        accErr = 0;
        cht.data.datasets[0].data = [];
        cht.update();
        systemReset();
    }

    function start() {
        addId = setInterval(addOne, intervalMillis);
    }

function getKp() {
    return kPSlider.value * maxKP / 100;
}
function getKi() {
    return kISlider.value * maxKI / 100;
}
function getKd() {
    return kDSlider.value * maxKD / 100;
}

function applyImpulse() {
    err += impulseStrength;
}

function systemUpdate() {
    err += vel;
    vel += -intervalSeconds * computeCorrectiveSignal();

    if (biasCheck.checked) {
        vel += biasSlider.value * maxBias / 100 * intervalSeconds;
    }
    
}

function systemReset() {
    vel = 0;
}


function computeCorrectiveSignal() {
    let der = (err - oldErr) / intervalSeconds;
    oldErr = err;
    
    let signal = 0;
    if (kPCheck.checked) {
        signal += err * getKp();
    }
    if (kICheck.checked) {
        accErr += err * intervalSeconds * getKi();
        signal += accErr;
    }
    if (kDCheck.checked) {
        signal += der * getKd();
    }
    return signal;
}