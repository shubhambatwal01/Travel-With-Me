import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:1101/`);
      console.log(response.data)
      setUsers(response.data.users || []);
    };
    fetchData();
  }, []);

  return (
    <>
      <h1 className="text-center text-blue-500 text-5xl font-bold mt-4">
        Building Travel With Me
      </h1>
      {users.map((user) => (
        <div key={user.id}>
          <p>{user.user}</p>
        </div>
      ))}
    </>
  );
}

export default App;
