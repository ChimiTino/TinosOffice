/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useState, useEffect, memo } from 'react'
import pb from '@/Utilities/lib/pocketbase'
import IntialForm from '@/Utilities/hooks/IntialForm'
import stylesclaims from '../../app/sidebar.module.css'
import GetWorker from '@/Utilities/hooks/GetWorker';
import {useForm} from "react-hook-form";
import * as BsIcons from 'react-icons/bs'
import * as BiIcons from 'react-icons/bi'
import { data } from 'autoprefixer';
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
  ,'Closed'
  ,'Claim Reopened'
 ]
 



function Claims({params}) {
    const avatar = pb.authStore.model?.avatar  
    const id = pb.authStore.model?.id
    const[addJob, setAddJob] = useState(false)
    const[filterdJobs, setFilterdJob] = useState([])
    const[urgant, setUrgant] = useState([])
    const [workname,  setWorkname] = useState("Choose Worker")
    const[recodedJobs, setRecordedJobs] = useState([])
    const[competed, setCompleted] = useState([])
    const[Loading, setLoading] = useState(false)
    const todaysDate = new Date()
    const todaysDateIm =todaysDate.getTime();
    const { data: messeges} = GetMessages();
    const { data: workers} = GetWorker();
    // const { data: recordedJobs} = GetJobs()
    const {register, handleSubmit, reset} = useForm();
    const [pdf, setPdf] = useState(data?.quote);
    const { mutate: intialForm, isLoading, isError} = IntialForm();
    const [worker, setWorker] = useState();
    const [busnu, setBusnu]= useState();
    const [tog, setTog] = useState();
    const [addtog, setAddTog] = useState(false);
    const [sorttog,setsorttog] = useState(false);
    const [businessno, setbusinessno] = useState()

    const WorkerSelect = (worker) =>{
      setTog(false)
      setWorker(worker.id)
      setWorkname(worker.name)
    }
   
        async function theIntialForm(data){

        setAddTog(false)

        if (params.slug ==='everlight') {
          setbusinessno(`EVER${busnu}`)
        } 
        if (params.slug ==='proleak') {
          setbusinessno(`PRO${busnu}`)
        }


        intialForm({
         client: data.client,
         clientnumber: data.clientnumber,
         address: data.address,
         job_description: data.job_description,
         workers_on_job: worker,
         business_number: businessno, 
         business: params.slug,
         claim_provider:data.clientprovider,
         status:"Open",
         proximate_cause:data.proximate_cause,
         excess:data.excess_amount

      })
    }
      async function Filters() {
      setLoading(true)
      const recordedJobs = await pb.collection('jobs').getFullList({
        '$autoCancel': false,
         sort: '-created',
            });
      setRecordedJobs(recordedJobs)
    
      const filter = recordedJobs?.filter(i => i.business === params.slug && i.job_completion === false)
       setFilterdJob(filter);

      const urgant = recordedJobs?.filter(i => i.urgant_job === true && i.business === params.slug)
       setUrgant(urgant);
      const completed = recordedJobs?.filter(i => i.job_completion === true && i.business === params.slug)
       setCompleted(completed);
       setLoading(false)

  }
  pb.collection('jobs').subscribe('*',  function (e) {
    Filters()
},
);
    useEffect(()=>{
       Filters()
    },[])
const ChangeFilter = (item)=> {
  const filter = recodedJobs?.filter(i => i.business === params.slug && i.job_completion === false)
  setFilterdJob(filter)
  setsorttog(false)

  if(item !== 'All'){
    setFilterdJob(filter.filter(i => i.status === item));
  }

  
}
  




    return (
      
      <>
      {
        Loading ? <>
        <div className={stylesclaims.maincontainer}>
      <div className={stylesclaims.leftChanel}>
         <div className={stylesclaims.topToolbar}>
        <div className='profloading'></div>

        

         </div><div className='workload'></div>
        <div className='workload'></div>
        <div className='workload'></div>
        <div className='workload'></div>
        <div className='workload'></div>
        
         </div>
         </div>
         <div className={stylesclaims.mainChanelloading}>
         <div className={stylesclaims.topToolbar}>
          <div className={stylesclaims.searchflex}>
         <h4 className={stylesclaims.searchname}></h4>
         <input name='searchbar' type='search' />
         </div>
         <div className={stylesclaims.filtercontainer} >
          <button className={stylesclaims.filterbtn}> ...</button>
         </div>
         <div className={stylesclaims.filtercontainer}>
           <button className={stylesclaims.filterbtn}> ...</button>
           <div className={stylesclaims.filterblock}>
           </div>
         </div>
         </div>

         <div className='loadbox1'></div>
         <div className='loadbox1'></div>
         <div className='loadbox1'></div>
         <div className='loadbox1'></div>
         <div className='loadbox1'></div>
         </div>
        
        </> : 
        <>
        <div className={stylesclaims.maincontainer}>
        <div className={stylesclaims.leftChanel}>
        <div className={stylesclaims.profilestation}>
        {/* add profilepic */}
          <img className={stylesclaims.avatar} src={`http://127.0.0.1:8090/api/files/_pb_users_auth_/${id}/${avatar}?token=`}/>
           <h2>{pb.authStore.model.name}</h2>
           {params.slug === 'everlight' && 
           <div className='leftmar'>
         <div className={stylesclaims.jopbBussiness1}>
            <img className={stylesclaims.formimgs} src='/bitmap.png' alt='' />
            <h3  className={stylesclaims.akxkx}>  
           Everlight Plumbing and Property Maintenance</h3>
          </div></div>
         }
         {params.slug=== 'proleak' && 
         <div className='leftmar'>
         <div className={stylesclaims.jopbBussiness1}>
            <img className={stylesclaims.formimgs} src='/cwscsc.png' alt='' />
            <h3  className={stylesclaims.akxkx}>  
           Proleak Plumbing and Leak Detection</h3>
          </div></div>
         }

        </div>

        <div className={stylesclaims.workerContainer}> <hr className='sideline'/>
        <h2 className='header2'> Workers</h2>
        
        {workers?.map((items,index)=>{
           const jobLength = recodedJobs?.filter(i => i.workers_on_job[0] === items.id)
          return(
            <div key={index} className={stylesclaims.workerContainer}>
            <Link href={`Business/Worker/${items.id}/${params.slug}`}>
              <div key={index}  className={stylesclaims.workerflex}>
                <h4 className='font1'>{items.name}</h4>
                <h6 className='font2 workersline'>|</h6>
                <div className={recodedJobs?.filter(i => i.workers_on_job[0] === items.id).length === 0 ? 'red': 'green'}>
                <p className='font2'>{jobLength.filter(i => i.status !== 'Closed').length}</p>
               </div>
              </div>
            </Link>
              
              {recodedJobs?.filter(i => i.workers_on_job[0] === items.id).filter(i => i.status !== 'Closed').map((i, index)=>{
              return(
              <Link href={`Business/SelectJob/${params.slug}/${i.id}`} key={index} >
                <div   className={stylesclaims.workersjobs}>
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
        {/* for update you going to have to change screens with {page ===1 && <></>} etc  */}
      <div className={stylesclaims.mainChanel}>

        <div className={ addtog ? stylesclaims.InitialForm : stylesclaims.noDis}>

        <p className={stylesclaims.exit}  onClick={()=> setAddTog(i => !i)} ><BiIcons.BiX/></p>
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
        
          <form className={stylesclaims.form} onSubmit={handleSubmit(theIntialForm)}>
        
        <div className='row'>
        <div className='row'>
          <h2 className ={stylesclaims.h2}>Client Name:</h2> 
          <input type='text' name='name' autoCorrect='true' required={true} {... register("client")}/>
         </div>
         
         <div className='row'>
          <h2 className ={stylesclaims.h2}>Client Address</h2>
          <input type='text' name='address' autoCorrect='true' required={true} {... register("address")}/>
         </div>  
         </div>

       

         <div className='row margin'> 
         <div className='row'>  
          <h2 className ={stylesclaims.h2}>Claim/Case No.:</h2>
          <input type='text' name='claimnumber' autoCorrect='true' required={true} {... register("clientnumber")}/>
         </div> 
         
         <div className='row'>
          <h2 className ={stylesclaims.h2}>Claim Provider:</h2>
          <input type='text' name='claimnumber' autoCorrect='true' required={true} {... register("clientprovider")}/>
         </div> 
         
         <div className='row'> 
          <h2 className ={stylesclaims.h2}>Claim Handler:</h2>
          <input type='text' name='claimnumber' autoCorrect='true' required={true} {... register("clienthandler")}/>
        </div> 

          <div className='row'>
          <h2 className ={stylesclaims.h2}>Excess:</h2>
          <input type='number' name='claimnumber' autoCorrect='true'  {... register("excess")}/>
          </div>
          </div>
<hr/><div className={stylesclaims.workerH}>
          <h4 className ={stylesclaims.h2}>Choose Worker</h4>

          <div className={stylesclaims.select}>
          <div className={stylesclaims.jobWorker} onClick={()=> setTog(i => !i)}>
                                <img className={stylesclaims.workericon} alt='worker' src='/work-character-solid-icon-illustration-office-workers-teachers-judges-police-artists-employees-free-vector.jpg'/>
                                <h4 className={stylesclaims.workerName}>{workname}</h4>
            </div>

            {tog && <div className={stylesclaims.workList}>
            {workers?.map((worker,index)=>{
            return(
              <div className={stylesclaims.option} onClick={()=> WorkerSelect(worker)} key={index}>
              <p>
                {worker.name}
              </p>
              
              </div>
            )
          })}</div>}
            
          </div>
          </div>
          <div className='row  margin'>
          <h2 className ={stylesclaims.h2}>Proximate Cause:</h2>
          <input type='text' name='claimnumber' autoCorrect='true' {... register("proximate_cause")}/>
          </div>

<div className='row'>
          <h2 className ={stylesclaims.h2}>Job Descrption</h2>
          <textarea type='text' name='damage report'  autoCorrect='true' {... register("job_description")}/>
</div>

        

          <button onClick={()=> setBusnu(Math.floor(Math.random() * 10000) + 100000)}  type='submit' className={stylesclaims.submitbtn}  >Submit Form</button>          
          </form>
        </div>

      <div className={stylesclaims.topToolbar}>
        <div className={stylesclaims.searchflex}>
        <h4 className={stylesclaims.searchname}>Search: </h4>
        <input name='searchbar' type='search' placeholder='Search client or claim number'/>
        </div>

        <div className={stylesclaims.filtercontainer} >
          <button className={stylesclaims.filterbtn} onClick={()=> setsorttog(i => !i)}>Filter <BiIcons.BiFilterAlt className='filtericon'/> </button>
          <ul className={sorttog ? stylesclaims.filterCont : stylesclaims.filterContnone}>
            {status.map((item,index)=> {
              return(
                <>
                  <li key={index} onClick={()=> ChangeFilter(item)}>{item}</li>
                </>
              )
            })}

          </ul>
          <div className={stylesclaims.filterblock}>
          </div>
        </div>

        <div className={stylesclaims.filtercontainer}>
          <button className={stylesclaims.filterbtn}> Sort <BsIcons.BsFilterLeft className='filtericon'/></button>
          <div className={stylesclaims.filterblock}>
          </div>
        </div>

        <button className={stylesclaims.addJobbtn} onClick={()=> setAddTog(i => !i)}>Add Job</button>
      </div>
          
            {filterdJobs?.filter(i=> i.status !== 'Closed').map((items,index)=>{
              const createdDate = new Date(items?.created)
              const createdDateIm = createdDate.getTime()
              const msDiff = todaysDateIm - createdDateIm
              const timeDiffD = Math.round(msDiff / (24 * 60 * 60 * 1000 )) 
              const hoursD = Math.round(msDiff / ( 60 * 60 * 1000 ))
              const weeksDiffD = Math.round(timeDiffD/7)
              
              return(
                
                  <div key={index} className={addtog ?stylesclaims.filterback  :stylesclaims.jobCardUrgant }>

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
                      <p className={stylesclaims.time}>
                               
                      { timeDiffD < 14 && timeDiffD > 7  ? <p>{weeksDiffD} Week ago</p> :timeDiffD > 7 ? <p>{weeksDiffD} Weeks ago</p> :  timeDiffD === 1 ? <p> Yesterday</p> : timeDiffD > 1 ? <p>{timeDiffD} Days ago</p> : hoursD===1 ? <p>{hoursD} Hour Ago</p> :  hoursD < 1 ? <p>Just Now</p> : <p>{hoursD} Hours Ago</p> }
                        
                                             </p>
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
                          <div className={stylesclaims.datclientnumberV}>
                              <h6 className={stylesclaims.messName}>{i.users_name}
                              <p className='itlaic'>
                                {items && createdDateM.getDate()  < 10 && createdDateM.getMonth()+1  < 10 ? <> 0{createdDateM.getDate()} / 0{createdDateM.getMonth()+1} / {createdDateM.getFullYear()} </>
                                             :  createdDateM.getDate() < 10 && createdDateM.getMonth()+1  > 10 ? <> 0{createdDateM.getDate()} / {createdDateM.getMonth()+1} / {createdDateM.getFullYear()} </>
                                             :   createdDateM.getDate() > 10 && createdDateM.getMonth()+1  < 10 ? <> {createdDateM.getDate()} / 0{createdDateM.getMonth()+1} / {createdDateM.getFullYear()} </>
                                             :    <> {createdDateM.getDate()} / {createdDateM.getMonth()+1} / {createdDateM.getFullYear()}</>
                                             }
                                  </p>

                              </h6>
                              <h6></h6>
                          </div>
                          { timeDiff < 14 && timeDiff > 7  ? <p>{weeksDiff} Week ago</p> :timeDiff > 7 ? <p>{weeksDiff} Weeks ago</p> :  timeDiff === 1 ? <p>{timeDiff} Yesterday</p> : timeDiff > 1 ? <p>{timeDiff} Days ago</p> : hours===1 ? <p>{hours} Hour Ago</p> :  hours < 1 ? <p>Just Now</p> : <p>{hours} Hours Ago</p> }

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
                      {addtog ? 
                      <button  className={stylesclaims.view}>
                       View 
                      </button>:
                       <Link href={`Business/SelectJob/${params.slug}/${items.id}`}> 
                      <button  className={stylesclaims.view}>
                       View 
                      </button>
                      </Link>
                      }
                      </div>
                        
                    </div>
                    
                </div>
                
                
              )
            })}

      </div>
  
        </div>

        </>
      }
        
      </>
    )
  }
  //  use Memo to prevent the the usestates to rerender everytime a state changes
  export default memo(Claims)