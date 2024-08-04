import React from "react";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import { Helmet } from "react-helmet";

const Dashboard = () => {
  return (
    <>
      <BusinessSideBarPage>
        <Helmet>
          <title>WorkGuru - Dashboard</title>
        </Helmet>
        <h1>Dashboard</h1>
      </BusinessSideBarPage>
    </>
  );
};

export default Dashboard;
