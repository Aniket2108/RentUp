import React, { useEffect, useState } from "react"
import { api } from "../../data/Data"

const RecentCard = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/properties');
        setProperties(response.data.slice(0, 6)); // Show first 6 properties
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);
  
  return (
    <>
      <div className='content grid3 mtop'>
        {properties.map((property, index) => {
          const { propertyId, address, flatType, price, status, area } = property
          return (
            <div className='box shadow' key={propertyId}>
              <div className='img'>
                <img src={`../images/list/p-${(index % 5) + 1}.png`} alt='' /> {/* Placeholder image */}
              </div>
              <div className='text'>
                <div className='category flex'>
                  <span style={{ background: status === "AVAILABLE" ? "#25b5791a" : "#ff98001a", color: status === "AVAILABLE" ? "#25b579" : "#ff9800" }}>{status}</span>
                  <i className='fa fa-heart'></i>
                </div>
                <h4>{address}</h4>
                <p>
                  <i className='fa fa-location-dot'></i> {area ? `${area.areaName}, ${area.city.cityName}` : 'Unknown'}
                </p>
              </div>
              <div className='button flex'>
                <div>
                  <button className='btn2'>${price}</button> <label htmlFor=''>/month</label>
                </div>
                <span>{flatType}</span>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default RecentCard
