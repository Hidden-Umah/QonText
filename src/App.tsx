import "./style.css"
import Logo from "../public/QonText-Logo.png"

export default function App() {
  return (
    <div className="wrapper">

      <div className="header">
        <div className="logo">
          <img src={Logo} height={50} />
          <h1> <span style={{ color: '#434685ff'  }}>Q</span>onText</h1>
        </div>
        <div className="theme"></div>
      </div>


      <div className="holder">
        <div className="tools">
        </div>
      </div>


      <div className="workingArea">
        <div className="plugins"></div>
        <div className="paper"></div>
        <div className="plugins"></div>
      </div>


    </div>
  )
}
