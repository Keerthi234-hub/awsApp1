import React, { useEffect, useState } from 'react';
import { Card, List, Spin } from 'antd';
import axios from 'axios';

const Recommendations = ({ destinationId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `/api/destinations/${destinationId}/recommendations/`
        );
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (destinationId) {
      fetchRecommendations();
    }
  }, [destinationId]);

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="recommendations">
      <h3>Nearby Attractions</h3>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={recommendations}
        renderItem={(item) => (
          <List.Item>
            <Card
              size="small"
              title={item.name}
              extra={item.rating && `⭐ ${item.rating}`}
            >
              <p>{item.vicinity}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Recommendations;