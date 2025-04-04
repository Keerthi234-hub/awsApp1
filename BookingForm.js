import React from 'react';
import { Form, DatePicker, InputNumber, Button, message } from 'antd';
import axios from 'axios';

const BookingForm = ({ destination, onSuccess }) => {
  const [form] = Form.useForm();

  const checkAvailability = async (date, numPeople) => {
    try {
      const response = await axios.get(
        `/api/destinations/${destination.id}/check_availability/`,
        {
          params: {
            date: date.format('YYYY-MM-DD'),
            num_people: numPeople
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      return null;
    }
  };

  const handleSubmit = async (values) => {
    // Check availability before booking
    const availability = await checkAvailability(
      values.visit_date,
      values.number_of_people
    );

    if (!availability?.available) {
      message.error(
        `Sorry, this date is not available for ${values.number_of_people} people. ` +
        `Next available date: ${availability?.next_available_date}`
      );
      return;
    }

    try {
      const response = await axios.post('/api/bookings/', {
        destination: destination.id,
        visit_date: values.visit_date.format('YYYY-MM-DD'),
        number_of_people: values.number_of_people,
        total_price: destination.price_per_person * values.number_of_people
      });
      
      message.success('Booking created successfully!');
      form.resetFields();
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      message.error('Failed to create booking. Please try again.');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="visit_date"
        label="Visit Date"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        name="number_of_people"
        label="Number of People"
        rules={[{ required: true, message: 'Please enter number of people' }]}
      >
        <InputNumber min={1} max={10} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Book Now
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BookingForm;