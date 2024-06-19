import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ThankYou from '../pages/ThankYou'
import Home from './../pages/Home'
import Login from './../pages/Login'
import Register from './../pages/Register'
import SearchResultList from './../pages/SearchResultList'
import TourDetails from './../pages/TourDetails'
import Tours from './../pages/Tours'
import AboutPage from '../pages/AboutPage'
import CopyrightPage from '../pages/CopyrightPage'
import ForgotPassword from '../pages/ForgetPassWord'
import Profile from '../pages/Profile'
import MyBookings from '../pages/myBooking'

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
         <Route path='reset-password' element={<ForgotPassword />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/my-booking" element={<MyBookings />} />


      </Routes>
   )
}

export default Routers