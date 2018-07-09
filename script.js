document.addEventListener('DOMContentLoaded', () => {
  req = new XMLHttpRequest();
  req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json', true);
  req.send();
  req.onload = function() {
    json = JSON.parse(req.responseText);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const baseTemp = json.baseTemperature;
    const dataset = json.monthlyVariance.map((obj) => { return { year: obj.year, month: obj.month - 1, variance: obj.variance} });
    const w = 1500;
    const h = 600;
    const padding = 115;
    
    const xScale = d3.scaleLinear()
                     .domain([d3.min(dataset, (d) => d.year - 0.5), d3.max(dataset, (d) => d.year)])
                     .range([padding, w - padding]);
    
    const yScale = d3.scaleLinear()
                     .domain([d3.min(dataset, (d) => d.month - 0.5), d3.max(dataset, (d) => d.month + 0.5)])
                     .range([padding, h - padding]);
    
    const tooltip = d3.tip()
                      .attr('id', 'tooltip')
                      .offset([-5, 0])
                      .html((d, i) => {
                        tooltip.attr('data-year', d.year)
                        return d.year + ' - ' + months[d.month] + '<br>' + d3.format('.1f')(baseTemp + d.variance) + '&#176;C<br>' + d3.format('.1f')(d.variance) + '&#176;C';
                      });
    
    const svg = d3.select('body')
                  .append('svg')
                  .attr('width', w)
                  .attr('height', h)
                  .call(tooltip);
    
    d3.select('svg').append('text').text('Monthly Global Land-Surface Temperatures').attr('id', 'title').attr('x', 450).attr('y', 45);
    d3.select('svg').append('text').text('1753 to 2015: Base Temperature 8.66°C').attr('id', 'description').attr('x', 600).attr('y', 70);
    
    d3.select('svg').append('text').text('Months').attr('transform', 'translate(30, 325)rotate(-90)');
    d3.select('svg').append('text').text('Years').attr('transform', 'translate(735, 525)');
    
    svg.selectAll('rect')
       .data(dataset)
       .enter()
       .append('rect')
       .attr('x', (d, i) => xScale(d.year))
       .attr('data-year', (d, i) => d.year)
       .attr('y', (d, i) => yScale(d.month))
       .attr('data-month', (d, i) => d.month)
       .attr('data-temp', (d, i) => baseTemp + d.variance)
       .attr('width', 4.75)
       .attr('height', 30.833333)
       .attr('class', 'cell')
       .attr('transform', 'translate(-1.75, -15)')
       .style('fill', (d, i) => {
          let fillColor = '';
          let temp = baseTemp + d.variance;
          if(temp < 2.8) {
            fillColor = 'rgb(55, 53, 143)';
          } else if(temp < 3.9) {
            fillColor = 'rgb(89, 115, 175)';
          } else if(temp < 5.0) {
            fillColor = 'rgb(137, 171, 206)';
          } else if(temp < 6.1) {
            fillColor = 'rgb(186, 216, 232)';
          } else if(temp < 7.2) {
            fillColor = 'rgb(230, 242, 247)';
          } else if(temp < 8.3) {
            fillColor = 'rgb(254, 255, 198)';
          } else if(temp < 9.5) {
            fillColor = 'rgb(245, 226, 154)';
          } else if(temp < 10.6) {
            fillColor = 'rgb(233, 178, 108)';
          } else if(temp < 11.7) {
            fillColor = 'rgb(216, 117, 75)';
          } else if(temp < 12.8) {
            fillColor = 'rgb(186, 64, 46)';
          } else {
            fillColor = 'rgb(141, 29, 40)';
          }
          return fillColor;
       })
       .on('mouseover', tooltip.show)
       .on('mouseout', tooltip.hide);
    
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('.0f')).ticks(26).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).tickFormat((d) => months[d]).tickSizeOuter(0);
    
    svg.append('g').attr('id', 'x-axis').style('font-size', '16px').attr('transform', 'translate(0, ' + (h - padding) + ')').call(xAxis);
    svg.append('g').attr('id', 'y-axis').style('font-size', '16px').attr('transform', 'translate(' + padding + ', 0)').call(yAxis);
    
    const legendDataset = [1.7, 2.8, 3.9, 5, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];
    const colorArr = ['rgb(55, 53, 143)', 'rgb(89, 115, 175)', 'rgb(137, 171, 206)', 'rgb(186, 216, 232)', 'rgb(230, 242, 247)', 'rgb(254, 255, 198)', 'rgb(245, 226, 154)', 'rgb(233, 178, 108)', 'rgb(216, 117, 75)', 'rgb(186, 64, 46)', 'rgb(141, 29, 40)'];
    const legendAxis = d3.axisBottom(d3.scaleLinear().domain([1, 10]).range([160, 565])).tickFormat((d, i) => legendDataset[i+1]);
    svg.append('g')
       .attr('id', 'legend')
       .selectAll('rect')
       .data(legendDataset)
       .enter()
       .append('rect')
       .attr('x', (d, i) => 115 + i * 45)
       .attr('y', (d, i) => 530)
       .attr('width', 45)
       .attr('height', 30)
       .attr('class', 'legend-cell')
       .style('fill', (d, i) => colorArr[i]);
    svg.append('g')
       .attr('transform', 'translate(0, 560)')
       .style('font-size', '16px')
       .call(legendAxis);
  }
});