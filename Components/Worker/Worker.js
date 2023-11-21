/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useState, useEffect, memo } from 'react'
import pb from '@/Utilities/lib/pocketbase'
import IntialForm from '@/Utilities/hooks/IntialForm'
import stylesclaims from '../../app/sidebar.module.css'
import stylesseleJobs from '../../app/selectedJob.module.css'
import style from '../../app/workstyle.module.css'
import GetWorker from '@/Utilities/hooks/GetWorker';
import * as BsIcons from 'react-icons/bs'
import * as BiIcons from 'react-icons/bi'
import GetMessages from '@/Utilities/hooks/GetMessages';
import Link from 'next/link'

const status =[
  'All'
  ,'Open' 
  ,'Quote Subimted'
  ,'Invoice Subitted'
  ,'Repairs Authorised'
  ,'Repairs In Progress'
  ,'Await Certificate of Completion'
  ,'Repairs Done'
  ,'Claim Reopened'
 ]
 
function Claims({params}) {
    const id = pb.authStore.model?.id
    const[filterdJobs, setFilterdJob] = useState([])
    const[recodedJobs, setRecordedJobs] = useState([])
    const todaysDate = new Date()
    const todaysDateIm =todaysDate.getTime()
    const { data: messeges} = GetMessages()
    const { data: workers} = GetWorker()
    const [work, setWork] = useState();
    const [WorkersJob,setWorkersJob] = useState([]);
    const [addtog, setAddTog] = useState(false);
    const [Loading, setLoading] = useState(false);
    const[avatar, setGetAva] = useState("");
    const[authName, setAuthName] = useState("");
    const [closedTab, setClosedTab] = useState(false)

  
      async function Filters() {
     setLoading(true)
      const recordedJobs = await pb.collection('jobs').getFullList({
        '$autoCancel': false,
        sort: '-created',
            });
        setRecordedJobs(recordedJobs);

        const filter = recordedJobs?.filter(i => i.business === params.id[1] && i.job_completion === false)
        setFilterdJob(filter);


        const WorkersJob = recordedJobs?.filter(i=> i.workers_on_job[0] === params.id[0]) 
        setWorkersJob(WorkersJob)


        
       const getAvatar = await pb.collection('users').getOne(id , {
        '$autoCancel': false,
            expand:'avatar'
      })
    
          setGetAva(i => getAvatar.avatar)
          setAuthName(i => getAvatar.name)

        setLoading(false)
      
  }

  
  const ChangeFilter = (item)=> {
    setClosedTab(i => false)
    const WorkersJob = recodedJobs?.filter(i=> i.workers_on_job[0] === params.id[0]) 
    setWorkersJob(WorkersJob)
  
    if(item !== 'All'){
      setWorkersJob(WorkersJob.filter(i => i.status === item));
    }
  }

  const  AllClosed = ()=> {
   setClosedTab(i => true)
  }

  async function GetWork() {
    setLoading(true)
    const recordedMess = await pb.collection('workers').getOne(`${params.id[0]}`,{
            '$autoCancel': false,
            expand:""
        });
        setWork(recordedMess);    
        setLoading(false)
      }

 
    useEffect(()=>{
 pb.collection('jobs').subscribe('*',  function (e) {
    Filters()
},
);

       Filters()
       GetWork()
       
    },[])


    return (
      <>
{Loading ? 
<>
  <div className={stylesclaims.leftChanel}>
      <div className={stylesclaims.profilestation}>
        {/* add profilepic */}
          <div className={stylesclaims.avatarl}></div>
            <div className='loadname'></div>
           {params.id[1] === 'everlight' && 
           <div className='leftmar'>
         <div className={stylesclaims.jopbBussiness1}>
            <img className={stylesclaims.formimgs} src='/bitmap.png' alt='' />
            <h3  className={stylesclaims.akxkx}>  
           Everlight Plumbing and Property Maintenance</h3>
          </div></div>
         }
         {params.id[1]=== 'proleak' && 
         <div className='leftmar'>
         <div className={stylesclaims.jopbBussiness1}>
            <img className={stylesclaims.formimgs} src='/cwscsc.png' alt='' />
            <h3  className={stylesclaims.akxkx}>  
           Proleak Plumbing and Leak Detection</h3>
          </div></div>
         }
        </div>
        <div className={stylesclaims.workerflexs}></div>
        <div className={stylesclaims.workerflexs}></div>
        <div className={stylesclaims.workerflexs}></div>
        <div className={stylesclaims.workerflexs}></div>
        <div className={stylesclaims.workerflexs}></div>
        <div className={stylesclaims.workerflexs}></div>
      </div> 

      <div className={stylesseleJobs.JobContainer}>
         <div className={style.header}>
          </div>

          <div className={style.load}>
            <div className={style.loadleft}></div>
            <div className={style.loadright}></div>
          </div>
      </div>

      </> 
      : 
      <>
      <>
        {work &&
          <div className={stylesseleJobs.JobContainer}>
            <div className={style.header}>
                <h1>{work.name}</h1>
                <div className={style.details}>
                <h3>{work.profession}</h3>
                <h6>{work.number}</h6>
                </div>
            </div>
            <div className={style.jobList}>
            <div className={style.filterList}>
            
              <button className={style.btn}>Filter</button>
              <ul className={style.filterCont}>
                {status.map((item,index)=> {
                  return(
                    
                      <li className={style.list} key={index} onClick={()=> ChangeFilter(item)}>{item}</li>
                
                  )
                })}
                </ul>
              <button onClick={()=> AllClosed()} className={style.btnclosed} >Closed</button>

            </div>
            {closedTab ? <>
              <div className={style.job}>
              {WorkersJob?.filter(i => i.status === 'Closed')?.map((items,index) =>{
                return(

                  <Link href={`Business/SelectJob/${params.id[1]}/${items.id}`} key={index}>
                    <div className={style.JobContainer}>
                    <div className={style.row}>
                    {items.business === 'everlight'&& <div className='row'><img src='/bitmap.png' alt=''/> <h6 className={style.business}>Everlight Plumbing And Property Maintenance</h6></div>}
                    {items.business === 'proleak'&& <div className='row'><img src='/cwscsc.png' alt=''/> <h6 className={style.business}>Proleak Plumbing And Leak Detection</h6></div>}
                      <div className={style.item}><h3>Status: </h3><h4 style={{color:'orange'}}> {items.status}</h4></div>
                      <div className={style.item}><h3>Client: </h3><h4> {items.client}</h4></div>
                      <div className={style.item}><h3>Client Number: </h3><h4> {items.clientnumber}</h4></div>
                      <div className={style.item}><h3>Address: </h3><h4>{items.address}</h4></div>
                      </div>
                      
                    <div className={style.rowdescr}>
                      <div className={style.items}><h3>Job Description: </h3><h4>{items.job_description}</h4></div>
                    </div>
                    </div>
                    </Link>
                )
            })}
            </div>
            </>
            :
             <div className={style.job}>
              {WorkersJob?.filter(i => i.status !== 'Closed')?.map((items,index) =>{
                return(

                  <Link href={`Business/SelectJob/${params.id[1]}/${items.id}`} key={index}>
                    <div className={style.JobContainer}>
                    <div className={style.row}>
                    {items.business === 'everlight'&& <div className='row'><img src='/bitmap.png' alt=''/> <h6 className={style.business}>Everlight Plumbing And Property Maintenance</h6></div>}
                    {items.business === 'proleak'&& <div className='row'><img src='/cwscsc.png' alt=''/> <h6 className={style.business}>Proleak Plumbing And Leak Detection</h6></div>}
                      <div className={style.item}><h3>Status: </h3><h4 style={{color:'orange'}}> {items.status}</h4></div>
                      <div className={style.item}><h3>Client: </h3><h4> {items.client}</h4></div>
                      <div className={style.item}><h3>Client Number: </h3><h4> {items.clientnumber}</h4></div>
                      <div className={style.item}><h3>Address: </h3><h4>{items.address}</h4></div>
                      </div>
                      
                    <div className={style.rowdescr}>
                      <div className={style.items}><h3>Job Description: </h3><h4>{items.job_description}</h4></div>
                    </div>
                    </div>
                    </Link>
                )
            })}
            </div>
            }

           
            
            </div>
            
            
          </div>
          }
          <div className={stylesclaims.maincontainer}>
            <div className={stylesclaims.leftChanel}>
            <div className={stylesclaims.profilestation}>
            {/* add profilepic */}
            {avatar && <><img className={stylesclaims.avatar} src={`https://panicky-lion.pockethost.io//api/files/_pb_users_auth_/${id}/${avatar}?token=`}/></>}

{authName && <> <h2>{authName}</h2></>}
              {params.id[1] === 'everlight' && 
              <div className='leftmar'>
            <div className={stylesclaims.jopbBussiness1}>
                <img className={stylesclaims.formimgs} src='/bitmap.png' alt='' />
                <h3  className={stylesclaims.akxkx}>  
              Everlight Plumbing and Property Maintenance</h3>
              </div></div>
            }
            {params.id[1]=== 'proleak' && 
            <div className='leftmar'>
            <div className={stylesclaims.jopbBussiness1}>
                <img className={stylesclaims.formimgs} src='/cwscsc.png' alt='' />
                <h3  className={stylesclaims.akxkx}>  
              Proleak Plumbing and Leak Detection</h3>
              </div></div>
            }
            </div>

            <div className={stylesclaims.workerContainer}> <hr className='sideline'/>
            <h2 className='header2'> Professionals</h2>
            
            {workers?.map((items,index)=>{
          
              return(
                <div key={index} className={stylesclaims.workerContainer}>
                <Link href={`Business/Worker/${items.id}/${params.id[1]}`}>
                  <div key={index}  className={stylesclaims.workerflex}>
                    <h4 className='font1'>{items.name}</h4>
                    <h6 className='font2 workersline'>|</h6>
                    <div className={recodedJobs?.filter(i => i.workers_on_job[0] === items.id && i.status !== 'Closed').length === 0 ? 'red': 'green'}>
                    <p className='font2'>{recodedJobs?.filter(i => i.workers_on_job[0] === items.id  && i.status !== 'Closed').length}</p>
                    </div>
                  </div>
                </Link>
                  {recodedJobs?.filter(i => i.workers_on_job[0] === items.id && i.status !== 'Closed').map((i, index)=>{
                  return(
                    <Link key={index}  href={`Business/SelectJob/${params.id[1]}/${i.id}`}>
                    <div  className={stylesclaims.workersjobs}>
                    <h4 className='font1'>{i.client}</h4>
                    <h5 className='font2'>{i.clientnumber}</h5>
                    <h6 className='font2'>{i.address}</h6>
                    </div>
                    </Link>

                  )
                  })}

                </div>
              )
            })}

            </div>

          
            </div>        
          <Link href={`Business/`}></Link>
          <div className={stylesseleJobs.mainChanel} >

          
            <div className={ addtog ? stylesclaims.InitialForm : stylesclaims.noDis}>
            <p className={stylesclaims.exit}  onClick={()=> setAddTog(!i)} ><BiIcons.BiX/></p>
            <div className={stylesclaims.formHead}>
              <h1>Add Job</h1>
              {params.slug === 'everlight' ?
              <div className={stylesclaims.jopbBussiness}>
                <img className={stylesclaims.formimg} src='/bitmap.png' alt='' />
                <h3> <p className={stylesclaims.jobfor}>A job for</p>
              Everlight Plumbing and Property Maintenance</h3>
              </div>
              :
              <><div className={stylesclaims.jopbBussiness}>
                <img className={stylesclaims.formimg} src='/cwscsc.png' alt='' />
                <h3> <p className={stylesclaims.jobfor}>A job for</p>
              Proleak Plumbing and Leak Detection</h3>
              </div></>
              }
            </div>
            
            </div>

          <div className={stylesclaims.topToolbar}  style={{filter:'blur(3px)'}}>
            <div className={stylesclaims.searchflex}>
            <h4 className={stylesclaims.searchname}>Search: </h4>
            <input name='searchbar' type='search' placeholder='Search client or claim number'/>
            </div>

            <div className={stylesclaims.filtercontainer}>
              <button className={stylesclaims.filterbtn}>Sort <BsIcons.BsFilterLeft className='filtericon'/> </button>
              
              <div className={stylesclaims.filterblock}>
              </div>
            </div>

            <div className={stylesclaims.filtercontainer}>
              <button className={stylesclaims.filterbtn}>Filter <BiIcons.BiFilterAlt className='filtericon'/> </button>
              <div className={stylesclaims.filterblock}>
              </div>
            </div>

            <button className={stylesclaims.addJobbtn} onClick={()=> setAddTog(!i)}>Add Job</button>
          </div>
              
                {filterdJobs?.map((items,index)=>{
                  const createdDate = new Date(items.created)
                  const createdDateIm = createdDate.getTime()
                  const msDiff = todaysDateIm - createdDateIm
                  const timeDiff = Math.round(msDiff / (24 * 60 * 60 * 1000 )) 
                  
                  return(
                    
                      <div key={index} className={stylesclaims.filterback}>

                      <div className={ stylesclaims.jobCardFlex}>
                        <div className={stylesclaims.details}>
                        <div className={stylesclaims.jobHeader}>
                          {workers?.filter(i => i.id === items.workers_on_job[0]).map((i,index)=>{
                              return(
                                <div className={stylesclaims.jobWorker} key={index}>
                                    <img className={stylesclaims.workericon} alt='worker' src='/work-character-solid-icon-illustration-office-workers-teachers-judges-police-artists-employees-free-vector.jpg'/>
                                    <h4 className={stylesclaims.workerName}>{i.name}</h4>
                                </div>
                              )
                          })}
                          <div className={stylesclaims.status}> <h3>Status: </h3> <p>{items.status}</p></div>
                          {timeDiff < 7 && <p className={stylesclaims.jobweeks}>{timeDiff} Days ago</p> }
                          {timeDiff >= 7 && <p className={stylesclaims.jobweeks}>{Math.round(timeDiff/7)} Weeks ago</p> }
                        </div>
                        <div className={stylesclaims.detailsflex}>
                          <div className={stylesclaims.clientDetals}>
                                <div className={stylesclaims.clientrow}>
                                    <h5 className={stylesclaims.clienttitels}>Claim Number:</h5> <p>{items.clientnumber}</p>
                                  </div>
                                  <div className={stylesclaims.clientrow}>
                                    <h5 className={stylesclaims.clienttitels}>Client:</h5> <p>{items.client}</p>
                                  </div>
                                  <div className={stylesclaims.clientrow}>
                                    <h5 className={stylesclaims.clienttitels}>Address:</h5> <p>{items.address}</p>
                                  </div>
                            </div>
                              
                              <div className={stylesclaims.jobDescription}>
                                <h5 className={stylesclaims.clienttitels}>Job Descrption:</h5> <p>{items.job_description}</p>
                              </div>
                        </div>
                      
                        </div>
                            <hr/>

                        <div className={stylesclaims.messegesContainer}>
                        <h5>Notes:</h5>
                        <div className={stylesclaims.messeges}>
                        {messeges?.filter(i => i.job === items.id).length===0 && <p className='noNotes'>No Recorded Notes</p>}
                          {messeges?.filter(i => i.job === items.id).map((i,index)=>{
                          const createdDateM = new Date(i.created)
                          const createdDateMIm = createdDateM.getTime() 
                          const msDiff = todaysDateIm - createdDateMIm
                          const timeDiff = Math.round(msDiff / (24 * 60 * 60 * 1000 )) 
                          const hours = Math.round(msDiff / ( 60 * 60 * 1000 ))
                          const weeksDiff = Math.round(timeDiff/7)
                          return(
                            <div key={index} className={stylesclaims.messege}>
                            
                              <div className={stylesclaims.messageheader}>
                                <div className={stylesclaims.datename}>
                                    <h6 className={stylesclaims.messName}>{i.users_name}</h6>
                                    <h6></h6>
                                </div>
                              {timeDiff >= 7 ? <p>{weeksDiff} Weeks ago</p>: timeDiff > 1 ? <p>{timeDiff} Days ago</p> : hours < 1 ? <p>Just Now</p> : <p>{hours} Hours Ago</p> }
                              </div>
                              <p className={stylesclaims.messText}>{i.message}</p>
                              
                            </div>
                          )
                        })}
                        
                        </div>
                        </div>
                        
                    </div>
                        <div className={stylesclaims.buttonList}>
                          <div>
                        
                          <button  className={stylesclaims.view}>
                          View 
                          </button>
                          <></>
                          
                          </div>
                            
                        </div>
                        
                    </div>
                    
                    
                  )
                })}

          </div>
      
          </div>
          </></>
      }
      </>
    )
  }
  //  use Memo to prevent the the usestates to rerender everytime a state changes
  export default memo(Claims)

  