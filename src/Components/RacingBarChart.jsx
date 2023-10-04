import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function RacingBarChart({ data }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);

    // กำหนดขนาดของกราฟ
    const width = 800;
    const height = 400;

    svg.attr('width', width).attr('height', height);

    // สร้างกราฟ Racing Bar Chart
    const bars = svg.selectAll('rect').data(data);

    bars
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (_, i) => i * 20) // ระยะห่างระหว่างแถว
      .attr('width', (d) => d.Population / 100000) // ปรับขนาดของแท่งกราฟ
      .attr('height', 15) // ความสูงของแท่งกราฟ
      .style('fill', 'blue'); // สีของแท่งกราฟ

    bars.exit().remove();

    // สร้างป้ายชื่อประเทศและประชากร
    const labels = svg.selectAll('text').data(data);

    labels
      .enter()
      .append('text')
      .text((d) => `${d['Country name']}: ${d.Population}`)
      .attr('x', 10)
      .attr('y', (_, i) => i * 20 + 12) // ระยะห่างระหว่างแถวและตำแหน่งของป้ายชื่อ
      .style('font-size', '12px')
      .style('fill', 'black');

    labels.exit().remove();
  }, [data]);

  return <svg ref={svgRef}></svg>;
}

export default RacingBarChart;
