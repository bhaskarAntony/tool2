import React, { useState } from 'react'
import './style.css'

function Munition() {
    const [data, setData] = useState([])
  return (
    <section className="container-fluid p-3 p-md-5">
        <h1 className="fs-3 fw-normal">Manage Munition</h1>
        <hr />
        <div className="row">
            <div className="col-md-9">
               <div className="d-flex align-items-center justify-content-between">
               <div className="search">
                    <input type="text" placeholder='Search Armoury' />
                    <button><i class="bi bi-search"></i></button>
                </div>
                <select name="" id="actions" className='main-btn hover'>
                    <option value="" selected disabled><i class="bi bi-list"></i> Actions</option>
                    <option value=""> select rows to see actions</option>
                </select>
               </div>
               <div className="main-btn mt-3 filter d-flex gap-2 align-items-center justify-content-between p-2">
                <div className='d-flex gap-2 align-items-center'>
                    <label htmlFor="">Type</label>
                  <select name="" id="">
                    <option value="" disabled selected>Select Armoury type</option>
                  </select>
                </div>

                <div className='d-flex gap-2 align-items-center'>
                    <label htmlFor="">Status</label>
                  <select name="" id="">
                    <option value="" disabled selected>Select Armoury Status</option>
                    <option value="available">Available</option>
                    <option value="issued">issued</option>
                    {/* <option value=""></option> */}
                  </select>
                </div>

                <div className='d-flex gap-2 align-items-center'>
                    <label htmlFor="">Category</label>
                  <select name="" id="">
                    <option value="" disabled selected>Select Armoury Category</option>
                    {/* <option value="available">Available</option>
                    <option value="issued">issued</option> */}
                    {/* <option value=""></option> */}
                  </select>
                </div>

               

                <div className='d-flex gap-2 align-items-center'>
                    <label htmlFor="">Created on</label>
                  <input type="date" name='date'/>
                </div>
               </div>
               <table width='100%'>
                <tr className='main-btn'>
                    <th className='d-flex gap-2 align-items-center'> <input type="checkbox" name='all' id='all' />Name</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Reg. no</th>
                    <th>Coy</th>
                    <th>Actions</th>
                </tr>
                
               </table>
               {
                    !data.length>=0?(
                        <div className="row">
                            <div className="col-md-5 m-auto  text-center p-5">
                            <i class="bi bi-ban display-2"></i>
                            <p className="fs-5 fw-bold mt-2">  No Munitions found.</p>
                            </div>
                        </div>
                    ):(null)
                }
            </div>
            <div className="col-md-3">
            <a href="" className='red-btn w-100 text-start px-3'><i class="bi bi-plus-lg"></i> Add new Munition</a>
            </div>
        </div>
    </section>
  )
}

export default Munition