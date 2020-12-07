import React from "react";

const QueryReader = (props) => {
  const { collection, setResults, setView, queryFile, setQueryFile, ...rest } = props;

  const runFind = (conditionsStrArr, projectionsStr) => {
    let satisfiedDocs = [];
    // Select documents that satisfies all conditions
    for (let conditionStr of conditionsStrArr) {
      let conditionArr = conditionStr.split(" ");
      while (conditionArr[0] === "") conditionArr.shift(); // Make sure first element of array is not an empty string

      const key = conditionArr[0];
      if (key === "Y") {
        satisfiedDocs.push(collection);
        break;
      }

      const operator = conditionArr[1];
      const value = parseInt(conditionArr[2]);

      // Docs contains arrays of documents that satisfy one condition
      let docs = [];
      if (operator === "=") {
        for (let d of collection) {
          if (d[key] === value) {
            if (!d.hasOwnProperty("satisfiedConditions")) {
              d["satisfiedConditions"] = 1;
            } else {
              d["satisfiedConditions"] += 1;
            }
            docs.push(d);
          }
        }
      } else if (operator === "<") {
        for (let d of collection) {
          if (d[key] < value) {
            if (!d.hasOwnProperty("satisfiedConditions")) {
              d["satisfiedConditions"] = 1;
            } else {
              d["satisfiedConditions"] += 1;
            }
            docs.push(d);
          }
        }
      } else if (operator === ">") {
        for (let d of collection) {
          if (d[key] > value) {
            if (!d.hasOwnProperty("satisfiedConditions")) {
              d["satisfiedConditions"] = 1;
            } else {
              d["satisfiedConditions"] += 1;
            }
            docs.push(d);
          }
        }
      }
      satisfiedDocs.push(docs);
    }

    // Reduce satisfiedDocs to one that satisfy all conditions
    let satisfiesAllConditions = [];

    // If object has only 1 condition (or Y) then we dont need to do this step.
    if (satisfiedDocs.length === 1) {
      satisfiesAllConditions = [...satisfiedDocs[0]];
    } else {
      for (let d of satisfiedDocs[0]) {
        if (d['satisfiedConditions'] === conditionsStrArr.length) {
          satisfiesAllConditions.push(d);
        }
      }
    }


    // Only include projections
    const projectionsArr = projectionsStr.split(' ');
    const projectionsDocs = [];

    for (let d of satisfiesAllConditions) {
      let obj = {};

      for (let i = 0; i < projectionsArr.length; i++) {
        const p = projectionsArr[i];

        if (p === "Z") {
          obj = JSON.parse(JSON.stringify(d));
          delete obj['satisfiedConditions'];
        } else {
          if (d.hasOwnProperty(p)) {
            obj[p] = d[p];
          }
        }

      }
      if (Object.keys(obj).length)
        projectionsDocs.push(obj);
    }


    return projectionsDocs;
  };

  const runSort = (queryArr) => {
    const splitArr = queryArr[0].split(' ');
    const sortOn = splitArr[0];
    const ascending = parseInt(splitArr[2]) > 0;

    let sortedCollection = collection.filter(obj => obj.hasOwnProperty(sortOn));
    for (let i = 0; i < sortedCollection.length; i++) {
      delete sortedCollection[i]['satisfiedConditions'];
      for (let j = 0; j < sortedCollection.length - i - 1; j++) {
        if (ascending) {
          if (sortedCollection[j + 1][sortOn] < sortedCollection[j][sortOn])
            [sortedCollection[j + 1], sortedCollection[j]] = [sortedCollection[j], sortedCollection[j + 1]];
        }
        else {
          if (sortedCollection[j + 1][sortOn] > sortedCollection[j][sortOn])
            [sortedCollection[j + 1], sortedCollection[j]] = [sortedCollection[j], sortedCollection[j + 1]];
        }
      }

    }

    return sortedCollection;
  };
  const runQuery = (queryStr) => {
    let queryArr = queryStr.split("\n");

    let operation = queryArr.shift();
    while (operation === "") {
      operation = queryArr.shift();
    }


    let result = null;
    if (operation === "FIND") {
      const projections = queryArr.pop();
      result = runFind(queryArr, projections);
    } else if (operation === "SORT") {
      result = runSort(queryArr);
    } else {
      result = `ERROR: Query operation ${operation} is not supported.`;
    }

    return result;
  };
  const parseText = (text) => {
    const queriesArr = text.split(" ;");

    if (queriesArr[queriesArr.length - 1] === '') queriesArr.pop();

    let queryResults = [];
    for (let i = 0; i < queriesArr.length; i++) {
      const result = runQuery(queriesArr[i]);
      queryResults.push(result);
    }

    setResults(queryResults);
    setView('results');
  };

  const read = (file, callback) => {
    const reader = new FileReader();

    reader.onload = () => {
      callback(reader.result);
    };

    reader.readAsText(file);
  };

  React.useEffect(() => {
    if (queryFile)
    read(queryFile, parseText);
  }, [queryFile, parseText]);
  return (
    <input
      type="file"
      accept=".txt"
      onChange={(event) => setQueryFile(event.target.files[0])}
      {...rest}
    />
  );
};

export default QueryReader;
