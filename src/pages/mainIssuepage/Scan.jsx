import React from 'react'

function Scan() {
  return (
  <section className="container-fluid p-3 p-md-5">
    <div className="row">
        <div className="col-md-6">
            <div className="card p-3">
                <h4 className="fs-4">Officer/Men Scan</h4>
                <hr />
                <div className="card-body">
                  <div className="row align-items-center">
                 <div className="col-md-6">
                 <img src="https://i.gifer.com/origin/e8/e851f9f9e70a9c4b8a90584279373309_w200.gif" alt="" className="w-100" />
                 </div>
                 <div className="col-md-6 h-100 d-flex align-items-center justify-content-center flex-column p-5 border">
                    <h1 className="fs-1 text-danger"><i class="bi bi-ban"></i></h1>
                    <h1 className='fs-5'>Scan Officer/men to see details</h1>
                 </div>
                  </div>
                <center>
                <button className="red-btn mt-4 px-4">Scan now</button>
                </center>
                </div>
            </div>
        </div>
        <div className="col-md-6 d-flex  justify-content-center">
            <div className="card p- h-100 p-3 main-btn">
                <h4 className="fs-4"> Scan Armoury</h4>
                <hr />
                <div className="card-body">
                  <div className="row align-items-center">
                 <div className="col-md-6">
                 <img src="https://cdn.dribbble.com/users/2177933/screenshots/15462162/media/294eba794f2ab2195be636fdc89ea682.gif" alt="" className="w-100" />
                 </div>
                 <div className="col-md-6 h-100 d-flex align-items-center justify-content-center flex-column p-5 border">
                    <h1 className="fs-1 text-danger"><i class="bi bi-ban"></i></h1>
                    <h1 className='fs-5'>Scan Armoury to see details</h1>
                 </div>
                  </div>
                <center>
                <button className="red-btn mt-4 px-4">Scan now</button>
                </center>
                </div>
            </div>
        </div>
    </div>
    <div className="row mt-5 selection">
        <div className="col-md-6">
        <div className="card p-3 text-center">
        <img src="https://thumbs.dreamstime.com/b/sad-document-no-data-file-icon-white-334021734.jpg" alt="" className="w-50 d-block m-auto" />
        <h1 className="fs-5">No Officer Selected</h1>
       </div>
        </div>
        <div className="col-md-6">
        <div className="card p-3 text-center">
        <img src="https://thumbs.dreamstime.com/b/sad-document-no-data-file-icon-white-334021734.jpg" alt="" className="w-50 d-block m-auto" />
        <h1 className="fs-5">No Armoury Selected</h1>
       </div>
        </div>
    </div>
  </section>
  )
}

export default Scan