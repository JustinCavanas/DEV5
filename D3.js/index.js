
let margin = {top: 30, right: 30, bottom: 150, left: 30},
            width = 1720 - margin.right - margin.left, 
            height = 500 - margin.top - margin.bottom; //this leaves us with the center portion

     let svg = d3.select('#viz') //select with id #viz
     .append('svg')
     .attr('width', width + margin.right + margin.left) //specify width and give it a value
     .attr('height', height + margin.top + margin.bottom)  //specify height and give it a value
     .append('g')
     .attr('transform', `translate(${margin.left}, ${margin.top})`); // to center the viz 


     // let x, let y and .range .padding aren't dependent on the data to be loaded. So pulled them out.

     let x = d3.scaleBand() //scaleBands are specifically created for bar charts 
        .range([0, width])
        .padding(0.1); // To give space between each bar

     let y = d3.scaleLinear()
        .range([height, 0]); // svg are drawn in the opposite way so height,0 instead of 0, height


        // fetching the data 
     d3.csv('HappinessTop50.csv', (d) => {

        d.Overallrank = +d.Overallrank; // convert string to numeric values
        d.Score = +d.Score; // convert string to numeric values
        return d; 

     }).then((results) => { //results = entire formatted dataset -> we are waiting for data to load before processing code 
        
        let maxVal = d3.max(results, d => d.Score); // find the max value in row 

        
           x.domain(results.map(d => d.CountryORregion)); //domain = complete set of values, domain for scaleband = categorical data 
                                                          //results.map = mapping the data in an array
           y.domain([0, maxVal])
            //.nice(); // nice function which rounds up last value.
          
            
        svg.append('g') // appending group which is goind to hold all our access
            .call(d3.axisLeft(y)); // calling function y axis left side 

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text') //select all text items 
            .attr('x', x.bandwidth()/1.5) // bandwith is the calculated width of bar.
            .attr('y', 0)
            .attr('dy', '.35em') //dy = offset
            .attr('transform', 'rotate(90)') //make text vertical
            .attr('text-anchor', 'start');

            createBars(results);
            

            let scoreSlider = document.getElementById('score-range');
                
                scoreSlider.min = 0;
                scoreSlider.max = maxVal;

                scoreSlider.onchange = () => {
                    let filteredData = results.filter(d => d.Score >= scoreSlider.value);
                    createBars(filteredData);
                }

                

     }).catch((error) => { // To catch any error

         throw error;
     });

     function createBars(results){
         svg.selectAll('.bar-group') // select all bar-group classes
            .data(results, d => d.CountryORregion) // we open up the data and get the results
            .join(
                 enter => {                         //enter figures out how many values in the results
                     let bar = enter.append('g') // We are appending a group for each value 
                        .attr('class', 'bar-group') // every group gets a class of bar-group, we are not creating the bars here but the group that the bars are going to sit in. 
                        .style('opacity', 1);  

                    bar.append('rect') //append one rectangle per group
                        .attr('class', 'bar')
                        .attr('x', d => x(d.CountryORregion)) //give each bar an x postion that aligns it with it Country, d => loop through the rows in data
                        .attr('y', d => y(0))           
                        .attr('width', x.bandwidth()) //bandwidth gonna calculate width of each bar
                        .attr('height', 0)
                        .style('fill', 'goldenrod')
                        .transition()
                        .duration(750)
                        .attr('y', d => y(d.Score))
                        .attr('height', d => height - y(d.Score)) // get the height of each bar 
                        
                        

                    bar.append('text')
                        .text(d => d.Score)
                        .attr('x', d => x(d.CountryORregion) + (x.bandwidth()/2))
                        .attr('y', d => y(d.Score) -5)
                        .attr('text-anchor', 'middle')
                        .style('font-family', 'sans-serif')
                        .style('font-size', 10)
                        .style('opacity', 0)
                        .transition()
                        .duration(500)
                        .style('opacity', 1);
                        },
                        update => {
                            update.transition()
                                .duration(750)
                                .style('opacity',1)
                        },
                        exit => {
                            exit.transition()
                                .duration(750)
                                .style('opacity', 0.15);
                        }

                    
                            
             )
    }

    