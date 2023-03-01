import { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";

export const authComponent = (WrappedComponent) => {
  console.log("TYPEOF ", typeof process.env.JWT_SECRET_CONFIG)
  const AuthComponent = (props) => {
    const router = useRouter();
    useEffect(() => {
      const authHeader = localStorage.getItem("authToken");
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        router.push("/authentication/login");
      } else {
        try {
          console.log("TOKEN: ",token)
          const decoded = jwt.verify(token, process.env.JWT_SECRET_CONFIG);
          props.user = decoded;
        } catch (err) {
          console.error(err);
          router.push("/authentication/login");
        }
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};
