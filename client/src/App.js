import React, {useEffect, useState} from 'react'
import './App.css';



const Person = {
  name: "Joe Devine", 
  src: "https://pbs.twimg.com/profile_images/1970602489142444032/jBYU5QiW_400x400.jpg",
  alt: "Joe Devine"
}

function Avatar(props) {
  return(<img src={props.src} alt={props.alt}/>)
}

function App() {
  const [backendData, setBackendData] = useState([{}])
  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])
  return (
    <div>
      <Avatar src={Person.src} alt={Person.alt} />
      {(typeof backendData.users === 'undefined') ? (
        <p>Loading...</p>
      ) : (
        backendData.users.map((user, i) => (
          <p key={i}>{user}</p>
        ))
      )}
    </div>
  )
}

export default App