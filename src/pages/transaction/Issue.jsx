import React from 'react'
import MainIssue from '../mainIssuepage/MainIssue'

function Issue() {
  return (
   <section className="container-fluid p-3 p-md-5">
        <div className="row">
           
            <div className="col-md-8">
                <MainIssue/>
            </div>
            <div className="col-md-4">
                <div className="weapons">

                </div>
            </div>
        </div>
   </section>
  )
}

export default Issue