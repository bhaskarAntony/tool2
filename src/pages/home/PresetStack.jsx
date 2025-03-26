import React, { useState } from 'react'

function PresetStack({open, close, isOpen, armoury, ammunitionData}) {
    // const [armouryData, setarmouryData] = useState()
    // if(armoury.length<10){
    //     "0"+armoury.length;
    // }else{
    //     armoury.length
    // }
    console.log(ammunitionData?.length);
    
  return (
    <div className="card rounded-0 h-100">
                        <div className="card-header p-2 d-flex gap-2 align-items-center justify-content-end">
                       
                       <div className="icon" onClick={()=>{
                            isOpen?(close()):(open(1))
                       }}>
                       <i class="bi bi-arrows-angle-expand"></i>
                       </div>
                        </div>
                        <div className="card-body">
                            <h5 className="fs-5 text-secondary">Total Count</h5>
                            <hr />
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card rounded-0 text-center">
                                        <div className="card-header p-2">
                                            <p className="fs-6 mb-0">Arms</p>
                                        </div>
                                        <div className="card-body">
                                            <h1 className="fs-3 fw-bold">{armoury.length<10?(<span>0{armoury.length}</span>):(<span>{armoury.length}</span>)}</h1>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card rounded-0  text-center">
                                        <div className="card-header p-2">
                                            <p className="fs-6 mb-0">Ammunition</p>
                                        </div>
                                        <div className="card-body">
                                        <h1 className="fs-3 fw-bold">{ammunitionData?('01'):('00')}</h1>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card rounded-0 text-center">
                                        <div className="card-header p-2">
                                            <p className="fs-6 mb-0">Munition</p>
                                        </div>
                                        <div className="card-body">
                                        <h1 className="fs-3 fw-bold">00</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
   
                    </div>
  )
}

export default PresetStack