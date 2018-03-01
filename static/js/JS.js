var url = "fancy_pie_chart";

    Plotly.d3.json(url, function(error, response) {
        console.log(response);

    var data = [{
        values: response.map(data =>data.percentages),
        labels: response.map(data=>data.state),
        type: 'pie'
      }];   

      
      var layout = {
        height: 400,
        width: 500
      };
      
    Plotly.newPlot('piechart', data, layout);
    });

