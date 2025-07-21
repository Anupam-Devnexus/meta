import Alluser from "../../../Components/Tables/AlluserTable";
import { useNavigate } from "react-router-dom";
export default function AllUsers() {
    const navigate = useNavigate();

    const handleNavigate =()=>{
        navigate("/admin-dashboard/users/add");
    }
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
        <button
        onClick={()=> handleNavigate()}
        className="px-4 py-2 bg-[var(--primary-color)] cursor-pointer hover:bg-blue-700 text-white font-medium rounded-full transition duration-200">
          Add New
        </button>
      </div>

      <Alluser />
    </div>
  );
}
