function updateChart(chart, data) {
    const time = Number(data.time.value);
    const capital = Number(data.capital.value);
    const saving = Number(data.saving.value);
    const interest = Number(data.interest.value) / 100
    const years = Array.from({ length: time }, (_, index) => index + 1);

    const total = years.map(y => {
        let sum = capital;
        for (i = 0; i < y * 12; ++i) {
            sum *= (1 + interest / 12)
            sum += saving
        }
        const interest_multiplier = 1 + (interest / 100)
        return Math.round(sum);
    })

    const totalOnePercentFee = years.map(y => {
        let sum = capital;
        for (i = 0; i < y * 12; ++i) {
            sum *= (1 + (interest-0.01) / 12)
            sum += saving
        }
        const interest_multiplier = 1 + (interest / 100)
        return Math.round(sum);
    })

    const noInteresTotal = years.map(y => {
        return Math.round(capital + y * 12 * saving);
    })


    if (chart) {
        chart.destroy();
    }

    document.getElementById("capital-bubble").innerHTML = Math.round(noInteresTotal.slice(-1)).toLocaleString()+ "€";
    document.getElementById("interest-bubble").innerHTML = Math.round(total.slice(-1) - noInteresTotal.slice(-1)).toLocaleString() + "€";
    document.getElementById("result-bubble").innerHTML = Math.round(total.slice(-1)).toLocaleString() + "€";

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [

                {
                    label: "Kokonaissijoitus ilman korkoa",
                    data: noInteresTotal,
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: "rgb(31, 96, 133)"
                },
                {
                    label: "Kokonaissijoitus koron kanssa 1% kokonaiskuluilla",
                    data: totalOnePercentFee,
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: "rgb(93, 71, 179)"
                },
                {
                    label: 'Kokonaissijoitus koron kanssa',
                    data: total,
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: "rgb(65, 240, 158)"
                },]
        },
        options: {
            interaction: {
                intersect: false,
                mode: 'index',
                },
            scales: {
                
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: "Vuosi"
                    }
                    
                },
                y: {
                   ticks: {
                    callback: value => `${value} €`
                   },
                    title: {
                        display: true,
                        text: "Kokonaissumma"
                    }
                }
            }
        }
    });

    return chart
}

const ctx = document.getElementById('result-chart');

let capital = document.getElementById("capital");
capital.value = "1000"

let saving = document.getElementById("saving");
saving.value = "100"
let interest = document.getElementById("interest");
interest.value = "5"
let time = document.getElementById("investment-time");
time.value = "10"

const data = {
    capital,
    saving,
    interest,
    time
}

Object.values(data).map(element => {
    element.addEventListener("change", function () {
        chart = updateChart(chart, data);
    })
})

let chart = updateChart(null, data);