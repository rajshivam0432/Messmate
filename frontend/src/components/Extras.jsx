import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ExtraItemsContainer = styled.div`
  width: 80%;
  margin: auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-top: 100px;
`;

const SummaryContainer = styled.div`
  padding: 20px;
  background-color: #333;
  color: #fff;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const DayDateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  color: #333;
`;

const DropdownContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
`;

const Dropdown = styled.select`
  padding: 10px;
  font-size: 16px;
`;

const ExtraItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ItemName = styled.span`
  font-size: 18px;
  color: #555;
`;

const ItemPrice = styled.span`
  font-size: 16px;
  color: #4caf50;
`;

const QuantityInput = styled.input`
  width: 40px;
  margin-right: 10px;
  padding: 5px;
  font-size: 14px;
`;

const Button = styled.button`
  background-color: ${(props) => (props.selected ? '#45a049' : '#4caf50')};
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-left: 10px;

  &:hover {
    background-color: ${(props) => (props.selected ? '#4caf50' : '#45a049')};
  }
`;

const ConsumedItems = styled.div`
  margin-top: 20px;
`;

const ConsumedItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const ExtraItems = () => {
  const extraItems = [
    { id: 1, name: 'French Fries', price: 3.5 },
    { id: 2, name: 'Milkshake', price: 4.0 },
    { id: 3, name: 'Cheese Pizza', price: 5.5 },
    { id: 4, name: 'Brownie Sundae', price: 6.5 },
  ];

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [consumedItemsByDate, setConsumedItemsByDate] = useState({});
  const [totalAmountsByDate, setTotalAmountsByDate] = useState({});
  const [totalAmountForMonth, setTotalAmountForMonth] = useState(0);
  const [dateError, setDateError] = useState(false);

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
    setDateError(false);
  };

  const handleButtonClick = (itemId) => {
    const updatedItems = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];

    setSelectedItems(updatedItems);

    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: (prevQuantities[itemId] || 0) + 1,
    }));
  };

  const handleQuantityChange = (itemId, quantity) => {
    setItemQuantities({
      ...itemQuantities,
      [itemId]: parseInt(quantity),
    });
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      setDateError(true);
      return;
    }

    const consumedItemsForDate = selectedItems.map((itemId) => {
      const selectedItem = extraItems.find((item) => item.id === itemId);
      const quantity = itemQuantities[itemId] || 0;
      return { ...selectedItem, quantity };
    });

    if (consumedItemsForDate.length === 0) {
      return;
    }

    setConsumedItemsByDate((prevConsumedItems) => ({
      ...prevConsumedItems,
      [selectedDate]: consumedItemsForDate,
    }));

    const totalAmountForDate = consumedItemsForDate.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    setTotalAmountsByDate((prevTotalAmounts) => ({
      ...prevTotalAmounts,
      [selectedDate]: totalAmountForDate,
    }));

    setSelectedItems([]);
    setItemQuantities({});
    setDateError(false);
  };
  const getDatesForMonth = () => {
    const dates = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
  
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayName = date.toLocaleString('en-US', { weekday: 'short' });
      dates.push({ date: date.toISOString().split('T')[0], day: dayName });
    }
  
    return dates;
  };

  useEffect(() => {
    const totalAmount = Object.values(totalAmountsByDate).reduce(
      (sum, amount) => sum + amount,
      0
    );
    setTotalAmountForMonth(totalAmount);
  }, [totalAmountsByDate]);

  return (
    <ExtraItemsContainer>
      <SummaryContainer>
        <h3>Total Amount Spent in the Month: ${totalAmountForMonth.toFixed(2)}</h3>
      </SummaryContainer>
      <h2 style={{ color: '#333' }}>Extra Items</h2>
      <DropdownContainer>
        <Dropdown onChange={handleDateChange} value={selectedDate} required>
          <option value="" disabled>
            Select Date
          </option>
          {getDatesForMonth().map((data) => (
            <option key={data.date} value={data.date}>{`${data.day}, ${data.date}`}</option>
          ))}
        </Dropdown>
        <Button onClick={handleSubmit}>Submit</Button>
      </DropdownContainer>
      {dateError && <div style={{ color: 'red' }}>Please select a date.</div>}
      {selectedDate && (
        <ConsumedItems>
          <h3 style={{ color: '#333' }}>Consumed Items on {selectedDate}</h3>
          {consumedItemsByDate[selectedDate]?.map((item, index) => (
            <ConsumedItem key={index}>
              <ItemInfo>
                <ItemName>{item.name}</ItemName>
                <ItemPrice>${(item.price * item.quantity).toFixed(2)}</ItemPrice>
              </ItemInfo>
              <span style={{ color: '#4caf50' }}>Qty: {item.quantity}</span>
            </ConsumedItem>
          ))}
          <div>
            <strong>Total Amount:</strong> ${totalAmountsByDate[selectedDate]?.toFixed(2)}
          </div>
        </ConsumedItems>
      )}
      {extraItems.map((item) => (
        <ExtraItem key={item.id}>
          <ItemInfo>
            <ItemName>{item.name}</ItemName>
            <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
          </ItemInfo>
          <QuantityInput
            type="number"
            min="0"
            value={itemQuantities[item.id] || 0}
            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
          />
          <Button
            selected={selectedItems.includes(item.id)}
            onClick={() => handleButtonClick(item.id)}
          >
            {selectedItems.includes(item.id) ? 'Remove' : 'Add'}
          </Button>
        </ExtraItem>
      ))}
    </ExtraItemsContainer>
  );
};

export default ExtraItems;
