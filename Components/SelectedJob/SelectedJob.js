/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useState, useEffect, memo, useCallback } from 'react'
import pb from '@/Utilities/lib/pocketbase'
import IntialForm from '@/Utilities/hooks/IntialForm'
import stylesclaims from '../../app/sidebar.module.css'
import stylesseleJobs from '../../app/selectedJob.module.css'
import GetWorker from '@/Utilities/hooks/GetWorker';
import {set, useForm} from "react-hook-form";
import * as BsIcons from 'react-icons/bs'
import { data } from 'autoprefixer';
import GetMessages from '@/Utilities/hooks/GetMessages';
import * as BiIcons from 'react-icons/bi'
import SendMessage from '@/Utilities/hooks/SendMessage'
import LogIn from '@/Utilities/hooks/LogIn'
import Link from 'next/link'
import { images } from '@/next.config'

const status =[
   'Open' 
  ,'Quote Subimted' 
  ,'Invoice Subitted'
  ,'Repairs Authorised'
  ,'Repairs In Progress'
  ,'Await Certificate of Completion'
  ,'Repairs Done'
  ,'Closed'
  ,"Claim Reopened"
]



function Claims({params}) {
    const avatar = pb.authStore.model?.avatar  
    const id = pb.authStore.model?.id

    const [clientnumberV, setclientnumberV] = useState();
    const [eClientnumber, setEClientnumber] = useState(false);

    const [eWorker, setEWorker] = useState(false);
    const [eStatus, setEStatus] = useState(false);


  const [invoice, setInvoice] = useState();
  const [ invoiceName,  setInvoiceName] = useState();

  const [Quote, setQuote] = useState();
  const [ QuoteName,  setQuoteName] = useState();


  const [damage_report, setdamage_report] = useState();
  const [ damage_reportName,  setdamage_reportName] = useState();

  const [COC, setCOC] = useState();
  const [ COCName,  setCOCName] = useState();    

    const [clientV, setClientV] = useState();
    const [eclient, setEClient] = useState(false);

    const [addressV, setaddressV] = useState();
    const [eaddress, setEaddress] = useState(false);

    const [claimProviderV, setclaimProviderV] = useState();
    const [eclaimProvider, setEclaimProvider] = useState(false);

    const [excessV, setexcessV] = useState();
    const [eexcess, setEexcess] = useState(false);


    const [claimHandlerV, setclaimHandlerV] = useState();
    const [eclaimHandler, setEclaimHandler] = useState(false);

    const [jobDescriptionV, setjobDescriptionV] = useState();
    const [ejobDescription, setEjobDescription] = useState(false);

    const [ProminantCauseV, setProminantCauseV] = useState();
    const [eProminantCause, setEProminantCause] = useState(false);

    const [Loading, setLoading] = useState(true);

    const [workers, setworkers] = useState([]);

    const [ messeges, setMessages] = useState([]);
    const[seleJob, setSeleJob] = useState()
    const[filterdJobs, setFilterdJob] = useState([])
    const[urgant, setUrgant] = useState([])
    const[recodedJobs, setRecordedJobs] = useState([])
    const[competed, setCompleted] = useState([])

    const todaysDate = new Date()
    const todaysDateIm =todaysDate.getTime()

    const {register, handleSubmit, reset} = useForm();


    async function Filters() {
    
      const recordedJobs = await pb.collection('jobs').getFullList({
        '$autoCancel': false,
         sort: '-created',
            });
            setRecordedJobs(recordedJobs)
    
      const filter = recordedJobs?.filter(i => i.business === params.id[0] && i.job_completion === false)
       setFilterdJob(filter);

      const urgant = recordedJobs?.filter(i => i.urgant_job === true && i.business === params.id[0])
       setUrgant(urgant);

      const completed = recordedJobs?.filter(i => i.job_completion === true && i.business === params.id[0])
       setCompleted(completed);
       console.log(recodedJobs);

      
    }
    async function GetJob() {
      setLoading(i => true)
const recordedMess = await pb.collection('jobs').getOne(`${params.id[1]}`,{
        '$autoCancel': false,
        expand:""
    });
      setSeleJob(recordedMess)
      setLoading(i => false)


    }
    async function Message() {

      const recordedJobs = await pb.collection('notes').getFullList({
        '$autoCancel': false,
         sort: '-created',
            });
        setMessages(recordedJobs)
    
    }
    async function Workers() {
      setLoading(i => true)
      const recordedJobs = await pb.collection('workers').getFullList({
        '$autoCancel': false,
         sort: '-number_of_jobs',
            });
        setworkers(recordedJobs)
        setLoading(i => false)

        
    }

 
    
    pb.collection('jobs').subscribe( `${params.id[1]}`, function (e) {
      GetJob()
    },[]);
    pb.collection('workers').subscribe('*', function (e) {
    Workers()
    },[]);

 
    async function SendNotes(data){
    const record = await pb.collection('notes').create(
      {
        users_name:pb.authStore.model?.username,
        job:params.id[1],
        message:data?.noteMessage,
      }
    );
    }
    function SendNote(data){
      SendNotes(data)
      reset()
    
    }
  useEffect(()=>{
    Message()
      pb.collection('notes').subscribe('*', function (e) {
      Message()
    },[]);
  },[seleJob])

  useEffect(()=>{
    GetJob()
  
  },[]);
  
  
    async function MakeAfterImages(e){
    
  
    const formDataQuote = new FormData();
    for (let file of e.target.files) {
      formDataQuote.append('after_images', file);
    }
    const createdRecordQuote = await pb.collection('jobs').update(params.id[1], formDataQuote);
    }
    async function MakeBeforePictures(e){
    
  
    const formDataQuote = new FormData();
    for (let file of e.target.files) {
      formDataQuote.append('before_pictures', file);
    }
    const createdRecordQuote = await pb.collection('jobs').update(params.id[1], formDataQuote);
    }


    async function EditClientNumber(clientnumberV){  
      if(!clientnumberV){
          alert("Please fill in the New Client Number")
      }else{
        const data = {
          "clientnumber": clientnumberV,
      };
      const record = await pb.collection('jobs').update(params.id[1], data);
      setEClientnumber(false)
       
      }
    }
    async function EditClient(clientV){
      if(!clientV){ 
         alert("Please fill in the New Client")
      }
      else{
       const data = {
          "client": clientV,
        };
      const record = await pb.collection('jobs').update(params.id[1], data);
      setEClient(false)
      }
     
    }
    async function EditAddress(addressV){
      if(!addressV){
        alert("Please fill in the New Address")
         
      }
      else{
        const data = {
              "address": addressV,
            };
          const record = await pb.collection('jobs').update(params.id[1], data);
          setEaddress(false)
      }
         
    }
    async function EditClaimProvider(claimProviderV){
      if (!claimProviderV) {
        alert("Please fill in the New Claim Provider")
      }else{
        const data = { 
              "claim_provider": claimProviderV,
            };
          const record = await pb.collection('jobs').update(params.id[1], data);
          setEclaimProvider(false)
      }
          
    }
    async function EditclaimHandler(claimHandlerV){
      if (!claimHandlerV) {
        alert("Please fill in the New Claim Handler")
      } else {
          const data = {
                "claim_handler": claimHandlerV,
              };
            const record = await pb.collection('jobs').update(params.id[1], data);
            setEclaimHandler(false)
      }
          
    }
    async function EditjobDescription(jobDescriptionV){
      if (!jobDescriptionV) {
        alert("Please fill in the New Job Description")
      } else {
          const data = {
                "job_description": jobDescriptionV,
              };
            const record = await pb.collection('jobs').update(params.id[1], data);
            setEjobDescription(false)
      }
          
    }
    async function EditProminantCause(ProminantCauseV){
      if (!ProminantCauseV) {
        alert("Please fill in the Prominant Cause")
      } else {
          const data = {
                "excess_amount": ProminantCauseV,
              };
            const record = await pb.collection('jobs').update(params.id[1], data);
            setEProminantCause(false)
      }
          
    }
    async function EditExcess(excessV){
      if (!excessV) {
        alert("Please fill in the Excess")
      } else {
          const data = {
                "excess_amount": excessV,
              };
            const record = await pb.collection('jobs').update(params.id[1], data);
            setEexcess(false)
      }    
    }


  async function EditInvoice(invoice){
      
          if (!invoice) {
            alert("Please fill in the Invoice")
          } else {
      
        const formDataQuote = new FormData();
        for (let file of invoice) {
          formDataQuote.append('invoice', file);
        }
        const createdRecordQuote = await pb.collection('jobs').update(params.id[1], formDataQuote);
        }
  }

  async function EditQuote(Quote){
      
          if (!Quote) {
            alert("Please fill in the Quote")
          } else {
        const formDataQuote = new FormData();
        for (let file of Quote) {
          formDataQuote.append('quote', file);
        }
        const createdRecordQuote = await pb.collection('jobs').update(params.id[1], formDataQuote);
        }
  }

  async function Editdamage_report(damage_report){
      
        if (!damage_report) {
          alert("Please fill in the damage_report")
        } else {
      const formDatadamage_report = new FormData();
      for (let file of damage_report) {
        formDatadamage_report.append('damage_report', file);
      }
      const createdRecorddamage_report = await pb.collection('jobs').update(params.id[1], formDatadamage_report);
      }
  }

  async function EditCOC(COC){
      
      if (!COC) {
        alert("Please fill in the COC")
      } else {
    const formDataCOC = new FormData();
    for (let file of COC) {
      formDataCOC.append('coc', file);
    }
    const createdRecordCOC = await pb.collection('jobs').update(params.id[1], formDataCOC);
    }
  }


    async function setWorkers(item){
      const data = {
        "workers_on_job": [
          item.id
      ],
      };
    const record = await pb.collection('jobs').update(params.id[1], data);
    setEWorker(false)
  }
     async function setStatus(item){ 
      console.log("clicked");
      const data = {
        "status": item
      };
    const record = await pb.collection('jobs').update(params.id[1], data);
    setEStatus(false)
  }



async function DeletFileInvoice(){ 
    await pb.collection('jobs').update(params.id[1], {
      'invoice': null,
  });
  setInvoice()
   
}
async function DeletFileQuote(){ 
    await pb.collection('jobs').update(params.id[1], {
      'quote': null,
  });
  setQuote()
}
async function DeletFiledamage_report(){ 
    await pb.collection('jobs').update(params.id[1], {
      'damage_report': null,
  });
  setdamage_report()
}
async function DeletFileCOC(){ 
    await pb.collection('jobs').update(params.id[1], {
      'coc': null,
  });
  setCOC()
}
async function DeletEAF(items){
  await pb.collection('jobs').update(params.id[1], {
    'after_images-': items,
});
}
async function DeletEBF(items){
  await pb.collection('jobs').update(params.id[1], {
    'before_pictures-': items,
});
}

      const Excess = useCallback(() => {
        setEexcess(true)
            
      },[]);
      const ClientNumber = useCallback(() => {
          setEClientnumber(true)
      },[]);
      const Client = useCallback(() => {
          setEClient(true)
      },[]);
    const Address = useCallback(() => {
          setEaddress(true)
      },[]); 
    const ClaimProvider = useCallback(() => {
          setEclaimProvider(true)
      },[]);
    const ClaimHandler = useCallback(() => {
          setEclaimHandler(true)
      },[]);
    const JobDescription = useCallback(() => {
          setEjobDescription(true)
      },[]);
      const ProminantCause = useCallback(() => {
          setEProminantCause(true)
      },[]);
      const MakeWorker = useCallback(() => {
          setEWorker(i => !i)
      },[]);
      const MakeStatus = useCallback(() => {
          setEStatus(i => !i)
      },[]);
    
    function  MakeInvoice(e){
      setInvoice(e.target.files)
      setInvoiceName(e.target.files[0].name)

    }

    function  MakeQuote(e){
          setQuote(e.target.files)
          setQuoteName(e.target.files[0].name)

        }

    function  Makedamage_report(e){
          setdamage_report(e.target.files)
          setdamage_reportName(e.target.files[0].name)

        }

    function  MakeCOC(e){
          setCOC(e.target.files)
          setCOCName(e.target.files[0].name)

        }



  const createdDate = new Date(seleJob?.created)
  const createdDateIm = createdDate.getTime()
  const msDiff = todaysDateIm - createdDateIm
  const timeDiffD = Math.round(msDiff / (24 * 60 * 60 * 1000 )) 
  const hoursD = Math.round(msDiff / ( 60 * 60 * 1000 ))
  const weeksDiffD = Math.round(timeDiffD/7)

    return (
      <> 
      {Loading ? 
      <>
      <div className={stylesclaims.leftChanel}>
      <div className={stylesclaims.profilestation}>
        {/* add profilepic */}
          <div className={stylesclaims.avatarl}></div>
            <div className='loadname'></div>
           {params.id[0] === 'everlight' && 
           <div className='leftmar'>
         <div className={stylesclaims.jopbBussiness1}>
            <img className={stylesclaims.formimgs} src='/bitmap.png' alt='' />
            <h3  className={stylesclaims.akxkx}>  
           Everlight Plumbing and Property Maintenance</h3>
          </div></div>
         }
         {params.id[0]=== 'proleak' && 
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


        <div >

        </div>
      </div> 
      <div className={stylesseleJobs.JobContainer}>
      <div className={stylesclaims.headerload}></div>
      <div className={stylesclaims.bodyload}></div>

      </div>
      </> 
      : 
      <>
 <>
  {seleJob && 
       
        <div className={ stylesseleJobs.JobContainer}>
         <div className={stylesseleJobs.header}>
         <div className={stylesseleJobs.workerCont} tabIndex="0" onBlur={()=> setEWorker(false)}>
              {workers?.filter(i => i.id === seleJob.workers_on_job[0]).map((i,index)=>{
                    return(
                      <div className={stylesclaims.jobWorker}  key={index} onClick={()=> MakeWorker()}>
                          <img className={stylesclaims.workericon} alt='worker' src='/work-character-solid-icon-illustration-office-workers-teachers-judges-police-artists-employees-free-vector.jpg'/>
                          <h4 className={stylesclaims.workerName}>{i.name}</h4>
                      </div>
                    ) 
                })}

               {eWorker &&  <div className={stylesseleJobs.chooseW}>
                   {workers?.map((item, index)=>{
                  return(
                    <div className={stylesclaims.jobWorkersele} key={index} onClick={()=> setWorkers(item)}>
                          <img className={stylesclaims.workericon} alt='worker' src='/work-character-solid-icon-illustration-office-workers-teachers-judges-police-artists-employees-free-vector.jpg'/>
                          <h4 className={stylesclaims.workerName}>{item.name}</h4>
                      </div>
                  )                 
                })}
                </div>
                }
               
                </div>
                
                  <div>
                  <div className={stylesseleJobs.status}  tabIndex='0'
                  onBlur={()=> setEStatus(false)}
                  >
                    <h2>Status: </h2> 
                    <div className={stylesseleJobs.statusList}>
                       <p className={stylesseleJobs.statusListp}  onClick={()=> MakeStatus()}>{seleJob.status}</p> 
                       
                       { eStatus &&
                     <div className={stylesseleJobs.selectCont}>
                    {status.map((item, index)=>{
                      return(
                        <p  className={stylesseleJobs.statusListp} key={index} onClick={()=> setStatus(item)}> {item}</p>
                      )
                    })}
                   </div>
                  }
                  </div>
                  </div>
                  </div>
                 
                               
                  { timeDiffD < 14 && timeDiffD > 7  ? <p>{weeksDiffD} Week ago</p> :timeDiffD > 7 ? <p>{weeksDiffD} Weeks ago</p> :  timeDiffD === 1 ? <p> Yesterday</p> : timeDiffD > 1 ? <p>{timeDiffD} Days ago</p> : hoursD===1 ? <p>{hoursD} Hour Ago</p> :  hoursD < 1 ? <p>Just Now</p> : <p>{hoursD} Hours Ago</p> }
                       
         </div>

         {seleJob.business === 'everlight' && 
         <div className={stylesclaims.jopbBussiness1}>
            <img className={stylesclaims.formimgs} src='/bitmap.png' alt='' />
            <h3  className={stylesclaims.akxkx}>  
           Everlight Plumbing and Property Maintenance</h3>
          </div>
         }
         {seleJob.business=== 'proleak' && 
         <div className={stylesclaims.jopbBussiness1}>
            <img className={stylesclaims.formimgs} src='/cwscsc.png' alt='' />
            <h3  className={stylesclaims.akxkx}>  
           Proleak Plumbing and Leak Detection</h3>
          </div>
         }
          
          
         <div>
         

              <div className={stylesseleJobs.detailsflex}>
                       <div className={stylesclaims.clientDetals}>
                              <div className={stylesseleJobs.clientrow}>
                              {eclient? 
                                <BiIcons.BiX className={stylesseleJobs.cancel} title='Cancel' onClick={() => setEClient(false)}/>
                                 :
                                 <BiIcons.BiEdit title='Edit Client' className={stylesseleJobs.edit} onClick={()=> Client() }/>}<h5 className={stylesseleJobs.clienttitels}>Client:</h5> 
                                      {eclient? 
                                        <div>
                                          <input defaultValue={seleJob.client} className={stylesseleJobs.editvalue} type='text' placeholder='New Client' onChange={(e) => setClientV(e.target.value)}/> 
                                          <BiIcons.BiCheck className={stylesseleJobs.submitedit} title='Submit Edit' onClick={()=> EditClient(clientV)}/>
                                        </div> : 
                                    <p>{seleJob.client}</p>
                                        
                                        }
                              
                              </div>
 
                              <div className={stylesseleJobs.clientrow}> 
                                  {eaddress? 
                                <BiIcons.BiX className={stylesseleJobs.cancel} title='Cancel' onClick={() => setEaddress(false)}/>
                                 :
                                 <BiIcons.BiEdit title='Edit Address' className={stylesseleJobs.edit} onClick={()=> Address() }/>}<h5 className={stylesseleJobs.clienttitels}>Address:</h5> 
                                      {eaddress? <div><input defaultValue={seleJob.address} className={stylesseleJobs.editvalue} type='text' placeholder='New Address' onChange={(e) => setaddressV(e.target.value)}/> 
                                      <BiIcons.BiCheck className={stylesseleJobs.submitedit} title='Submit Edit' onClick={()=> EditAddress(addressV)}/></div> :
                                      
                                     <p>{seleJob.address}</p>}
                                       
                              
                             
                              </div>

                              <div className={stylesseleJobs.clientrow}>
                              {seleJob.business === 'everlight' &&   <><h5 className={stylesseleJobs.clienttitels}>Issue No.:</h5> <p>{seleJob.business_number}</p></>}
                                
                              {seleJob.business === 'proleak' &&   <><h5 className={stylesseleJobs.clienttitels}>Issue No.:</h5> <p>{seleJob.business_number}</p></>}
                              </div>

                              <div className={stylesseleJobs.clientrow}>
                                <h5 className={stylesseleJobs.clienttitels}>Created Date:</h5> 

                                <p>
                                {seleJob && createdDate.getDate()  < 10 && createdDate.getMonth()+1  < 10 ? <> 0{createdDate.getDate()} / 0{createdDate.getMonth()+1} / {createdDate.getFullYear()} </>
                                             :  createdDate.getDate() < 10 && createdDate.getMonth()+1  > 10 ? <> 0{createdDate.getDate()} / {createdDate.getMonth()+1} / {createdDate.getFullYear()} </>
                                             :   createdDate.getDate() > 10 && createdDate.getMonth()+1  < 10 ? <> {createdDate.getDate()} / 0{createdDate.getMonth()+1} / {createdDate.getFullYear()} </>
                                             :    <> {createdDate.getDate()} / {createdDate.getMonth()+1} / {createdDate.getFullYear()}</>
                                             }
                                             </p>
                              </div>

                                  <hr className='sele'/>

                              <div className={stylesseleJobs.clientrow}>
                                {eClientnumber? 
                                <BiIcons.BiX className={stylesseleJobs.cancel} title='Cancel' onClick={() => setEClientnumber(false)}/>
                                 :
                                 <BiIcons.BiEdit title='Edit Claim Number' className={stylesseleJobs.edit} onClick={()=> ClientNumber() }/>}<h5 className={stylesseleJobs.clienttitels}>Claim/Case No.:</h5> 
                                      {eClientnumber? 
                                      <div>
                                      <input defaultValue={seleJob.clientnumber} className={stylesseleJobs.editvalue} type='text' placeholder='New Client Number' onChange={(e) => setclientnumberV(e.target.value)}/>
                                       <BiIcons.BiCheck className={stylesseleJobs.submitedit} title='Submit Edit' onClick={()=> EditClientNumber(clientnumberV)}/>
                                       </div> : 

                                   
                                       <p>{seleJob.clientnumber}</p>}
                              </div>

                             
                              <div className={stylesseleJobs.clientrow}>
                                {eclaimProvider? 
                                <BiIcons.BiX className={stylesseleJobs.cancel} title='Cancel' onClick={() => setEclaimProvider(false)}/>
                                 :
                                 <BiIcons.BiEdit title='Edit Claim Provider' className={stylesseleJobs.edit} onClick={()=> ClaimProvider() }/>
                                 }
                                 
                                 <h5 className={stylesseleJobs.clienttitels}>Claim Provider:</h5> 
                                      {eclaimProvider? 
                                      <div>
                                      <input defaultValue={seleJob.claim_provider} className={stylesseleJobs.editvalue} type='text' placeholder='New Claim Provider' onChange={(e) => setclaimProviderV(e.target.value)}/>
                                       <BiIcons.BiCheck className={stylesseleJobs.submitedit} title='Submit Edit' onClick={()=> EditClaimProvider(claimProviderV)}/>
                                       </div> : 

                                      
                                       <p>{seleJob.claim_provider}</p>}
                              
                             </div>

                              <div className={stylesseleJobs.clientrow}>
                                      {eexcess?
                                       <BiIcons.BiX className={stylesseleJobs.cancel} title='Cancel' onClick={() => setEexcess(false)}/>
                                              :
                                        <BiIcons.BiEdit title='Edit Claim Provider' className={stylesseleJobs.edit} onClick={()=> Excess() }/>
                                        
                                      }
                                    <h5 className={stylesseleJobs.clienttitels}>Excess:</h5> 
                                    <div>
                                     {

                                      eexcess ? 


                                      <div className={stylesseleJobs.numbertext}>
                                      R<input className={stylesseleJobs.editnumber} type='number' placeholder='New  Excess' onChange={(e) => setexcessV(e.target.value)}/>
                                      <BiIcons.BiCheck className={stylesseleJobs.submitedit} title='Submit Edit' onClick={()=> EditExcess(excessV)}/>
                                      </div> : 
                                    
                                      seleJob.excess_amount === 0 ? <p>No Applicable Excess</p> : <p>R {seleJob.excess_amount}</p>
                                      
                                      }
                                    </div>
                              </div>

                              <div className={stylesseleJobs.clientrow}>
                              {eclaimHandler? 
                                <BiIcons.BiX className={stylesseleJobs.cancel} title='Cancel' onClick={() => setEclaimHandler(false)}/>
                                 :
                                 <BiIcons.BiEdit title='Edit Claim Provider' className={stylesseleJobs.edit} onClick={()=> ClaimHandler() }/>}<h5 className={stylesseleJobs.clienttitels}>Claim Handler:</h5> 
                                      {eclaimHandler?
                                       <div>
                                       <input  defaultValue={seleJob.claim_handler} className={stylesseleJobs.editvalue} type='text' placeholder='New Claim Provider' onChange={(e) => setclaimHandlerV(e.target.value)}/>
                                      <BiIcons.BiCheck className={stylesseleJobs.submitedit} title='Submit Edit' onClick={()=> EditclaimHandler(claimHandlerV)}/>
                                      </div> : 
                                      claimHandlerV ? <p>{claimHandlerV}</p> :
                                      <p>{seleJob.claim_handler}</p>}
                              
                              </div>

                               <div className={stylesseleJobs.clientrow}>
                              {eProminantCause? 
                                <BiIcons.BiX className={stylesseleJobs.cancel} title='Cancel' onClick={() => setEProminantCause(false) }/>
                                 :
                                 <BiIcons.BiEdit title='Edit Claim Provider' className={stylesseleJobs.edit} onClick={()=> ProminantCause() }/>}<h5 className={stylesseleJobs.clienttitels}>Proximate Cause:</h5> 
                                      {eProminantCause?
                                       <div>
                                       <input  defaultValue={seleJob.proximate_cause} className={stylesseleJobs.editvalue} type='text' placeholder='New Proximate Cause' onChange={(e) => setProminantCauseV(e.target.value)}/>
                                      <BiIcons.BiCheck className={stylesseleJobs.submitedit} title='Submit Edit' onClick={()=> EditProminantCause(ProminantCauseV)}/>
                                      </div> : 
                                   
                                      <p>{seleJob.proximate_cause}</p>}
                              
                              </div>
                              
                          <div className={stylesseleJobs.jobDescription}>


                          {ejobDescription? 
                                <BiIcons.BiX className={stylesseleJobs.cancel} title='Cancel' onClick={() => setEjobDescription(false)}/>
                                 :
                                 <BiIcons.BiEdit title='Edit Claim Provider' className={stylesseleJobs.edit} onClick={()=> JobDescription() }/>}<h5 className={stylesseleJobs.job_description}>Job Description:</h5> 
                                      {ejobDescription?
                                       <div className={stylesseleJobs.dessave}>
                                       <textarea className={stylesseleJobs.edittext} type='text' placeholder='New Job Description' onChange={(e) => setjobDescriptionV(e.target.value)}/>
                                      <button className={stylesseleJobs.submittext} title='Submit Edit' onClick={()=> EditjobDescription(jobDescriptionV)}> Save </button>
                                      </div> : 
                                    
                                      <p className={stylesseleJobs.desP}>{seleJob.job_description}</p>}
                          </div>
                        </div>

                          <div className={stylesseleJobs.messageContainer}>
                          <h5>Notes:</h5>
                          <div className={stylesseleJobs.messScroll}>
                          {messeges?.filter(i => i.job === seleJob.id).map((i,index)=>{
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
                                {seleJob && createdDateM.getDate()  < 10 && createdDateM.getMonth()+1  < 10 ? <> 0{createdDateM.getDate()} / 0{createdDateM.getMonth()+1} / {createdDateM.getFullYear()} </>
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
                  })}</div>

                          
                          <form onSubmit={handleSubmit(SendNote)}><div className={stylesseleJobs.sendMessege}>
                            <textarea type='text' required={true} onChange={(e)=> setClear(e.target.value)}  placeholder='Type Note' {... register("noteMessage")}/>
                            <button type='submit' className={stylesseleJobs.send}><BiIcons.BiMessageAltAdd className='btn'/></button>
                          </div></form>
                          </div>
                          
                        
              </div>
                    <div className={stylesseleJobs.line}></div>
              <div className={stylesseleJobs.flexQuote}>
                  <div className={stylesseleJobs.fileInsert}>
                    <h2>Invoice</h2>

                    {seleJob.invoice.length === 1 ? 
                    
                    <div className={stylesseleJobs.fileCont}>
                   
                      <Link target="_blank"
                       href={`http://127.0.0.1:8090/api/files/${seleJob.collectionId}/${seleJob.id}/${seleJob.invoice[0]}?token=`
                       } 
                      
                      className={stylesseleJobs.trufile}
                       ><div title={seleJob.invoice[0]}><BsIcons.BsFiles className={stylesseleJobs.icons}/> {seleJob.invoice[0]}</div>
                       </Link>
                      <p className={stylesseleJobs.fileX} onClick={()=> DeletFileInvoice()}><BsIcons.BsX/></p>
                    </div>
                    :
                    <form className={stylesseleJobs.Add}>
                    <div>
                    {invoice && 
                    <button className={stylesseleJobs.fileXon} type='reset' onClick={() => setInvoice()} ><BsIcons.BsX/></button>
                    }
                    <div className={stylesseleJobs.addfile}>
                      <label className={stylesseleJobs.addfilel} htmlFor="invoice" style={{display:'flex',flexDirection:'column'}}>
                     {invoice ? <p className={stylesseleJobs.inp}>{invoiceName}</p>: <>+ Add Invoice</> }
                     
                      
                      <input draggable={true} type='file' className={stylesseleJobs.padddIn} id='invoice' onChange={(e) => MakeInvoice(e)}/>
                    </label>
                    </div>
                    </div>
                      {invoice && <p className={stylesseleJobs.filebtn} onClick={()=> EditInvoice(invoice)}>Save</p>}

                    </form>
                    
                    }
                    
                    
                  </div>
                  <div className={stylesseleJobs.fileInsert}>
                    <h2>Quote</h2>
                    
                     {seleJob.quote.length === 1 ? 
                    
                    <div className={stylesseleJobs.fileCont}>
                   
                       <Link target="_blank" href={`http://127.0.0.1:8090/api/files/${seleJob.collectionId}/${seleJob.id}/${seleJob.quote[0]}?token=`} 
                       
                       className={stylesseleJobs.trufile}
                       >
                       <div  title={seleJob.quote[0]}><BsIcons.BsFiles className={stylesseleJobs.icons}/> {seleJob.quote[0]}</div>
                       </Link>
                       <p className={stylesseleJobs.fileX} onClick={()=> DeletFileQuote()}><BsIcons.BsX/></p>
                    </div>
                    :

                    <form className={stylesseleJobs.Add}>
                    <div>
                    {Quote && 
                    <button className={stylesseleJobs.fileXon} type='reset' onClick={() => setQuote()} ><BsIcons.BsX/></button>
                    }
                    <div className={stylesseleJobs.addfile}>
                      <label className={stylesseleJobs.addfilel} htmlFor="Quote">
                     {Quote ? <p className={stylesseleJobs.inp}>{QuoteName}</p>: <>+ Add Quote</> }
                     
                      
                      <input type='file' style={{display:'none'}} id='Quote' onChange={(e) => MakeQuote(e)}/>
                    </label>
                    </div>
                    </div>
                      {Quote && <p className={stylesseleJobs.filebtn} onClick={()=> EditQuote(Quote)}>Save</p>}

                    </form>
                    
                    }
                    
                  </div>
                  <div className={stylesseleJobs.fileInsert}>
                    <h2>Damage Report</h2>
                    
                    {seleJob.damage_report.length === 1 ? 
                    
                    <div className={stylesseleJobs.fileCont}>
                   
                      <Link target="_blank" href={`http://127.0.0.1:8090/api/files/${seleJob.collectionId}/${seleJob.id}/${seleJob.damage_report[0]}?token=`} 
                      
                      className={stylesseleJobs.trufile}
                      > <div  title={seleJob.damage_report[0]}><BsIcons.BsFiles className={stylesseleJobs.icons}/> {seleJob.damage_report[0]}</div>
                      </Link>
                      <p className={stylesseleJobs.fileX} onClick={()=> DeletFiledamage_report()}><BsIcons.BsX/></p>
                    </div>
                    :

                    <form className={stylesseleJobs.Add}>
                    <div>
                    {damage_report && 
                    <button className={stylesseleJobs.fileXon} type='reset' onClick={() => setdamage_report()} ><BsIcons.BsX/></button>
                    }
                    <div className={stylesseleJobs.addfile}>
                      <label className={stylesseleJobs.addfilel} htmlFor="damage_report">
                     {damage_report ? <p className={stylesseleJobs.inp}>{damage_reportName}</p>: <>+ Add Report</> }
                     
                      
                      <input type='file' style={{display:'none'}} id='damage_report' onChange={(e) => Makedamage_report(e)}/>
                    </label>
                    </div>
                    </div>
                      {damage_report && <p className={stylesseleJobs.filebtn} onClick={()=> Editdamage_report(damage_report)}>Save</p>}

                    </form>
                    
                    }

                  </div>
                  <div className={stylesseleJobs.fileInsert}>
                    <h2>COC</h2>
                    {seleJob.coc.length === 1 ? 
                    
                    <div className={stylesseleJobs.fileCont}>
                   
                      <Link target="_blank" href={`http://127.0.0.1:8090/api/files/${seleJob.collectionId}/${seleJob.id}/${seleJob.coc[0]}?token=`} 
                      
                      className={stylesseleJobs.trufile}
                      >
                      <div  title={seleJob.coc[0]}><BsIcons.BsFiles className={stylesseleJobs.icons}/> {seleJob.coc[0]}</div>
                       </Link>
                      <p className={stylesseleJobs.fileX} onClick={()=> DeletFileCOC()}><BsIcons.BsX/></p>
                    </div>
                    :

                    <form className={stylesseleJobs.Add}>
                    <div>
                    {COC && 
                    <button className={stylesseleJobs.fileXon} type='reset' onClick={() => setCOC()} ><BsIcons.BsX/></button>
                    }
                    <div className={stylesseleJobs.addfile}>
                      <label className={stylesseleJobs.addfilel} htmlFor="COC">
                     {COC ? <p className={stylesseleJobs.inp}>{COCName}</p>: <>+ Add Report</> }
                     
                      
                      <input type='file' style={{display:'none'}} id='COC' onChange={(e) => MakeCOC(e)}/>
                    </label>
                    </div>
                    </div>
                      {COC && <p className={stylesseleJobs.filebtn} onClick={()=> EditCOC(COC)}>Save</p>}

                    </form>
                    
                    }
                    
                  </div>
                  
              
              </div>

                    <div> 
                      <div className={stylesseleJobs.beforeContainer}>
                      <h3>Before Images</h3>
                      <div className={stylesseleJobs.imgCont}>
                           {seleJob.before_pictures.length > 0 ? 
                           
                           seleJob.before_pictures.map((items,index)=>{
                            
                            return(
                              <div key={index} className={stylesseleJobs.photo}>
                              <p className={stylesseleJobs.DelIm}><BiIcons.BiX onClick={()=> DeletEBF(items)}/></p>
                                <div className={stylesseleJobs.photoCont}>
                                      <img className={stylesseleJobs.bImges}
                                      src={`http://127.0.0.1:8090/api/files/${seleJob.collectionId}/${seleJob.id}/${items}?token=`}/>
                                                                    
                                </div>
                                <p className={stylesseleJobs.titleImg}>
                                      {items}
                                </p>
                              </div>
                                  )
                           }) 
                           : 
                             <div className={stylesseleJobs.addMisImges}>
                              <label htmlFor='after_images' >
                              <p className={stylesseleJobs.addIm}>+ Add Before Images</p>
                                
                                <input type='file' style={{display:'none'}} multiple={true} id='after_images' onChange={(e) => MakeBeforePictures(e)}/>
                              </label>
                            </div>
                           } 
                        </div>
                      </div>

                      <div className={stylesseleJobs.beforeContainer}>
                      <h3>After Images</h3>
                         <div className={stylesseleJobs.imgCont}>
                           {seleJob.after_images.length > 0 ? 
                           
                           seleJob.after_images.map((items,index)=>{
                            
                            return(
                              <div key={index} className={stylesseleJobs.photo}>
                              <p className={stylesseleJobs.DelIm}><BiIcons.BiX onClick={()=> DeletEAF(items)}/></p>
                                <div className={stylesseleJobs.photoCont}>
                                      <img className={stylesseleJobs.bImges}
                                      src={`http://127.0.0.1:8090/api/files/${seleJob.collectionId}/${seleJob.id}/${items}?token=`}/>
                                                                    
                                </div>
                                <p className={stylesseleJobs.titleImg}>
                                      {items}
                                </p>
                              </div>
                                  )
                           }) 
                           : 
                             <div className={stylesseleJobs.addMisImges}>
                              <label htmlFor='after_images' >
                              <p className={stylesseleJobs.addIm}>+ Add After Images</p>
                                
                                <input type='file' style={{display:'none'}} multiple={true} id='after_images' onChange={(e) => MakeAfterImages(e)}/>
                              </label>
                            </div>
                           } 
                        </div>
                      </div>

                    </div>

         </div>
        </div>
       }

        <div className={stylesclaims.maincontainer}>
        <div className={stylesclaims.leftChanel}>
        <div className={stylesclaims.profilestation}>
        {/* add profilepic */}
          <img className={stylesclaims.avatar} src={`http://127.0.0.1:8090/api/files/_pb_users_auth_/${id}/${avatar}?token=`}/>
           <h2>{pb.authStore.model.name}</h2>
           {params.id[0] === 'everlight' && 
           <div className='leftmar'>
         <div className={stylesclaims.jopbBussiness1}>
            <img className={stylesclaims.formimgs} src='/bitmap.png' alt='' />
            <h3  className={stylesclaims.akxkx}>  
           Everlight Plumbing and Property Maintenance</h3>
          </div></div>
         }
         {params.id[0]=== 'proleak' && 
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
        {/* to list the jobs that the workers are currently working on you map in this map with a fil
        filter that shows the jobs with the same id as the worker
        e.g fillter* i.id === filterdJobs.worker.id if this works it should hopefully
         */}
          {workers?.map((items,index)=>{
        
            return(
              <div key={index} className={stylesclaims.workerContainer}>
              <Link href={`Business/Worker/${items.id}/${params.id[0]}`}>
                <div key={index}  className={stylesclaims.workerflex}>
                  <h4 className='font1'>{items.name}</h4>
                  <h6 className='font2 workersline'>|</h6>
                  <div className={recodedJobs?.filter(i => i.workers_on_job[0] === items.id).length === 0 ? 'red': 'green'}>
                  <p className='font2'>{recodedJobs?.filter(i => i.workers_on_job[0] === items.id).length}</p>
                  </div>
                </div>
              </Link>
                
               {recodedJobs?.filter(i => i.workers_on_job[0] === items.id).map((i, index)=>{
                return(
                  <Link href={`Business/SelectJob/${params.id[0]}/${i.id}`} key={index} >
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
        
        <div className={stylesclaims.urgantJobs}>
         <hr className='sideline'/>
        <h2 className='header2'>Urgent Jobs</h2>
          {urgant?.map((items,index)=>{
            return(
                <div key={index}  className={stylesclaims.JobsList}>
                  <h4 className='font1'>{items.client}</h4>
                  <h5 className='font2'>{items.clientnumber}</h5>
                  <h6 className='font2'>{items.address}</h6>
                </div>
            )
          })}

        </div>

        <div className={stylesclaims.doneJobs}>
         <hr className='sideline'/>
        <h2 className='header2'>Completed Jobs</h2>
        <div className={stylesclaims.finishedJobsList}>
           {competed?.map((items,index)=>{
            return(
                <div key={index}  className={stylesclaims.finishedJobs}>
                  <h4 className='font1'>{items.client}</h4>
                  <h5 className='font2'>{items.clientnumber}</h5>
                  <h6 className='font2'>{items.address}</h6>
                </div>
            )
          })}
        </div>
         

        </div>

       
        </div>
        {/* for update you going to have to change screens with {page ===1 && <></>} etc  */}
        
        

        <div className={stylesseleJobs.mainChanel}>

      


<div style={{filter:'blur(3px)'}} className={stylesclaims.topToolbar}>
<div className={stylesclaims.searchflex}>
<h4 className={stylesclaims.searchname}>Search: </h4>
<input name='searchbar' type='search' placeholder='Search client or claim number'/>
</div>

<div className={stylesclaims.filtercontainer}>
  <button className={stylesclaims.filterbtn}>Sort <BsIcons.BsFilterLeft className='filtericon'/> </button>
  <ul className={stylesclaims.filterCont}>
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
  <button className={stylesclaims.filterbtn}>Filter <BiIcons.BiFilterAlt className='filtericon'/> </button>
  <div className={stylesclaims.filterblock}>
  </div>
</div>

<button className={stylesclaims.addJobbtn} onClick={()=> setAddTog(i => !i)}>Add Job</button>
</div>
  
    {filterdJobs?.map((items,index)=>{
      const createdDate = new Date(items.created)
      const createdDateIm = createdDate.getTime()
      const msDiff = todaysDateIm - createdDateIm
      const timeDiff = Math.round(msDiff / (24 * 60 * 60 * 1000 )) 
      
      return(
        
          <div key={index} className={stylesclaims.filterback }>

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
              </button>:
              
              <button  className={stylesclaims.view}>
               View 
              </button>

              
             
              
              </div>
                
            </div>
            
        </div>
        
        
      )
    })}

</div>

  
        </div>
 </>
      </>
      }
     
       </>

    )
  }
  //  use Memo to prevent the the usestates to rerender everytime a state changes
  export default memo(Claims)
 