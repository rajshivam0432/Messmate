import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';

// Lazy load components
const Login = React.lazy(() => import('./components/Login.jsx'));
const Home = React.lazy(() => import('./components/Home.jsx'));
const Accounts = React.lazy(() => import('./pages/Accounts'));
const SignUp = React.lazy(() => import('./components/SignUp'));
const Feedback = React.lazy(() => import('./components/Feedback'));
const ExtraItems = React.lazy(() => import('./components/Extras.jsx'));
const ComplaintPage = React.lazy(() => import('./pages/Complaint/Complaint.jsx'));
const WeeklyMenu = React.lazy(() => import('./pages/MessMenu/MessMenu.jsx'));
const Rebate = React.lazy(() => import('./components/Rebate.jsx'));
const FeedbackList = React.lazy(() => import('./pages/feedbacklist/feedbacklist.jsx'));
const Complaintlist = React.lazy(() => import('./pages/complaintlist/complaintlist.jsx'));
const VerifyOtp=React.lazy(() => import('./pages/OtpVerificationPage/verifyOtp.jsx'));
function App() {
  
  const menuItems = [
    // ... your menu items
  ];

  return (
    <Router>
      <div className="App">
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verifyOtp" element={<VerifyOtp />} />

            <Route path="/feedback" element={<Feedback />} />
            <Route path="/" element={<Home />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/mess-menu" element={<WeeklyMenu menuItems={menuItems} />} />
            <Route path="/complaint" element={<ComplaintPage />} />
            <Route path="/extras" element={<ExtraItems />} />
            <Route path="/rebate" element={<Rebate />} />
            <Route path="/feedbacklist" element={<FeedbackList />} />
            <Route path="/complaintlist" element={<Complaintlist />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
