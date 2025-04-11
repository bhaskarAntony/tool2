import React, { useContext } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import './App.css'
import SignUp from './pages/signup/SignUp'
import Home from './pages/home/Home'
import PrivateRoute from './components/privateRoute/PrivateRoute'
import Header from './components/header/Header'
import Armoury from './pages/manage/Armoury'
import Ammunition from './pages/manage/Ammunition'
import Munition from './pages/manage/Munition'
import FixedOfficers from './pages/officers/FixedOfficers'
import DutyOfficers from './pages/officers/DutyOfficers'
import AuthContext from './components/context/AuthContext'
import Transactions from './pages/transaction/Transactions'
import MainIssue from './pages/mainIssuepage/MainIssue'
import ReturnAll from './pages/ReturnWeapon/ReturnAll'
import ReturnWeapon from './pages/ReturnWeapon/ReturnWeapon'
import Maintanance from './pages/maintanance/Maintanance'
import { MaintenanceTable } from './pages/maintanance/MaintenanceTable'
import Reports from './pages/Reports/Reports'
import SessionTimeout from './pages/transaction/SessionTimeout'
import ScanAndIssue from './pages/mainIssuepage/ScanAndIssue'
import FingerprintAuth from './pages/mainIssuepage/Scanner'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WeaponDetails from './pages/manage/Details'
import ScanandReturn from './pages/ReturnWeapon/ScanandReturn'

function App() {
  const {isAuthenticated} = useContext(AuthContext);
  return (
    <section className="container-fluid p-0">
        <BrowserRouter>
     {/* {
      isAuthenticated?(   <SessionTimeout/>):(null)
     } */}
      {
        isAuthenticated?(  <Header/>):(null)
      }
       <ToastContainer/>
          <Routes>
            <Route path='/' element={<PrivateRoute><Home/></PrivateRoute>}/>
            {/* <Route path='/' element={<Home/>}/> */}
            <Route path='/login' element={<SignUp/>}/>
            <Route path='/a' element={<Armoury/>}/>
            <Route path='/am' element={<Ammunition/>}/>
            <Route path='/manage/munition' element={<Munition/>}/>
            <Route path='/fixed/officer' element={<FixedOfficers/>}/>
            <Route path='/duty/officer' element={<DutyOfficers/>}/>
            <Route path='/transactions' element={<Transactions/>}/>
            <Route path='/issue' element={<MainIssue/>}/>
            <Route path='/return' element={<ReturnAll/>}/>
            <Route path='/return/weapon/:transactionId' element={<ReturnWeapon/>}/>
            <Route path='/maintanance' element={<Maintanance/>}/>
            <Route path='/maintanance/logs' element={<MaintenanceTable/>}/>
            <Route path='/reports' element={<Reports/>}/>
            <Route path='/scanner' element={<ScanAndIssue/>}/>
            <Route path='/finger' element={<FingerprintAuth/>}/>
            <Route path='/details' element={<WeaponDetails/>}/>
            <Route path='/return/weapons' element={<ScanandReturn/>}/>
          </Routes>
        </BrowserRouter>
    </section>
  )
}

export default App