import { useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Homepage from './PAGES/Static/Homepage'
import Signup from './PAGES/User/Signup'
import Login from './PAGES/User/Login'
import ForgotPassword from './PAGES/User/Forgotpassword'
import Browse from './PAGES/Note/Browse'
import Profile from './PAGES/User/Profile'
import Resetpassword from './PAGES/User/Resetpassword'
import Updateprofile from './PAGES/User/Updateprofile'
import Changepassword from './PAGES/User/Changepassword'
import Note from './PAGES/Note/Note'
import UploadNote from './PAGES/Note/UploadNote'
import NoteDetail from './PAGES/Note/NoteDetail'
import UpdateNote from './PAGES/Note/UpdateNote'
import AuthGuard from './COMPONENTS/AuthGuard'
import AdminDashboard from './PAGES/Admin/AdminDashboard'
import AdvancedSearch from './PAGES/Search/AdvancedSearch'
import UserAnalytics from './PAGES/User/UserAnalytics'
import PageNotFound from './PAGES/Static/PageNotFound'
import Privacy from './PAGES/Static/Privacy'
import Contact from './PAGES/Static/Contact'
import Terms from './PAGES/Static/Terms'
import HelpCenter from './PAGES/Static/HelpCenter'
import AboutDeveloper from './PAGES/Static/AboutDeveloper'
import MyBookmarks from './PAGES/User/MyBookmarks'
import ComingSoon from './PAGES/Static/ComingSoon'

function App() {
  return ( 
    <>
      <Routes>
        <Route path='/' element={<Homepage/>} ></Route>
        <Route path='/signup' element={<Signup/>} ></Route>
        <Route path='/login' element={<Login/>} ></Route>
        <Route path='/forgot-password' element={<ForgotPassword/>} ></Route>
        <Route path='/profile' element={<Profile/>} ></Route>
        <Route path='/reset-password/:resetToken' element={<Resetpassword/>}></Route>
        <Route path='/edit-profile' element={<Updateprofile/>}></Route>
        <Route path='/change-password' element={<Changepassword/>} ></Route>
        <Route path='/notes' element={<Note/>} ></Route>
      {/* <Route path='/notes' element={<Browse/>} ></Route> */}
      {/* Note Detail */}
        <Route path="/notes/:id" element={<NoteDetail />} />
        <Route path='/update-note/:id' element={<UpdateNote/>} ></Route>
        <Route path='/upload' element={<UploadNote/>} ></Route>

        
<Route 
    path="/admin" 
    element={
        <AuthGuard fallback={<Navigate to="/login" />}>
            <AdminDashboard />
        </AuthGuard>
    } 
/>
<Route path="/search" element={<AdvancedSearch />} />
<Route 
    path="/my-analytics" 
    element={
        <AuthGuard fallback={<Navigate to="/login" />}>
            <UserAnalytics />
        </AuthGuard>
    } 
/>

<Route path='/bookmarks' element={<MyBookmarks/>} ></Route>

<Route path="/coming-soon" element={<ComingSoon />} />
<Route path='/settings' element={<ComingSoon/>} ></Route>
<Route path='/about-developer' element={<AboutDeveloper/>} ></Route>
<Route path='/help' element={<HelpCenter/>} ></Route>
<Route path='/contact' element={<Contact/>}  ></Route>
<Route path='/privacy' element={<Privacy/>} ></Route>
<Route path='/terms' element={<Terms/>}  ></Route>
<Route path="*" element={<PageNotFound />} /></Routes>

    </>
  )
}

export default App
