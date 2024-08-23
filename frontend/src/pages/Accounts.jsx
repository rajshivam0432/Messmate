import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Accounts.css';

function Accounts() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDataModified, setIsDataModified] = useState(false); // Track changes
  const [accountData, setAccountData] = useState({
    userId: '',
    balance: 34000.00,
    month: selectedMonth,
    year: currentDate.getFullYear(),
    daysAttended: 30,  // Initialize to 0
    dietCharges: 30,  // Initialize to 0
    miscellaneousCharges: 1220,
    totalMealCost:30,  // Initialize to 0
    extraCharges: 200,  // Initialize to 0
    adjustedMealCost: 0,  // Initialize to 0
    rebateAmount: 0,  // Initialize to 0
  });

  
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const userId = localStorage.getItem('userId');

        console.log('Fetching data for User ID:', userId);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/account/${userId}/${selectedMonth}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log('Fetched Account Data:', response.data); // Log the fetched data
          setAccountData(response.data);
        } else {
          console.error('Failed to fetch account data');
          setError('Failed to fetch account data');
        }
      } catch (error) {
        console.error('Error fetching account data:', error.message);
        setError('Error fetching account data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchAccountData();
  }, [selectedMonth]);
  
  useEffect(() => {
    if (isDataModified) { // Only submit data if it has been modified
      const submitAccountData = async () => {
        try {
          const userId = getUserId();
          const token = localStorage.getItem('token');
          
          const dataToSubmit = {
            userId: userId,
            balance: accountData.balance,
            month: selectedMonth,
            year: accountData.year,
            daysAttended: accountData.daysAttended,
            dietCharges: accountData.dietCharges,
            miscellaneousCharges: accountData.miscellaneousCharges,
            extraCharges: accountData.extraCharges,
            adjustedMealCost: accountData.adjustedMealCost,
            rebateAmount: accountData.rebateAmount,
          };

          console.log('Data to submit:', dataToSubmit);

          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/account`, dataToSubmit, {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log('Account data submitted successfully:', response.data);
          setIsDataModified(false); // Reset the flag after submission
        } catch (error) {
          console.error('Error submitting account data:', error);
          setError('Error submitting account data');
        }
      };

      submitAccountData();
    }
  }, [accountData, selectedMonth]); // Check the flag whenever accountData or selectedMonth changes

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
    setLoading(true);
  };

  const handleAccountDataChange = (newData) => {
    setAccountData((prevData) => ({
      ...prevData,
      ...newData
    }));
    setIsDataModified(true); // Set the flag whenever data changes
  };

  const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    value: index,
    label: new Date(0, index).toLocaleString('default', { month: 'long' }),
  }));

  const selectedMonthName = new Date(0, selectedMonth).toLocaleString('default', { month: 'long' });
  const safeValue = (value) => (isNaN(value) ? 0 : value);

  const monthbill=accountData.adjustedMealCost+accountData.miscellaneousCharges+accountData.extraCharges;
  console.log('Account Data:', accountData); // Debugging line

  return (
    <div className='container-account text-left p-2'>
      <h1 className='heading-account'>My Account</h1>
      <div className="center-div-account">
        <div className="left-div-account card-account">Available Balance:{accountData.balance}</div>
        <div className="right-div-account card-account card2-account">{selectedMonthName} Bill:{monthbill}</div>
      </div>
      
      <label className='select-text-account' htmlFor="monthSelector">Select Month: </label>
      <select className='select-input-account'
        id="monthSelector"
        value={selectedMonth}
        onChange={handleMonthChange}
      >
        {monthOptions.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className='middle-div-account flex justify-between gap-4 p-4 text-center'>
          <div className="middle-child-account rounded-md bg-white w-full p-3">
            <h1 className="text-3xl">Days Attending Mess</h1>
            <p className="text-2xl">{safeValue(accountData.daysAttended)}</p>
          </div>
          <div className="middle-child-account rounded-md bg-white w-full p-3">
            <h1 className="text-3xl">Diet Charges</h1>
            <p className="text-2xl">₹{safeValue(accountData.dietCharges)}</p>
          </div>
          <div className="middle-child-account rounded-md bg-white w-full p-3">
            <h1 className="text-3xl">Miscellaneous Charges</h1>
            <p className="text-2xl">₹{safeValue(accountData.miscellaneousCharges)}</p>
          </div>
          <div className="middle-child-account rounded-md bg-white w-full p-3">
            <h1 className="text-3xl">Extra Charges</h1>
            <p className="text-2xl">₹{safeValue(accountData.extraCharges)}</p>
          </div>
          <div className="middle-child-account rounded-md bg-white w-full p-3">
            <h1 className="text-3xl">Adjusted Meal Cost</h1>
            <p className="text-2xl">₹{safeValue(accountData.adjustedMealCost)}</p>
          </div>
        </div>
      )}

      
    </div>
  );
}

export default Accounts;
