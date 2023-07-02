const ctx = document.getElementById('myChart');
  

    const cfg = {
  type: 'line',
  data: {
    datasets: [{
      data: [{x: 0, y: 0}]
    }]
  },
  options: {
    scales: {
        xAxis: {
            type: 'linear'
        }
    }
  }
};


    let cht = new Chart(ctx, cfg);

    let addId = setInterval(addOne, 100);

    let i = 1;

    let err = -15;

    const millis = 100;
    const seconds = millis / 1000;

    function addOne() {
        cht.data.datasets[0].data.push({x: i, y: i});
        i++;
        cht.update();

        if (i >= 100) {
            clearInterval(addId);
        }
    }

    function myReset() {
        i = 0;
        clearInterval(addId);
        cht.data.datasets[0].data = [];
        cht.update();
        addId = setInterval(addOne, 100);
    }