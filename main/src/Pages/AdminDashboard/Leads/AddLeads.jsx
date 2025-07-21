import { useState } from "react";
import Data from "../../../Datastore/MetaData.json";
// If you prefer UUIDs, install uuid and import v4 as uuidv4
// import { v4 as uuidv4 } from "uuid";

export default function AddLeads({ onAdd }) {
  /* ---------- 1.  Field Lists ---------- */
  const rootFields = ["_id", "created_time", "created_at"];

  // Grab dynamic keys from the first record’s AllFields
  const allFieldKeys =
    Data?.leads?.[0] ? Object.keys(Data.leads[0].AllFields) : [];

  /* ---------- 2.  Initial Form State ---------- */
  const blankRoot = rootFields.reduce(
    (acc, key) => ({ ...acc, [key]: "" }),
    {}
  );

  const blankAllFields = allFieldKeys.reduce(
    (acc, key) => ({ ...acc, [key]: "" }),
    {}
  );

  const [formData, setFormData] = useState({
    ...blankRoot,
    AllFields: { ...blankAllFields },
  });

  /* ---------- 3.  Handlers ---------- */
  // Root‑level fields
  const handleRootChange = (e, field) =>
    setFormData({ ...formData, [field]: e.target.value });

  // AllFields
  const handleAllFieldChange = (e, key) =>
    setFormData({
      ...formData,
      AllFields: { ...formData.AllFields, [key]: e.target.value },
    });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Auto‑generate ID if left blank
    const newLead = {
      _id: formData._id || Date.now().toString(), // or uuidv4()
      created_time: formData.created_time,
      created_at: formData.created_at,
      AllFields: formData.AllFields,
    };

    // Push up to parent (Meta) if callback supplied
    if (typeof onAdd === "function") onAdd(newLead);

    // Reset form
    setFormData({
      ...blankRoot,
      AllFields: { ...blankAllFields },
    });
  };

  /* ---------- 4.  UI ---------- */
  return (
    <section className="p-6 bg-white shadow rounded max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Lead</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* ------ Root fields ------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rootFields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1">
                {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </label>
              <input
                type="text"
                value={formData[field]}
                onChange={(e) => handleRootChange(e, field)}
                className="w-full border rounded px-3 py-1.5 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder={field === "_id" ? "Leave blank for auto‑ID" : ""}
              />
            </div>
          ))}
        </div>

        {/* ------ Dynamic AllFields ------ */}
        <hr className="my-2" />
        <h3 className="text-lg font-medium">Additional Fields</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allFieldKeys.map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{key}</label>
              <input
                type="text"
                value={formData.AllFields[key]}
                onChange={(e) => handleAllFieldChange(e, key)}
                className="w-full border rounded px-3 py-1.5 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          ))}
        </div>

        {/* ------ Actions ------ */}
        <div className="flex gap-4 justify-end pt-4">
          <button
            type="reset"
            onClick={() =>
              setFormData({ ...blankRoot, AllFields: { ...blankAllFields } })
            }
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Lead
          </button>
        </div>
      </form>
    </section>
  );
}
