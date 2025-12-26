import userApi from "api/userApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import User from "./components/User";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Tochuc = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { page: 1, size: 12 };
        const { data: teamData } = await userApi.getAllTeams(params);
        console.log("Respone: ", teamData);
        setTeam(Array.isArray(teamData) ? teamData : []);
        setLoading(false);
      } catch (error) {
        console.log("Không lấy được dữ liệu", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <h3>Bộ máy tổ chức</h3>
      <br />
      <ul className="team-list">
        {loading && <li>Loading...</li>}
        {team.map((pt) => {
          const { id, name, slogan, member } = pt;
          return (
            <li className="team-items" key={id}>
              <h4>{name}</h4>
              <p>{slogan}</p>
              <div>
                <ul className="user-container">
                  {member?.map((id) => (
                    <User id={id} />
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default Tochuc;
