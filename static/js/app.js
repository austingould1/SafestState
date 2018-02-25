
var url = "speeding_data";

    Plotly.d3.json(url, function(error, response) {
        console.log(response);

        var data = [
            {
              x: response.map(data =>data.state),
              y: response.map(data=>data.speeding),
              type: 'bar'
            }
          ];
          
          Plotly.newPlot('plot', data);
       
    });


