import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { UnstyledButton } from "../../components/Button/UnstyledButton";
import Input from "../../components/Input/Input";
import Column from "../../components/Layout/Column";
import Row from "../../components/Layout/Row";
import regStyles from "../../styles/constants";
import { addTemplate } from "../../utils/queries";
import styles from "./uploader.css";

const probRegex = /^[-+]?[0-9]*(\.[0-9]*)$/;

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

const Uploader = ({}) => {
  const [labels, setLabels] = useState({ 0: getTemplateLabel(0) });
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);

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
              ? { name: oldImg.name, src: e.target.result }
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

  return (
    <div>
      <h2>Add a Template</h2>
      <Input
        info={"Enter your email"}
        onChange={addFiles}
        accept="image/*"
        type="file"
        multiple
        containerStyle={{ marginLeft: 8 }}
        infoStyle={{ color: "black" }}
      />
      {previews.map(
        (img, i) =>
          img.src && (
            <img
              key={`${img.name}-${i}`}
              className={styles.uploadedImage}
              src={img.src}
            />
          )
      )}
      {Object.values(labels).map((label) => (
        <Row key={label.id} style={{ width: "80%" }}>
          <Input
            info={"Label Name"}
            name="label"
            value={label.label}
            onChange={(e) => updateLabel(e.target.value, label.id, "label")}
            containerStyle={{ marginLeft: 8 }}
            infoStyle={{ color: "black" }}
          />
          <Input
            info="Probability the image is this label"
            name="probability"
            value={label.probability}
            onChange={(e) => updateProbability(e.target.value, label.id)}
            containerStyle={{ marginLeft: 8 }}
            infoStyle={{ color: "black" }}
          />
        </Row>
      ))}
      <UnstyledButton
        onClick={() =>
          setLabels((prevLabels) => {
            const id = Object.keys(labels).length;

            return {
              ...prevLabels,
              [id]: getTemplateLabel(id),
            };
          })
        }
      >
        Add another label
      </UnstyledButton>
      <UnstyledButton onClick={uploadFiles}>Upload Templates</UnstyledButton>
    </div>
  );
};

export default Uploader;
