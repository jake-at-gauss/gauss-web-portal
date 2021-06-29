import { filter, isEmpty, set } from "lodash";
import { useRef, useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { RiMenuAddFill } from "react-icons/ri";
import { UnstyledButton } from "../../components/Button/UnstyledButton";
import DropdownMenu from "../../components/DropdownMenu/DropdownMenu";
import Column from "../../components/Layout/Column";
import Row from "../../components/Layout/Row";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { UPLOAD_SUCCESS_MODAL } from "../../components/ModalContainer/ModalConstants";
import { useModalService } from "../../components/ModalContainer/ModalService";
import regStyles from "../../styles/constants";
import { addTemplate } from "../../utils/queries";
import { SearchBar } from "../Albums/Albums";
import albums from "../Albums/mockAlbums";
import styles from "./build.css";

const probRegex = /^[-+]?[0-9]*(\.[0-9]*)$/;
const maxPreviews = 15;

const taskTypes = ["Classification", "Bounding Boxes", "Polygon"];

const getTemplateLabel = (id) => ({
  id,
  label: "dude",
  probability: 0.5,
});

const cleanLabelsForPost = (labels) => {
  return Object.values(labels).map(({ probability, ...rest }) => ({
    probability: parseFloat(probability),
    ...rest,
  }));
};

const mockAlbums = ["Fruit", "Cars", "Animals", "Inventory"];

const AlbumInput = ({ albums = mockAlbums, album, setAlbum }) => {
  return (
    <Row>
      <input
        onChange={(e) => setAlbum(e.target.value)}
        className={styles.albumInput}
        list="albums"
      />
      <datalist id="albums">
        {albums.map((alb) => (
          <option key={alb} value={alb} />
        ))}
      </datalist>
      <UnstyledButton
        style={{
          color: regStyles.darkBlue,
          backgroundColor: "white",
          marginLeft: 8,
          borderRadius: 8,
          width: 32,
          fontWeight: "bold",
        }}
      >
        +
      </UnstyledButton>
    </Row>
  );
};

const AlbumDropdownOptions = ({ onClick, options }) => (
  <Column>
    {options.map((album) => (
      <span key={album} onClick={() => onClick(album)}>
        {album}
      </span>
    ))}
  </Column>
);

const Uploader = ({ upload }) => {
  return (
    <Column justify align className={styles.dndContainer}>
      <Row
        style={{
          fontWeight: "bold",
          fontSize: 24,
          marginBottom: 32,
        }}
      >
        Drag and Drop to Upload Files
      </Row>
      <UnstyledButton onClick={upload} className={styles.fileBrowser}>
        Browse Files
      </UnstyledButton>
    </Column>
  );
};

const LabelInput = ({ labels = [], addLabel, removeLabel }) => {
  const [inputActive, setInputActive] = useState(true);
  const [newLabel, setNewLabel] = useState("");

  const add = (label) => {
    setInputActive(!inputActive);
    addLabel(label);
    setNewLabel("");
  };

  const remove = (labelI) => {
    setInputActive(!inputActive);
    removeLabel(labelI);
    setNewLabel("");
  };
  return (
    <Column style={{ marginLeft: 8 }}>
      <span style={{ marginBottom: 4, fontSize: 10, fontWeight: "bold" }}>
        label
      </span>
      <Row style={{ flexWrap: "wrap" }}>
        {labels.map((label, i) => {
          return (
            <Row
              key={i}
              style={{ width: "fit-content", minWidth: 50, marginBottom: 8 }}
            >
              <SearchBar
                placeholder=""
                style={{ background: regStyles.base }}
                value={label}
                iconProps={{ style: { display: "none" } }}
                inputStyles={{
                  fontSize: 16,
                  caretColor: "transparent",
                  color: regStyles.white,
                  background: "none",
                }}
                disabled
              />
              <UnstyledButton onClick={() => remove(i)}>
                <IoIosCloseCircle
                  style={{ color: regStyles.dark, marginLeft: 8 }}
                />
              </UnstyledButton>
            </Row>
          );
        })}
        <SearchBar
          placeholder=""
          value={newLabel}
          onInput={(e) => setNewLabel(e.target.value)}
          onEnter={() => add(newLabel)}
          iconProps={{ style: { display: "none" } }}
          inputStyles={{ fontSize: 16 }}
        />
      </Row>
    </Column>
  );
};

const BoxInput = ({}) => {
  const [newLabel, setNewLabel] = useState("");

  return (
    <Column style={{ marginLeft: 8 }}>
      <span style={{ marginBottom: 4, fontSize: 10, fontWeight: "bold" }}>
        Description
      </span>
      <SearchBar
        placeholder=""
        value={newLabel}
        style={{ width: 350 }}
        onInput={(e) => setNewLabel(e.target.value)}
        iconProps={{ style: { display: "none" } }}
        inputStyles={{ fontSize: 16 }}
      />
    </Column>
  );
};

const LoadingPreviews = ({ previews }) => {
  const numLoaded = previews.filter(({ loaded }) => loaded).length;
  const percent = numLoaded / previews.length;

  const [_, { openModal }] = useModalService();

  const [albumFilter, setAlbumFilter] = useState("");
  const [tasks, setTasks] = useState([]);

  const setTaskType = (type, index) =>
    setTasks((prevTasks) =>
      prevTasks.map((task, i) => (i === index ? { ...task, type } : task))
    );
  const addTaskLabel = (label, index) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, labels: [...task.labels, label] } : task
      )
    );
  };
  const removeTaskLabel = (labelIndex, index) =>
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index
          ? {
              ...task,
              labels: task.labels.filter((_, labelI) => labelI !== labelIndex),
            }
          : task
      )
    );

  const loadingBarStyle = {
    "--percent": percent,
    background: regStyles.base,
  };

  const numStyle = {
    "--num": numLoaded,
  };

  return (
    <Row className={styles.uploadContainer}>
      <Column style={{ flex: 1 }}>
        <Column align className={styles.loadingContainer}>
          <Column
            style={{
              color: regStyles.base,
              fontWeight: "bold",
              fontSize: 24,
              textAlign: "center",
            }}
          >
            <span>
              <span style={numStyle} className={styles.loadedNumContainer} />/
              {previews.length}
            </span>
            <span> Files Uploaded</span>
          </Column>
          <div className={styles.loadingBarContainer}>
            <div
              style={{ width: `${percent * 100}%`, ...loadingBarStyle }}
              className={styles.loadingBar}
            />
          </div>
        </Column>
        <Row className={styles.imagePreviewContainer}>
          {previews
            .slice(0, maxPreviews)
            .map((img, i) =>
              img.loaded ? (
                <img
                  key={`${img.name}-${i}`}
                  className={styles.uploadedImage}
                  src={img.src}
                />
              ) : (
                <LoadingComponent
                  key={i}
                  style={{ width: 32, height: 32 }}
                  className={styles.uploadedImage}
                />
              )
            )}
        </Row>
      </Column>
      {/**
       ALBUM/TASK CREATION
      */}
      <Column style={{ flex: 2, paddingLeft: 16 }}>
        <Column style={{ marginBottom: 32 }}>
          <span style={{ marginBottom: 8, fontSize: 18 }}>Add to Album</span>
          {/** DROPDOWN/ENTRY */}
          <DropdownMenu
            dropdownOptionsClassName={styles.dropdownMenuOptions}
            dropdownOptions={
              <AlbumDropdownOptions
                options={albums
                  .map(({ name }) => name)
                  .filter((name) =>
                    name.toLowerCase().includes(albumFilter.toLowerCase())
                  )}
                onClick={(filter) => setAlbumFilter(filter)}
              />
            }
          >
            <SearchBar
              placeholder="Album"
              value={albumFilter}
              onInput={(e) => setAlbumFilter(e.target.value)}
              style={{ width: 250 }}
              inputStyles={{ fontSize: 16 }}
            />
          </DropdownMenu>
        </Column>
        <Column>
          <span style={{ marginBottom: -8, fontSize: 18 }}>Tasks</span>
          {/** EZ Task Creation */}
          {tasks.map((task, i) => (
            <Row key={i} style={{ marginTop: 16 }}>
              <Column>
                <span
                  style={{ marginBottom: 4, fontSize: 10, fontWeight: "bold" }}
                >
                  task type
                </span>
                <DropdownMenu
                  dropdownOptionsClassName={styles.dropdownMenuOptions}
                  dropdownOptions={
                    <AlbumDropdownOptions
                      options={taskTypes}
                      onClick={(filter) => setTaskType(filter, i)}
                    />
                  }
                >
                  <SearchBar
                    placeholder="Task Type"
                    value={task.type}
                    style={{ width: 250 }}
                    iconProps={{ style: { display: "none" } }}
                    inputStyles={{
                      fontSize: 16,
                      caretColor: "transparent",
                      cursor: "pointer",
                    }}
                  />
                </DropdownMenu>
              </Column>
              {task.type === "Classification" && (
                <LabelInput
                  labels={task.labels}
                  addLabel={(label) => addTaskLabel(label, i)}
                  removeLabel={(ind) => removeTaskLabel(ind, i)}
                />
              )}
              {task.type === "Bounding Boxes" && <BoxInput />}
            </Row>
          ))}
          <UnstyledButton
            onClick={() =>
              setTasks((prevTasks) => [...prevTasks, { type: "", labels: [] }])
            }
            style={{
              color: regStyles.base,
              display: "flex",
              justifyContent: "center",
              width: "fit-content",
              marginTop: 16,
            }}
          >
            <RiMenuAddFill />
            <span style={{ fontStyle: "italic", marginLeft: 4 }}>Add Task</span>
          </UnstyledButton>
        </Column>
      </Column>
      <Column>
        <UnstyledButton
          style={{
            background: regStyles.base,
            color: regStyles.white,
            padding: "8px 32px",
            borderRadius: 8,
            fontWeight: "bold",
          }}
          onClick={() =>
            openModal(UPLOAD_SUCCESS_MODAL, {
              num: previews.length,
              album: albumFilter,
              tasks,
            })
          }
        >
          Upload
        </UnstyledButton>
      </Column>
    </Row>
  );
};

