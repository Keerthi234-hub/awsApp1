import React from 'react';
import { Card, Rate, Image, List, Drawer } from 'antd';
import BookingForm from './BookingForm';
import Recommendations from './Recommendations';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const { Meta } = Card;

const DestinationList = ({ destinations }) => {
  const [selectedDestination, setSelectedDestination] = useState(null);
  return (
    <div className="destination-container">
      <div className="map-container">
        <MapContainer center={[20, 0]} zoom={2}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {destinations.map((destination) => (
            <Marker
              key={destination.id}
              position={[destination.latitude, destination.longitude]}
            >
              <Popup>
                <h3>{destination.name}</h3>
                <p>{destination.description.substring(0, 100)}...</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={destinations}
        renderItem={(destination) => (
          <List.Item>
            <Card
              hoverable
              onClick={() => setSelectedDestination(destination)}
              cover={
                <Image
                  alt={destination.name}
                  src={destination.primaryImage}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMC8yOS8xMiKqq3kAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAABHklEQVR4nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPwZgtQAARmXTxYAAAAASUVORK5CYII="
                />
              }
            >
              <Meta
                title={destination.name}
                description={
                  <>
                    <Rate disabled defaultValue={destination.rating} />
                    <p>{destination.description.substring(0, 200)}...</p>
                    <p>
                      {destination.district}, {destination.state},{' '}
                      {destination.country}
                    </p>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />
      
      <Drawer
        title={selectedDestination?.name}
        placement="right"
        width={520}
        onClose={() => setSelectedDestination(null)}
        visible={!!selectedDestination}
      >
        {selectedDestination && (
          <>
            <BookingForm
              destination={selectedDestination}
              onSuccess={() => setSelectedDestination(null)}
            />
            <Recommendations destinationId={selectedDestination.id} />
          </>
        )}
      </Drawer>
    </div>
  );
};

export default DestinationList;