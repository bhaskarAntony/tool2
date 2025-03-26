import React from 'react'

function AvailableCount({open, close, isOpen}) {
  return (
    <div className="card rounded-0">
                        <div className="card-header p-2 d-flex gap-2 align-items-center justify-content-end">
                       <div className="icon">
                       <i class="bi bi-arrow-clockwise"></i>
                       </div>
                       <div className="icon" onClick={()=>{
                            isOpen?(close()):(open(2))
                       }}>
                       <i class="bi bi-arrows-angle-expand"></i>
                       </div>
                        </div>
                        <div className="card-body">
                            <h5 className="fs-5 text-secondary">Available Count</h5>
                            <hr />
                           
                           
                        </div>
                    </div>
  )
}

export default AvailableCount