const Build = ({}) => {
  const [labels, setLabels] = useState({ 0: getTemplateLabel(0) });
  const [previews, setPreviews] = useState([]);
  const [album, setAlbum] = useState("");
  const [files, setFiles] = useState([]);
  const inputRef = useRef();
  const [_, { openModal }] = useModalService();

  const updateProbability = (value, i, attr) => {
    if (value > 1 || value < 0 || !probRegex.test(value)) {
      return;
    }

    updateLabel(value, i, "probability");
  };

  const updateLabel = (value, i, attr) => {
    setLabels((prevLabels) => ({
      ...prevLabels,
      [i]: { ...prevLabels[i], [attr]: value },
    }));
  };

  const addFiles = (e) => {
    const files = [...e.target.files];
    setPreviews(files);
    setFiles(files);

    // FileRead requires function to bind to
    files.forEach(function (img) {
      var reader = new FileReader();

      reader.onload = (e) => {
        setPreviews((oldImages) =>
          oldImages.map((oldImg) =>
            oldImg.name === img.name
              ? { name: oldImg.name, src: e.target.result, loaded: true }
              : oldImg
          )
        );
      };

      reader.readAsDataURL(img);
    });
  };

  const uploadFiles = () => {
    const postLabels = cleanLabelsForPost(labels);
    const data = {
      labels: postLabels,
    };

    files.forEach((file) => {
      const formData = new FormData();
      formData.append("uploadFile", file);
      formData.append("data", JSON.stringify(data));

      addTemplate(formData);
    });
  };

  const mockUploadFiles = () => {
    setTimeout(() => {
      openModal(UPLOAD_SUCCESS_MODAL, { num: previews.length, album });
    }, 300);
  };

  return (
    <div className={styles.container}>
      <input
        ref={inputRef}
        onChange={addFiles}
        accept="image/*"
        type="file"
        multiple
        style={{ display: "none" }}
      />
      <h2 style={{ display: "flex" }}>
        <FaCloudUploadAlt />
        <span style={{ marginLeft: 8 }}>Upload</span>
      </h2>
      <Column
        align
        style={{
          background: regStyles.white,
          borderRadius: 4,
          boxShadow: "2px 2px 4px 0px rgba(50, 50, 50, 0.4)",
          padding: "32px 64px",
        }}
      >
        {isEmpty(previews) ? (
          <Uploader upload={() => inputRef.current.click()} />
        ) : (
          <LoadingPreviews previews={previews} upload={mockUploadFiles} />
        )}
      </Column>
    </div>
  );

  return (
    <div className={styles.container}>
      <h2>Add Your Images</h2>
      <input
        ref={inputRef}
        onChange={addFiles}
        accept="image/*"
        type="file"
        multiple
        style={{ display: "none" }}
      />
      <Row>
        <Row style={{ flexWrap: "wrap", width: 900, height: "fit-content" }}>
          {previews
            .slice(0, maxPreviews)
            .map(
              (img, i) =>
                img.src && (
                  <img
                    key={`${img.name}-${i}`}
                    className={styles.uploadedImage}
                    src={img.src}
                  />
                )
            )}
          {previews.length > maxPreviews && (
            <Row
              className={styles.uploadedImage}
              justify
              align
              style={{ display: "inline-flex" }}
            >
              {`+${previews.length - maxPreviews} more`}
            </Row>
          )}
          <UnstyledButton
            className={styles.uploadedImage}
            style={{ fontWeight: "bold", fontSize: 60 }}
            onClick={() => inputRef.current.click()}
          >
            {!isEmpty(files) ? <span>&#8635;</span> : "+"}
          </UnstyledButton>
        </Row>
        <Column>
          <h2>Album</h2>
          <AlbumInput album={album} setAlbum={setAlbum} />
          <UnstyledButton
            disabled={isEmpty(files) || !album}
            className={styles.submitButton}
            onClick={mockUploadFiles}
          >
            Upload Images
          </UnstyledButton>
        </Column>
      </Row>
    </div>
  );
};

export default Build;
