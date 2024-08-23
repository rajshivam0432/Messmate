import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [accountData, setAccountData] = useState({
    balance: 0,
    dietCharges: 0,
    miscellaneousCharges: 0,
    extraCharges: 0,
    
    daysAttendingMess: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => {
    const fetchAccountData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/profile/accounts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        if (response.status === 200) {
          const data = response.data.data;
          setAccountData({
            balance: data.balance,
            dietCharges: data.dietCharges,
            miscellaneousCharges: data.miscellaneousCharges,
            extraCharges: data.extraCharges,
            daysAttendingMess: data.daysAttendingMess,
          });
        } else {
          setError('Failed to fetch account data');
        }
      } catch (error) {
        setError('Error fetching account data');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [selectedMonth]);

  return (
    <AccountContext.Provider value={{ accountData, loading, error, selectedMonth, setSelectedMonth }}>
      {children}
    </AccountContext.Provider>
  );
};
