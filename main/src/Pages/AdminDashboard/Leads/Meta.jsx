import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Data from "../../../Datastore/MetaData.json";
import "react-resizable/css/styles.css";
import { useNavigate } from "react-router-dom";

export default function Meta() {
  const [leads, setLeads] = useState(Data?.leads || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const navigate = useNavigate();

  const itemsPerPage = 10;
  const leadFields = ["created_time", "created_at"];

  const leadFieldHeaders = leadFields.map(field =>
    field.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  );

  const allFieldKeys = leads[0] ? Object.keys(leads[0].AllFields) : [];
  const allFieldHeaders = allFieldKeys.map(
    key => key.charAt(0).toUpperCase() + key.slice(1)
  );

  const headers = ["ID", ...leadFieldHeaders, ...allFieldHeaders, "Action"];

  const rows = leads.map((lead) => {
    const id = lead._id;
    const leadFieldValues = leadFields.map(field => lead[field] || "-");
    const allFieldValues = allFieldKeys.map(key => lead.AllFields[key] || "-");
    return [id, ...leadFieldValues, ...allFieldValues];
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRows = rows.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedLeads = leads.filter(lead => lead._id !== deleteId);
    setLeads(updatedLeads);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleEditClick = (id) => {
    const leadToEdit = leads.find(lead => lead._id === id);
    setEditData({ ...leadToEdit });
    setShowEditModal(true);
  };

  const handleEditChange = (e, field, type = "root") => {
    const value = e.target.value;
    setEditData(prev => {
      if (type === "root") {
        return { ...prev, [field]: value };
      } else {
        return {
          ...prev,
          AllFields: {
            ...prev.AllFields,
            [field]: value,
          },
        };
      }
    });
  };

  const saveEdit = () => {
    const updatedLeads = leads.map(lead =>
      lead._id === editData._id ? editData : lead
    );
    setLeads(updatedLeads);
    setShowEditModal(false);
    setEditData(null);
  };

  return (
    <section className="w-full bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold">Meta</h2>
        <div className="flex gap-3">
          <button
          onClick={()=> navigate("/admin-dashboard/meta/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Leads
          </button>
          <button
          onClick={() => navigate("/admin-dashboard/meta/upload-excel")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Upload Excel File
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto p-4">
        <table className="table-auto min-w-full text-sm bg-white shadow rounded">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left text-gray-700 font-semibold border-b whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100 transition">
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 border-b text-gray-800 whitespace-nowrap"
                  >
                    {cell}
                  </td>
                ))}
                <td className="px-4 py-2 border-b">
                  <div className="flex gap-2 text-xl">
                    <FaRegEdit
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={() => handleEditClick(row[0])}
                    />
                    <MdDelete
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => handleDeleteClick(row[0])}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === idx + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md text-center max-w-md w-full">
            <h3 className="text-lg font-semibold text-red-600">Confirm Delete</h3>
            <p className="text-gray-600 my-4">Are you sure you want to delete this row?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editData && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md max-w-xl w-full">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Edit Lead</h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {leadFields.map((field, idx) => (
                <div key={idx}>
                  <label className="text-sm font-medium block">
                    {field.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    value={editData[field]}
                    onChange={(e) => handleEditChange(e, field)}
                    className="border rounded w-full px-2 py-1"
                  />
                </div>
              ))}
              {allFieldKeys.map((key, idx) => (
                <div key={idx}>
                  <label className="text-sm font-medium block">{key}</label>
                  <input
                    type="text"
                    value={editData.AllFields[key]}
                    onChange={(e) => handleEditChange(e, key, "allFields")}
                    className="border rounded w-full px-2 py-1"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
