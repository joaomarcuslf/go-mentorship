/* eslint-disable no-restricted-globals */
import React, { useState } from "react";

const ShowSite = ({ url, id, showContent, handleDelete, handleEdit }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteClick = async () => {
    const confirmDelete = confirm(`Are you sure you want to delete this site (${url})?`);

    if (confirmDelete) {
      handleDelete(id)
    }
  }

  const handleEditClick = async () => {
    handleEdit(id)
  }


  return (
    <div className="card mb-5">
      <header className="card-header">
        <button
          className="button is-medium is-fullwidth"
          aria-label="more options"
          onClick={() => setIsOpen(!isOpen)}
        >
          {url}
        </button>
      </header>

      {isOpen && showContent(id)}

      <footer className="card-footer">
        <button className="card-footer-item button is-link" onClick={handleEditClick}>
          Edit
        </button>
        <button className="card-footer-item button is-link" onClick={handleDeleteClick}>
          Delete
        </button>
      </footer>
    </div>
  );
};

export default ShowSite;
