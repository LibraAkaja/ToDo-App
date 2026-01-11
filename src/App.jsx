import './App.css'
import removeIcon from "./assets/remove.svg"
import editIcon from "./assets/edit.png"
import { useState, useEffect } from 'react';

export default function ToDoApp() {
  const [tasks, setTask] = useState(()=>{
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks?JSON.parse(storedTasks):[];
  });
  const [noOfShownTasks, showThisMany] = useState(3);
  function addTask(task){
    setTask([...tasks, task]);
  }
  function showAll(){
    showThisMany(tasks.length - 1);
  }
  function showMore(){
    (noOfShownTasks == tasks.length-1)?
    showThisMany(noOfShownTasks):
    ((noOfShownTasks+4 > tasks.length-1)?showThisMany(noOfShownTasks+(tasks.length-1-noOfShownTasks)):showThisMany(noOfShownTasks+4));
  }
  function showLess(){
    (noOfShownTasks == tasks.length-1)?
    ((noOfShownTasks-4 < 4)?showThisMany(3):showThisMany(tasks.length-5)):
    ((noOfShownTasks-4 < 4)?showThisMany(noOfShownTasks-(noOfShownTasks-3)):showThisMany(noOfShownTasks-4));
  }
  function deleteAll(){
    setTask([]);
  }
  function deleteSpecific(index){
    setTask(tasks.filter((_,i)=> i!==index));
  }
  useEffect(()=>{
    localStorage.setItem("tasks",JSON.stringify(tasks));
  },[tasks]);
  return (
    <main style={{padding:'50px',display:'grid', justifyItems:'center', alignItems:'center', background: 'white', borderRadius: '0.5rem'}}>
      <Form addTask={addTask}/>
      <List tasks={tasks} deleteSpecific={deleteSpecific} noOfShownTasks={noOfShownTasks}/>
      <section style={{display:'flex', gap:'20px'}}>
        <Button label='See More Tasks' onclick={showMore} bgColor='#555555'/>
        <Button label='See All Tasks' onclick={showAll} bgColor='#555555'/>
        <Button label='See Less Tasks' onclick={showLess} bgColor='#555555'/>
        <Button label='Delete All Tasks' onclick={deleteAll} bgColor='#333333'/>
      </section>
    </main>
  );
}

function Form(props){
  const [text, setText] = useState("");
  function handleSubmit(e){
    e.preventDefault();
    if(!text.trim()) return;
    props.addTask(text);
    setText("");
  }
  return(
    <form style={{width:'auto', height:'auto'}} onSubmit={handleSubmit}>
      <fieldset style={{display: 'grid', gap:'5px', gridAutoFlow: 'column', borderLeft: 'none', borderRight: 'none', borderBottom: 'none'}}>
        <legend style={{fontSize:'31px', fontWeight:'800', marginBottom:'25px', transform: 'translateY(-5px)'}}>My ToDo App</legend>
        <input type='text' value={text} onChange={(e)=>setText(e.target.value)} placeholder='Click to add a new task' style={{padding:'8px', background:'none', width: '50ch'}}></input>
        <Button onclick={handleSubmit} label='Add New Task' type='submit'/>
      </fieldset>
    </form>
  );
}

function List(props){
  const [editableIndex, setEditableIndex] = useState(null);
  const [taskValues, setTaskValue] = useState([...props.tasks]);
  const handleChange = (index, e)=>{
    const newTasks = [...taskValues];
    newTasks[index] = e.target.value;
    setTaskValue(newTasks);
  };
  useEffect(()=>{
    localStorage.setItem("tasks",JSON.stringify([...taskValues]));
  },[taskValues]);
  return(
    <ul style={{display:'flex', flexDirection:'column'}}>
      {props.tasks.map((task,i)=>{
        const reverseIndex = props.tasks.length-i-1;
        const isEditing = (editableIndex === reverseIndex);
        return(
        <li key={reverseIndex} style={{
          display: `${i > props.noOfShownTasks? "none": "flex"}`,
          justifyContent: 'space-between',
          alignItems:'center'
          }}> 
            <input type='text' style={{all:'unset',width:'85%',fontSize:'larger',fontWeight:'490',textAlign:'left',color:'black',textOverflow:'ellipsis'}} 
              value={taskValues[reverseIndex]||props.tasks[reverseIndex]} readOnly={!isEditing} 
              onChange={(e)=>handleChange(reverseIndex,e)}
              onBlur={()=>setEditableIndex(null)}
              onKeyDown={(e)=>{
                if(e.key==='Enter'){
                  e.preventDefault();
                  setEditableIndex(null);
                }
              }}
            />
            <section style={{display:'flex',gap:'20px'}}>
              <img src={editIcon} width={22} style={{filter:isEditing?"grayscale(0)":"grayscale(0.6)", transition:'filter 0.6s ease'}}
                onClick={()=>setEditableIndex(isEditing?null:reverseIndex)}
              />
              <img src={removeIcon} width={22} onClick={()=>props.deleteSpecific(reverseIndex)}></img>
            </section>
        </li>
        );
      })}
    </ul>
  );
}

function Button(props){
  return(
    <button onClick={props.onclick} type={props.type} style={{backgroundColor:`${props.bgColor?props.bgColor:"auto"}`}}>{props.label}</button>
  );
}