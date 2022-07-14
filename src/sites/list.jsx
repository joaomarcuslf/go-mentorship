import React from "react";

const SitesList = (props) => {
  const { sites = [] } = props?.data || {}

  return (
    <div>
      <h2>Sites:</h2>

      {sites?.length === 0 && <p>No sites</p>}
      <ul>
        {sites.map((site, index) => (
          <li key={`${site.URL}-${site.id}-${index}`}>{site.URL}</li>
        ))}
      </ul>
    </div>
  )
}

SitesList.action = () => {
  return fetch("http://localhost:8000/api/sites", {
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
    mode: "cors",
  })
}

export default SitesList;
