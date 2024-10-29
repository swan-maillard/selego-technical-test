import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useSelector } from "react-redux";
import Loader from "../../components/loader";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  async function getDashboardData() {
    const { data } = await api.get("/dashboard");
    setDashboardData(data);
  }

  useEffect(() => {
    (async () => await getDashboardData())();
  }, []);

  if (!dashboardData) return <Loader />;

  const { activeProjectsCount, teamMembersCount, budget, bestWorkers } = dashboardData;

  return (
    <div className="px-2 md:!px-8 flex flex-col gap-5 mt-5">
      <div className="flex flex-col lg:flex-row gap-5">
        <StatsCards activeProjectsCount={activeProjectsCount} teamMembersCount={teamMembersCount} />
        <Budget budget={budget} />
      </div>

      <BestWorkers bestWorkers={bestWorkers} />
    </div>
  );
};

const StatsCards = ({ activeProjectsCount, teamMembersCount }) => {
  return (
    <div className="flex-1 grid grid-cols-2 gap-5">
      <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Active Projects</h2>
        <div className="mt-2 text-[24px] text-[#212325] font-semibold">{activeProjectsCount}</div>
      </div>
      <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Team Members</h2>
        <div className="mt-2 text-[24px] text-[#212325] font-semibold">{teamMembersCount}</div>
      </div>
    </div>
  );
};

const Budget = ({ budget }) => {
  return (
    <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Budget consumed this month</h2>
      <div className="mt-2 text-[24px] text-[#212325] font-semibold">{budget.toFixed(2)}€</div>
    </div>
  );
};

const BestWorkers = ({ bestWorkers }) => {
  return (
    <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Best Workers This Month</h2>
      <div className="max-h-60 overflow-y-auto">
        {bestWorkers.length > 0 ? (
          bestWorkers.map((worker) => (
            <div key={worker._id} className="flex items-center gap-3 py-2 border-b">
              <img src={worker.userAvatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm">
                  <span className="font-semibold">{worker.userName || "Unknown User"}</span> worked <span className="font-semibold">{worker.totalHours}h</span>
                </p>
                {worker.projects.length > 0 &&
                  worker.projects.map((project) => (
                    <p key={project.name} className="text-xs text-gray-500">
                      <span className="font-semibold">{project.hours}h</span> on <span className="font-semibold">{project.name}</span>
                    </p>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p className="italic text-gray-600">No data for this month.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
