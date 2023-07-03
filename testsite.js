const ctx = document.getElementById('myChart');
const kPSlider = document.getElementById('kP-slide');
const kPCheck = document.getElementById('kP-check');
const kISlider = document.getElementById('kI-slide');
const kICheck = document.getElementById('kI-check');
const kDSlider = document.getElementById('kD-slide');
const kDCheck = document.getElementById('kD-check');

const biasSlider = document.getElementById('bias-slide');
const biasCheck = document.getElementById('bias-check');

const instChecked = document.getElementById('inst-check');

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

let intervalSeconds = 0.016;
const intervalMillis = 1000 * intervalSeconds;
const fullTimeDT = 0.016;
const fullTimeEnd = 25;

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

let instID = 0;

let dateTime = Date.now();

myReset();
instChecked.checked = false;

    function simulateFullTime() {
        t = 0;
        let dt = fullTimeDT;

        myReset(false);
        for (t = 0; t < fullTimeEnd; t += dt) {
            step(dt);
        }
        cht.update('none');
    }

    function instToggle() {
        if (instChecked.checked) {
            myReset();
            instID = setInterval(simulateFullTime, 100);
            return;
        }

        //myReset();
        clearInterval(instID);
    }


    function addOne() {
        

        let newTime = Date.now();
        let dt = (newTime - dateTime) / 1000;
        dateTime = newTime;

        step(dt);
        cht.update('none');

        if (t >= 100) {
            stop();
        }
    }

    function step(dt) {
        cht.data.datasets[0].data.push({x: t, y: err});
        systemUpdate(dt);
        t += dt;
    }

    function stop() {
        clearInterval(addId);
    }

    function myReset(update=true) {
        stop();
        t = 0;
        err = -15;
        oldErr = err;
        accErr = 0;
        cht.data.datasets[0].data = [];
        if (update) {
            cht.update();
        }
        systemReset();
    }

    function start() {
        dateTime = Date.now();
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

function systemUpdate(dt) {
    err += vel;
    vel += -dt * computeCorrectiveSignal(dt);

    if (biasCheck.checked) {
        vel += biasSlider.value * maxBias / 100 * dt;
    }
    
}

function systemReset() {
    vel = 0;
}


function computeCorrectiveSignal(dt) {
    let der = (err - oldErr) / dt;
    oldErr = err;
    
    let signal = 0;
    if (kPCheck.checked) {
        signal += err * getKp();
    }
    if (kICheck.checked) {
        accErr += err * dt * getKi();
        signal += accErr;
    }
    if (kDCheck.checked) {
        signal += der * getKd();
    }
    return signal;
}