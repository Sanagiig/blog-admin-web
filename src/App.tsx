import {useRoutes} from "react-router-dom";
import routers from "./routers";
import React, {useEffect, useState} from "react";
import {Provider} from "react-redux";
// import {testStore} from "@/store/index";
// import store from './components/test/store';
import store from "@/store";
import Loading from "./pages/loading";
import {useNavigate} from "react-router";
import {cookie2Obj} from "@/utils";
function App() {
  const Outlet = useRoutes(routers);
  const navigate = useNavigate()
  useEffect(() =>{
    const co = cookie2Obj(document.cookie);
    if(co.token){
      navigate("/home")
    }
  },[])
  return (
    <div className="App" style={{width: "100%", height: "100%"}}>
      <Provider store={store}>
        <React.Suspense fallback={<Loading />}>
          {Outlet}
        </React.Suspense>
      </Provider>
    </div>
  );
}

export default App;
