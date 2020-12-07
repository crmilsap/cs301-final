import React from "react";

const CollectionReader = props => {
  const {setCollection, ...rest} = props;

  const createObjFromString = (docString, index) => {
    let obj = {
      A: index,
    };

    const fields = docString.split(" ");
    
    for (let i = 0; i < fields.length; i += 2) {
      const key = fields[i].slice(0, -1); // Slice to remove :

      if (key === "") continue;

      obj[key] = parseInt(fields[i + 1]);
    }

    return obj;
  };
  const parseText = (text) => {
    const documentsArr = text.split("\n");

    let collection = [];
    for (let i = 0; i < documentsArr.length; i++) {
      const doc = createObjFromString(documentsArr[i], i + 1);
      collection.push(doc);
    }

    setCollection(collection);
  };

  const read = (file, callback) => {
    const reader = new FileReader();

    reader.onload = () => {
      callback(reader.result);
    };

    reader.readAsText(file);
  };
  return (
    <input
      type="file"
      accept=".txt"
      onChange={(event) => read(event.target.files[0], parseText)}
      {...rest}
    />
  );
};

export default CollectionReader;
