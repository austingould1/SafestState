
var url = "deaths_per_population";

  Plotly.d3.json(url, function(error, response) {
     // States Bar Plot
        var statesBarData = [
            {
              x: response.map(data =>data.state),
              y: response.map(data=>data.deaths),
              type: 'bar'
            }
          ];
          Plotly.newPlot('plot', statesBarData);
      // Scatter Plot  
          var scatterTrace1 = {
            x: response.map(data => data.deaths),
            y: response.map(data => data.popoulation),
            mode: 'markers',
            type: 'scatter',
            text: response.map(data => data.state),
            marker: { size: 12 }
          };
          var layout = {
           
            title:'Death vs Population'
          };
          
          var scatterTrace = [scatterTrace1];
          
          
          Plotly.newPlot('populationscatter',scatterTrace,layout);
       
      // Regions Bar Plot


    });

    
    

   