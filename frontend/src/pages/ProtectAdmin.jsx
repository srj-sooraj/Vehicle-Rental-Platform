import { Navigate } from "react-router-dom";

function ProtectedAdmin({children}){

const user = JSON.parse(localStorage.getItem("user"));

if(!user || user.role !== "admin"){
return <Navigate to="/login"/>
}

return children;

}

export default ProtectedAdmin;