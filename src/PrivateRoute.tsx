import React, { FunctionComponent } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "./context/authContext";

// interface IPrivateRouteProps extends RouteProps {
//   // component: new (props: any) => React.Component;
//   component: any;
//   // any other props that come into the component
// }

// function PrivateRoute({ component: Component, ...rest }: IPrivateRouteProps) {
//   const isAuthenticated = useAuth();

//   return (
//     <Route
//       {...rest}
//       render={props =>
//         isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to="/" />
//         )
//       }
//     />
//   );
// }

interface IPrivateRouteProps extends RouteProps {
  path: string;
  exact: boolean;
  requiredRoles: Array<string>;
}

const PrivateRoute: FunctionComponent<IPrivateRouteProps> = (props) => {
  const { authContext } = useAuth();

  const isAllowed = () : boolean => {
    if (props.requiredRoles.length <= 0) {
      return true;
    } else {
      return authContext.roles.some(userRole => props.requiredRoles.indexOf(userRole) > -1);
    }

  }

  return (
    <Route path={props.path} exact={props.exact}>
      {isAllowed() === true ? props.children : <Redirect to="/" />}
    </Route>
  )
}

export default PrivateRoute;