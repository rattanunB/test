import { useState, useEffect } from 'react';
import axios from 'axios';
import ChartRace from 'react-chart-race';
import "./App.scss";

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function App() {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(1950);
  const [totalPopulation, setTotalPopulation] = useState(null);
  const [colorTable, setColorTable] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // เริ่มโหลดข้อมูล
      try {
        const response = await axios.get('https://api.sheety.co/04e872e1cb07bee38173db22e52c5fb3/population/populationAndDemography');
        const rawData = response.data.populationAndDemography;
        
        const groupedData = {};
        const newColorTable = { ...colorTable }; // สร้างตารางสีใหม่
        
        rawData.forEach((item) => {
          const year = item.year;
          if (!groupedData[year]) {
            groupedData[year] = [];
          }
          if (!newColorTable[item.countryName]) {
            newColorTable[item.countryName] = getRandomColor();
          }
          groupedData[year].push({
            id: item.countryName,
            value: parseFloat(item.population),
            date: year,
            name: item.countryName,
            color: newColorTable[item.countryName],
            label: `${item.countryName} (${item.population})`,
          });
        });
  
        setData(groupedData);
        setColorTable(newColorTable); // บันทึกตารางสีใหม่
        setSelectedYear(Object.keys(groupedData)[0]);
        setIsLoading(false); // โหลดเสร็จสิ้น
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเรียก API:', error);
        setIsLoading(false); // เมื่อโหลดข้อมูลไม่สำเร็จ
      }
    };
  
    fetchData();
  }, []);
  
  

  useEffect(() => {
    if (selectedYear && data[selectedYear]) {
      const populationSum = data[selectedYear].reduce((sum, item) => sum + item.value, 0);
      setTotalPopulation(populationSum);
    }
  }, [selectedYear, data]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="App">
      <div className='title'>
        <h1>Population growth per country, 1950 to 2021</h1>
        <h2>Click on the legend below to filter by continent</h2>
      </div>
  
      {isLoading ? (
        <div className='loading'>Loading...</div>
      ) : (
        <>
          <div className='selectWarp'>      
            <select onChange={handleYearChange} value={selectedYear}>
              {Object.keys(data).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div> 
  
          <div className='chartContainer'>   
            <ChartRace
              data={data[selectedYear]}
              field="value"
              dateField="date"
              nameField="name"
              padding={20}
              width={800}
              height={600}
              labelField="label"
              colorField="color"
            />
            <div className='yearBox'>
              <span>{selectedYear}</span>
              <span>Total: {totalPopulation}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
  
  
}

export default App;
