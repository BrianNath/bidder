import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = ({ value, onChange }) => {
  const [editorHtml, setEditorHtml] = useState(value);

  const handleChange = (html) => {
    setEditorHtml(html);
    onChange && onChange(html);
  };

  return (
    <ReactQuill
      theme="snow"
      value={editorHtml}
      onChange={handleChange}
      modules={RichTextEditor.modules}
      formats={RichTextEditor.formats}
    />
  );
};

RichTextEditor.modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
  ],
  clipboard: {
    matchVisual: false,
  },
};

RichTextEditor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "background",
];

export default RichTextEditor;
