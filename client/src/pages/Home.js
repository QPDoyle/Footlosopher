const Person = {
    name: "Joe Devine",
    src: "https://pbs.twimg.com/profile_images/1970602489142444032/jBYU5QiW_400x400.jpg",
    alt: "Joe Devine"
  }
  
function Avatar(props) {
    return <img src={props.src} alt={props.alt} />
}

function Home() {
    return (
      <div>
        <h1>Home</h1>
        <Avatar src={Person.src} alt={Person.alt} />
      </div>
      
    );
  }
  
  export default Home;