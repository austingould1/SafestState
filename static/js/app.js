var url = "deaths_per_population";

 Plotly.d3.json(url, function(error, response) {
    // States Bar Plot
       var statesBarData = [
           {
             x: response.map(data =>data.state),
             y: response.map(data=>data.deaths),
             type: 'bar',
             marker:{color:'rgba(204,204,204,1)'}
           }
         ];
         Plotly.newPlot('plot', statesBarData);
    // pie chart
var url = "fancy_pie_chart";

         Plotly.d3.json(url, function(error, response) {
           console.log(response);
   
         var data = [{
           values: response.map(data =>data.percentages),
           labels: response.map(data=>data.state),
           type: 'pie'
         }];   
   
         
           var layout = {
           height: 700,
           width: 700
         };
         
         Plotly.newPlot('piechart', data, layout);
         });

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
         
           title:''
         };

         
         var scatterTrace = [scatterTrace1];
         
         
         Plotly.newPlot('scatter',scatterTrace,layout);
     
     

   });



  