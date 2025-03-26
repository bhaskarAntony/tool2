import React, { useEffect, useState } from 'react'
import './style.css'
import PresetStack from './PresetStack'
import AvailableCount from './AvailableCount'
import IssuedCount from './IssuedCount'
import { Button, Modal, Offcanvas } from 'react-bootstrap'
import NewArmoury from '../../components/Newarmary/NewArmoury'
import NewOfficer from '../officer/NewOfficer'
import NewAmmunition from '../../components/Newarmary/NewAmmunition'
import axios from 'axios'
import Chart from 'react-apexcharts';
import IssuedChart from './IssuedChart'
import BarChart from './BarChart'

function Home() {
  const [armouryData, setArmouryData] = useState([])
  const [ammunitionData, setAmmunitionData] = useState([]);
    const [LargeView, setLargeView] = useState(false);
    const [cardNo, setCardNo] = useState(1);

    const [showCanvas, setShowCanvas] = useState(false);
    const [AddType, setAddType] = useState('')

    const [stats, setStats] = useState({
      totalWeapons: 0,
      availableWeapons: 0,
      issuedWeapons: 0,
      totalOfficers: 0,
      officersWithWeapons: 0,
      dailyStatus: { labels: [], data: [] },
      monthlyData: { labels: [], issued: [], remaining: [] },
      weaponTypes: [], // Example: ['Rifles', 'Pistols', 'Shotguns', 'Snipers']
      weaponStats: [], // Example: [20, 15, 10, 5] for issued
    });
  
    const [transactions, setTransactions] = useState([]);
    const [returnedCount, setReturnedCount] = useState(0);
    const [notReturnedCount, setNotReturnedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true)
  
    useEffect(() => {
      setIsLoading(true)
      axios.get('https://tool-backendf.onrender.com/api/transactions/list')
        .then((response) => {
          setTransactions(response?.data);
          setIsLoading(false)
  
          // Calculate returned and not returned counts
          const returned = response.data?.filter((txn) => txn?.returnDate).length;
          const notReturned = response.data?.length - returned;
  
          setReturnedCount(returned);
          setNotReturnedCount(notReturned);
        })
        .catch((error) => {
          setIsLoading(true);
          console.error('Error fetching transactions:', error)
        });
    }, []);
  
    useEffect(() => {
      // Fetch stats data from the backend
      setIsLoading(true)
      axios
        .get('https://tool-backendf.onrender.com/api/transactions/stats')
        .then((response) => {
          setIsLoading(false)
          setStats(response.data);
        })
        .catch((error) => {
          setIsLoading(false)
          console.error('Error fetching stats:', error);
        });
    }, []);

    useEffect(() => {
      // Fetch stats data from the backend
      setIsLoading(true)
      axios
        .get('https://tool-backendf.onrender.com/api/weapons')
        .then((response) => {
          setIsLoading(false)
          setArmouryData(response.data);
        })
        .catch((error) => {
          setIsLoading(false)
          console.error('Error fetching stats:', error);
        });
    }, []);

    const openLargeViewHandler = (no) =>{
        setLargeView(true);
        setCardNo(no)
    }
    const closeLargeViewHandler = () =>{
        setLargeView(false);
        setCardNo(1);
    }

    const openCanvasHandler = (type) =>{
        setAddType(type);
        setShowCanvas(true)
    }
    const closeCanvasHanlder = () =>{
        setShowCanvas(false);
        setAddType('');
    }

    // Donut Chart Configuration
  const donutChartOptions = {
    chart: { type: 'donut' },
    labels: ['Available Weapons', 'Issued Weapons'],
    colors: ['#4BC0C0', '#FF9F40'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: true },
  };
  const armourydata = {
    series: [stats.availableWeapons, stats.issuedWeapons],
  };

  const ammunitiondata = {
    series: [stats.availableWeapons, stats.issuedWeapons],
  };

  const munitiondata = {
    series: [stats.availableWeapons, stats.issuedWeapons],
  };

  const radarChartData = {
    series: [
      {
        name: 'Issued Weapons',
        data: stats.weaponStats || [], // Safe fallback to an empty array
      },
    ],
  };

  // useEffect(async()=>{
  //     let responce = await  axios.get('https://tool-backendf.onrender.com/api/items')
  //     .then((res)=>{
  //         console.log(res.data);
          
  //     })
  //     .catch((err)=>{
  //       console.log(err);
        
  //     })
  // }, [])
  useEffect(() => {
    // Fetch stats data from the backend
    setIsLoading(true)
    axios
      .get('https://tool-backendf.onrender.com/api/items')
      .then((response) => {
        setIsLoading(false)
        setAmmunitionData(response.data);
      })
      .catch((error) => {
        setIsLoading(false)
        console.error('Error fetching stats:', error);
      });
  }, []);


    
  return (
    <section className="container-fluid p-3 p-md-5">
       <div className="d-flex gap-4 align-items-center">
       <h1 className="fs-3 fw-normal">Karnataka State Police Armoury Management Portal</h1>
       <div className="icon">
          <i class="bi bi-arrow-clockwise fs-4"></i>
        </div>
       </div>
        <hr />
        <div className="row">
            <div className="col-md-9">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <PresetStack open={openLargeViewHandler} close={closeLargeViewHandler} isOpen={false} armoury={armouryData} ammunitionData={{ammunitionData}}/>
                    </div>
                    <div className="col-md-6 mb-3">
                        <AvailableCount open={openLargeViewHandler} close={closeLargeViewHandler} isOpen={false}/>
                    </div>
                    <div className="col-md-6 mb-3">
                        <IssuedCount open={openLargeViewHandler} close={closeLargeViewHandler} isOpen={false}/>
                    </div>
                  <div className="col-md-6 mb-3">
                  <div className="card rounded-0">
                        <div className="card-header p-2 d-flex gap-2 align-items-center justify-content-end">
                       {/* <div className="icon">
                       <i class="bi bi-arrow-clockwise"></i>
                       </div> */}
                       {/* <div className="icon" onClick={()=>{
                            isOpen?(close()):(open(2))
                       }}>
                       <i class="bi bi-arrows-angle-expand"></i>
                       </div> */}
                        </div>
                        <div className="card-body">
                            <h5 className="fs-5 text-secondary">Arms</h5>
                            <hr />
                           
                            <Chart
                            options={donutChartOptions}
                            series={armourydata?.series}
                            type="donut"
                            height="300"
                          />
                           
                        </div>
                    </div>
                  </div>
                  {/* <div className="col-md-6">
                  <IssuedChart
                total={stats?.totalWeapons}
                available={stats?.availableWeapons}
                issued={stats?.issuedWeapons}
                 />
                    <Chart
                            options={donutChartOptions}
                            series={ammunitiondata?.series}
                            type="donut"
                            height="300"
                          />

                  </div>
                  <div className="col-md-6">
              <IssuedChart
                total={stats?.totalWeapons}
                available={stats?.availableWeapons}
                issued={stats?.issuedWeapons}
              />
                          <Chart
                            options={donutChartOptions}
                            series={munitiondata?.series}
                            type="donut"
                            height="300"
                          />
              </div> */}

<div className="col-md-6 mb-3">
                  <div className="card rounded-0">
                        <div className="card-header p-2 d-flex gap-2 align-items-center justify-content-end">
                       {/* <div className="icon">
                       <i class="bi bi-arrow-clockwise"></i>
                       </div> */}
                       {/* <div className="icon" onClick={()=>{
                            isOpen?(close()):(open(2))
                       }}>
                       <i class="bi bi-arrows-angle-expand"></i>
                       </div> */}
                        </div>
                        <div className="card-body">
                            <h5 className="fs-5 text-secondary">Ammunition</h5>
                            <hr />
                           
                            <Chart
                            options={donutChartOptions}
                            series={ammunitiondata?.series}
                            type="donut"
                            height="300"
                          />
                           
                        </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                  <div className="card rounded-0">
                        <div className="card-header p-2 d-flex gap-2 align-items-center justify-content-end">
                       {/* <div className="icon">
                       <i class="bi bi-arrow-clockwise"></i>
                       </div> */}
                       {/* <div className="icon" onClick={()=>{
                            isOpen?(close()):(open(2))
                       }}>
                       <i class="bi bi-arrows-angle-expand"></i>
                       </div> */}
                        </div>
                        <div className="card-body">
                            <h5 className="fs-5 text-secondary">Munition</h5>
                            <hr />
                           
                            <Chart
                            options={donutChartOptions}
                            series={armourydata?.series}
                            type="donut"
                            height="300"
                          />
                           
                        </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                  <BarChart transactions={transactions} />
                  </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="btns">
                <button className='red-btn w-100 text-start px-3' onClick={()=>openCanvasHandler('armoury')}><i class="bi bi-plus-lg"></i> Add Arms</button>
                <button className='red-btn w-100 mt-3 text-start px-3' onClick={()=>openCanvasHandler('ammunition')}><i class="bi bi-plus-lg"></i> Add Ammunition</button>
                <button className='red-btn w-100 mt-3 text-start px-3' onClick={()=>openCanvasHandler('munition')}><i class="bi bi-plus-lg"></i> Add Munition</button>

                <button className='red-btn w-100 text-start px-3 mt-3' onClick={()=>openCanvasHandler('new_officer')}><i class="bi bi-plus-lg"></i> Add New Officer</button>
                
                </div>
            </div>
        </div>

        <Modal
        show={LargeView}
        onHide={closeLargeViewHandler}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
            cardNo == 1?(<PresetStack open={openLargeViewHandler} close={closeLargeViewHandler} isOpen={true}/>):cardNo == 2?(<AvailableCount open={openLargeViewHandler} close={closeLargeViewHandler} isOpen={true}/>):cardNo==3?(<IssuedCount open={openLargeViewHandler} close={closeLargeViewHandler} isOpen={true}/>):(null)
        }
      </Modal.Body>
    </Modal>



    <Offcanvas show={showCanvas} onHide={closeCanvasHanlder} placement='bottom'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{textTransform:'capitalize'}}>{AddType}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            {
                AddType=='armoury' ||  AddType=='munition'?(<NewArmoury C_type={'armoury'}/>):AddType=='new_officer'?(<NewOfficer/>):AddType=='ammunition'?(<NewAmmunition/>):(null)
            }
        </Offcanvas.Body>
      </Offcanvas>
    </section>
  )
}

export default Home