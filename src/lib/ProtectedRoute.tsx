import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, requiredRole }) {
  // const router = useRouter();
  // const [userRole, setUserRole] = useState([])

  // console.log("EXPECTED ROLE : ", userRole[requiredRole])

  // function getUserRole() {
  //   const userData = localStorage?.userData;
  //   if (!userRole) {
  //     router.push("/authentication");
  //     return null;
  //   }
  //   setUserRole(JSON.parse(userData).expand.roleId.tasks);
  // }

  // useEffect(() => {
  //   getUserRole()
  // }, [userRole]);


  // if (!userRole[requiredRole]) {
  //   router.push("/");
  //   return null;
  // }
  return children;

}
