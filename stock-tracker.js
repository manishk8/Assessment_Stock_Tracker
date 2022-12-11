function getStockDetail() {
  const symbolInput = document.getElementById("symbol");
  const symbol = symbolInput.value; // input value for ticker symbol

  const errPara = document.getElementById("error-text");
  errPara.style.padding = "20px";

  if (symbol?.length) {
    
    const API_KEY = "2G6G5QXJSDZSD790";
    const url =
      "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" +
      symbol +
      "&outputsize=compact&apikey=" +
      API_KEY;

    let filterData = [];
    let result = fetch(url); // api call
    result
      .then((res) => res.json())
      .then((json) => {
        if (json["Time Series (Daily)"] !== undefined) {
          errPara.style.color = "#848484";
          errPara.innerHTML = `Stock price over time for ticker symbol: <b>${symbol}</b>`;

          filterData = Object.entries(json["Time Series (Daily)"]);
          var xValues = Object.keys(json["Time Series (Daily)"]);
          var yValues = Object.values(json["Time Series (Daily)"]);

          // line graph for stock price over time by using chart
          new Chart("graph-box", {
            type: "line",
            data: {
              labels: xValues,
              datasets: [
                {
                  fill: false,
                  lineTension: 0,
                  backgroundColor: "rgba(255,165,0,1.0)",
                  borderColor: "rgba(255,165,0,1.0)",
                  data: yValues.map((v) => v["4. close"]),
                },
              ],
            },
            options: {
              legend: { display: false },
              tooltips: {
                callbacks: {
                  title: function (val) {
                    return val[0].label;
                  },
                  label: function (val) {
                    const hhh = filterData.find((v) => v[0] === val.label);
                    const open = filterData.find((v) => v[0] === val.label)[1][
                      "1. open"
                    ];
                    const close = filterData.find((v) => v[0] === val.label)[1][
                      "4. close"
                    ];
                    const high = filterData.find((v) => v[0] === val.label)[1][
                      "2. high"
                    ];
                    const low = filterData.find((v) => v[0] === val.label)[1][
                      "3. low"
                    ];
                    // customized tooltip on hover for display stock details, including open, close, high, and low
                    return ` open : ${open}, close: ${close}, high: ${high}, low: ${low}`;
                  },
                },
              },
            },
          });
        } else {
          // result is not found
          errPara.style.color = "#ff0000";
          errPara.innerHTML = `Data is not found for <b>${symbol}</b> ticker sybol`;
        }
      });
  } else {
    alert("please enter ticker symbol to get stock price");
  }
  symbolInput.value = ""; // reset input value
}
