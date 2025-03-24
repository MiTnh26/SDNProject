import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/User/Home'
import Tours from '../pages/User/Tours'
import TourDetails from '../pages/User/TourDetails'
import Login from '../pages/User/Login'
import Register from '../pages/User/Register'
import ThankYou from '../pages/User/ThankYou'
import SearchResultList from '../pages/User/SearchResultList'
import AboutPage from '../pages/User/AboutPage'
import CopyrightPage from '../pages/User/CopyrightPage'
import ResetPassword from '../pages/User/ForgetPassWord'
import Profile from '../pages/User/Profile'
import MyBookings from '../pages/User/myBooking'
import Promotion from '../pages/User/Promotion'
import ContactPage from '../pages/User/Contact'


const Routers = () => {
   return (
      <Routes>
         <Route path='/' element={<Navigate to='/home' />} />
         <Route path='/home' element={<Home />} />
         <Route path='/tours' element={<Tours />} />
         <Route path='/tours/:id' element={<TourDetails />} />
         <Route path='/login' element={<Login />} />
         <Route path='/register' element={<Register />} />
         <Route path='/thank-you' element={<ThankYou />} />
         <Route path='/tours/search' element={<SearchResultList />} />
         <Route path='/about' element={<AboutPage />} />
         <Route path='/copyright' element={<CopyrightPage />} />
         <Route path='*' element={<Home />} />
         <Route path='reset-password' element={<ResetPassword />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/my-booking" element={<MyBookings />} />
         <Route path='/contact' element={<ContactPage />} />
         <Route path='/deals' element={<Promotion />} />


      </Routes>
   )
}

export default Routers