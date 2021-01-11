import React, { useState } from "react";
import { useForm } from "react-hook-form";

 import { updateLogEntry } from './API';

const EditLogEntryForm = ({onClose, setEditMode, setLogEntries,logEntries, idx }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editedItem, setEditedItem] = useState(logEntries[idx]);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setEditMode(false);
      const id=logEntries[idx]._id;
      await updateLogEntry(data,id);
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };

//   const editHandler = (editedItem, idx) => {
//     logEntries[idx] = editedItem;
//     setLogEntries([...logEntries]);
//   };

  const editedItemChangeTitle = (event) => {
    setEditedItem({
      title: event.target.value,
    });
  };

  const editedItemChangeDescription = (event) => {
    setEditedItem({
      description: event.target.value,
    });
  };

  const editedItemChangeImage = (event) => {
    setEditedItem({
      image: event.target.value,
    });
  };

  const editedItemChangeDate = (event) => {
    setEditedItem({
      visitDate: event.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
      {error ? <h3 className="error">{error}</h3> : null}
      <label htmlFor="title">Title</label>
      <input
        name="title"
        value={editedItem.title}
        onChange={editedItemChangeTitle}
        required
        ref={register}
      />
      <label htmlFor="description">Description</label>
      <textarea
        name="description"
        value={editedItem.description}
        onChange={editedItemChangeDescription}
        rows={3}
        ref={register}
      ></textarea>
      <label htmlFor="image">Image</label>
      <input
        name="image"
        value={editedItem.image}
        onChange={editedItemChangeImage}
        ref={register}
      />
      <label htmlFor="visitDate">Visit Date</label>
      <input
        name="visitDate"
        value={editedItem.image}
        onChange={editedItemChangeDate}
        type="date"
        required
        ref={register}
      />
      <button className="btn btn-dark" disabled={loading}>
        {loading ? "Loading..." : "Save Edited Entry"}
      </button>
    </form>
  );
};

export default EditLogEntryForm;
