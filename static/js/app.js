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
         var RegionsBarData = [
           
         ]

   });

   var $tbody = document.getElementById("top_dangerous_state");

   

d3.json("/deaths_ranking",function(error,response)
   {
 

   for (var i = 0; i < response.length; i++) {
     // Get get the current address object and its fields
     var object = response[i];
     // var fields = Object.keys(object);
     
     // Create a new row in the tbody, set the index to be i + startingIndex
     var $row = $tbody.insertRow(i);

     var columns = ["ranking", "state", "deaths"]

     columns.forEach(
       function (col) {
         var $cell = $row.insertCell();
         $cell.innerText = object[col];

       }
     )
   
 }
} )