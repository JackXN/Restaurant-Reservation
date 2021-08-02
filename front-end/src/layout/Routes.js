import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import NewReservation from "../components/NewReservation";
import { today } from "../utils/date-time";
import NewTable from "../components/NewTable";
import SeatReservation from "../components/SeatReservation";
import Search from "../components/Search"
import Edit from "../components/EditReservations"


/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */


function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact path="/reservations/new">
        <NewReservation />
      </Route>
      <Route  path="/tables/new">
        <NewTable />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route path = "/search">
        <Search/>
      </Route>
      <Route path ="/reservations/:reservation_id/edit">
        <Edit/>
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;