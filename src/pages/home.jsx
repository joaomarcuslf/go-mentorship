import { useState } from "react";

import Fetcher from "../fetcher/fetcher";
import SiteList from "../sites/list";

const postSite = (body) => {
  return fetch("http://localhost:8000/api/sites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

const getQrURL = (id) => `http://localhost:8000/api/sites/${id}/qr`;

const showContent = (id) => (
  <div className="card-content">
    <div className="content has-text-centered">
      <img src={getQrURL(id)} alt="favicon" />
    </div>
  </div>
);

const editSite = (id) => {
  return fetch(`http://localhost:8000/api/sites/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    mode: "cors",
  });
};

const deleteSite = (id) => {
  return fetch(`http://localhost:8000/api/sites/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
    mode: "cors",
  });
};

const Home = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(true);
  const [url, setUrl] = useState("");

  const updateList = () => {
    setShowList(false);

    setTimeout(() => {
      setShowList(true);
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await postSite({ url });
      const data = await response.json();

      if (response.status >= 400) {
        throw new Error(data.message);
      }

      updateList();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await editSite(id);
      if (response.status >= 400) {
        throw new Error(response.message);
      }

      updateList();
    } catch (error) {
      alert(error.message);
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await deleteSite(id);
      if (response.status >= 400) {
        throw new Error(response.message);
      }

      updateList();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="hero is-purple is-light is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-10">
              <form className="box" onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label has-text-left">
                    Please enter the string you want to QRCode.
                  </label>

                  <div className="control">
                    <input
                      className={error ? "input is-danger" : "input"}
                      placeholder="e.g. www.google.com"
                      name="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>

                  {error && <p className="help is-danger">{error}</p>}
                </div>

                <div className="field has-text-right">
                  <button
                    className="button is-purple is-rounded is-medium is-fullwidth"
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>

          {showList && (
            <div className="columns is-centered">
              <div className="column is-10">
                <div className="box">
                  <Fetcher action={SiteList.action}>
                    {(data) => {
                      return (
                        <SiteList
                          data={data}
                          showContent={showContent}
                          handleEdit={handleEdit}
                          handleDelete={handleDelete}
                        />
                      );
                    }}
                  </Fetcher>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
