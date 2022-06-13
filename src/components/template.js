import React, { useEffect, useState, useContext } from "react";
import "../App.css";
import Context from "../store/context.js";
import * as api from "../api/templates";
import { templateActions, setLoading as setAppLoading } from "../store";
import CanvasContainer from "./builder/canvasContainer";
import { loadFonts } from "./builder/fontLoader";
import getCurrentTemplate from "./getCurrentTemplate";

function Template() {
  const { store, dispatch } = useContext(Context);
  const [loading, setloading] = useState({
    fonts: false,
    templates: true,
    currentTemplate: false,
  });
  const user = store.user;

  useEffect(() => {
    if (loading.fonts || loading.templates || loading.currentTemplate)
      dispatch(setAppLoading(true));
    else dispatch(setAppLoading(false));
    console.log("Loadingxrw:", loading);
  }, [loading]);

  useEffect(() => {
    getUploadedTemplates().then(() =>
      setloading({ ...loading, templates: false })
    );
    loadFonts("popularity")
      .then((fonts) => {
        fonts = fonts.slice(0, 100);
        for (let i in fonts) {
          let apiUrl = [];
          apiUrl.push("https://fonts.googleapis.com/css?family=");
          apiUrl.push(fonts[i].family.replace(/ /g, "+"));
          var url = apiUrl.join("");
          let style = document.createElement("link");
          style.href = url;
          style.rel = "stylesheet";
          //console.log("Styleee:", style)
          document.head.appendChild(style);
        }
        dispatch(templateActions.setFonts(fonts));
        setloading({ ...loading, fonts: false });
      })
      .catch((err) => {
        setloading({ ...loading, fonts: false });
        console.log(err);
      })
      .finally(() => setloading({ ...loading, fonts: false }));
  }, []);

  const createTemplate = async () => {
    const info = {
      uid: user.uid,
      name: "New Template" + Math.floor(Math.random() * 100),
      description: "New Template test",
    };
    const res = await api.createTemplate(info);
    console.log(res);
    window.location.reload();
  };

  const getUploadedTemplates = () => {
    setloading({ ...loading, templates: true });
    return new Promise((resolve, reject) => {
      console.log("UID in templates", store.user.uid);
      api.getTemplates(store.user.uid).then((res) => {
        dispatch(templateActions.setUserTemplates(res));
        console.log("Get templates():", res);
        setloading({ ...loading, templates: false });
        resolve();
      });
    });
  };

  const setCurrentTemplate = (srcTemplate) => {
    dispatch(
      templateActions.setCurrentTemplate({
        id: null,
        canvas: { items: [], rev: [] },
      })
    );
    setloading({ ...loading, currentTemplate: true });
    let { id, data } = srcTemplate;
    getCurrentTemplate(data.canvas.items).then((res) => {
      for (let i in res) {
        let imgItem = res[i];
        data.canvas.items.map((item) => {
          if (item.id === imgItem.id) return imgItem;
          else return item;
        });
      }
      let template = {
        id,
        ...data,
        canvas: {
          ...data.canvas,
          items: data.canvas.items,
          activeItem: data.canvas.items[0],
        },
      };
      dispatch(templateActions.setCurrentTemplate(template));
      console.log(store.templates);
      setloading({ ...loading, currentTemplate: false });
    });
  };

  return (
    <div style={{ width: "100%", height: "90%", display: "flex" }}>
      <div
        style={{
          width: "15%",
          borderRight: "2px solid #BED7E1",
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="button button1"
          onClick={createTemplate}
          style={{ border: "2px solid #BED7E1", margin: "5px 10px" }}
        >
          Create Template
        </div>
        <span
          style={{
            marginLeft: 10,
            fontFamily: "monospace",
            fontSize: 18,
            fontWeight: "bold",
            color: "gray",
          }}
        >
          Existing Templates:
        </span>
        {store.templates.userTemplates.map((template, i) => {
          return (
            <div
              key={i}
              className="button button1"
              style={{
                margin: "4px auto",
                marginLeft: 10,
              }}
              onClick={() => setCurrentTemplate(template)}
            >
              {template.data.name}
            </div>
          );
        })}
      </div>
      <div style={{ width: "85%", display: "flex" }}>
        {store.app.isLoading ? (
          <div
            style={{
              margin: "auto",
              fontFamily: "monospace",
              fontSize: 20,
              color: "gray",
            }}
          >
            Loading...
          </div>
        ) : (
          <>
            {store.templates.currentTemplate.id ? (
              <CanvasContainer />
            ) : (
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 20,
                  color: "gray",
                }}
              >
                No Template Selected
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Template;
