import React from "react";
import ShowSite from "./show";

const SitesList = (props) => {
  const { sites = [] } = props?.data || {};

  return (
    <div>
      <h2 className="is-title">Sites:</h2>

      {sites?.length === 0 && <p>No sites</p>}

      <div className="columns is-multiline">
        {sites.map((site, index) => {
          return (
            <div className="column is-6 site-item" key={`${site.url}-${site.id}-${index}`}>
              <ShowSite
                url={site?.url}
                id={site?.id}
                showContent={props.showContent}
                handleDelete={props.handleDelete}
                handleEdit={props.handleEdit}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

SitesList.action = () => {
  return fetch("http://localhost:8000/api/sites", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
    mode: "cors",
  });
};

export default SitesList;
