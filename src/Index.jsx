import { Outlet } from "react-router-dom"
import Header from "./Components/Header"
import Footer from "./Components/Footer"
function Index() {

  return (
    <>
      <Header />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default Index