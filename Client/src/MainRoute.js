import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { NavigationControl, Marker, Popup } from "react-map-gl";
import { listLogEntries, deleteLogEntry } from "./API";
import LogEntryForm from "./LogEntryForm";
import EditLogEntryForm from "./editLogEntryForm";

const MainRoute = (props) => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 22.008,
    longitude: 79.533,
    zoom: 3,
  });
  // eslint-disable-next-line
  const [settings, setsettings] = useState({
    doubleClickZoom: false,
  });
  const [deleteMode, setDeleteMode] = useState(false);
  const [showMarker, setShowMarker] = useState(true);

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  const deleteHandler = (event) => {
    const entryIdx = event.target.id;
    const idx = logEntries[entryIdx]._id;
    logEntries.splice(entryIdx, 1);
    setLogEntries([...logEntries]);
    deleteLogEntry(idx);
    setShowMarker(true);
    setDeleteMode(false);
    console.log(idx);
  };

  const logout = () => {
    fetch("http://localhost:9999/logout", {
      credentials: "include",
    }).then(() => {
      props.setLoggedIn(false);
      props.setNewUser("");
    });
  };

  useEffect(() => {
    getEntries();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        ...viewport,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    });
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapStyle="mapbox://styles/thecjreynolds/ck117fnjy0ff61cnsclwimyay"
      onDblClick={showAddMarkerPopup}
      {...settings}
    >     
<button
        type="button"
        className="btn btn-info"
        data-toggle="modal"
        data-target="#exampleModalCenter"
      >
        Instructions
      </button>
      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div style={{ fontWeight: "bold", fontSize: "1.3em" }}>
                {`Hey ${props.username}`}
              </div>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" style={{ fontFamily: "cursive" }}>
              <ul>
                <li>You can create entries of your visited places on map.</li>
                <li>Doubleclick at a place on map to create your log-entry.</li>
                <li>After creation, click on the marker to view your log.</li>
                <li>
                  You can zoom-in to create entry for being more specific about
                  your specific visited places.
                </li>
              </ul>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button className="btn btn-light" onClick={logout} style={{position: "absolute", right: 30, top:0}}>
          Log out
        </button>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0 }}>
        <NavigationControl />
      </div>
      {logEntries.map((entry, idx) => (
        <React.Fragment key={entry._id}>
          {showMarker ? (
            <Marker latitude={entry.latitude} longitude={entry.longitude}>
              <div
                onClick={() => {
                  setShowPopup({
                    [entry._id]: true,
                  });
                  setEditMode(false);
                  setShowMarker(false);
                }}
              >
                <img
                  className="marker"
                  style={{
                    height: `${6 * viewport.zoom}px`,
                    width: `${6 * viewport.zoom}px`,
                  }}
                  src="https://i.imgur.com/y0G5YTX.png"
                  alt="marker"
                />
              </div>
            </Marker>
          ) : null}
          {showPopup[entry._id] ? (
            <Popup
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => {
                setShowPopup({
                  [entry._id]: false,
                });
                setEditMode(false);
                setShowMarker(true);
              }}
              anchor="top"
            >
              {editMode ? (
                <EditLogEntryForm
                  onClose={() => {
                    setShowPopup({
                      [entry._id]: true,
                    });
                    setEditMode(false);
                    getEntries();
                  }}
                  //entryElement={logEntries[idx]}
                  setEditMode={setEditMode}
                  setLogEntries={setLogEntries}
                  logEntries={logEntries}
                  idx={idx}
                />
              ) : (
                <>
                {!deleteMode ? (
                  <div className="popup">
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                    <small>
                      Visited on:{" "}
                      {new Date(entry.visitDate).toLocaleDateString()}
                    </small>
                    {entry.image && (
                      <img className="img-fluid" src={entry.image} alt={entry.title} />
                    )}
                    <br></br>
                    <button
                      onClick={() => {
                        setEditMode(true);
                      }}
                      className="btn btn-primary m-1"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger m-1"
                      onClick={() => {
                        setDeleteMode(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="popup">
                    <h5>Are you sure?</h5>
                    <button
                      className={entry._id}
                      // eslint-disable-next-line
                      className="btn btn-danger m-1"
                      id={idx}
                      onClick={deleteHandler}
                    >
                      Yes
                    </button>
                    <button
                      className="btn btn-primary m-1"
                      onClick={() => {
                        setDeleteMode(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
              )}
            </Popup>
          ) : null}
        </React.Fragment>
      ))}
      {addEntryLocation ? (
        <>
          <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
          >
            <div>
              <img
                className="marker"
                style={{
                  height: `${6 * viewport.zoom}px`,
                  width: `${6 * viewport.zoom}px`,
                }}
                src="https://i.imgur.com/y0G5YTX.png"
                alt="marker"
              />
            </div>
          </Marker>
          <Popup
            //key={entry._id`${entry.title}`}
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setAddEntryLocation(null)}
            anchor="top"
          >
            <div className="popup">
              <LogEntryForm
                onClose={() => {
                  setAddEntryLocation(null);
                  getEntries();
                }}
                location={addEntryLocation}
              />
            </div>
          </Popup>
        </>
      ) : null}
    </ReactMapGL>
  );
};

export default MainRoute;
