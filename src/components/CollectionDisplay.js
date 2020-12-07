import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import ReactJsonPrint from 'react-json-print'

const DisplayArray = props => {
  const {array, ...rest} = props;

  let objectStrs = []
  
  array.map(result => {
    let str = '';

    for (const [key, value] of Object.entries(result)) {
      str += `${key}: ${value} `
    }
    return objectStrs.push(str);
  })
  return (
    <div {...rest}>
      {objectStrs.map((obj, index) => {
        return (
          <h5 key = {index}> {obj} </h5>
        )

      })}   
    </div>
  )
}
const CollectionDisplay = props => {
  const {collection, queryResults, view, ...rest} = props;

  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
  }

  if (view === 'all') {
    return (
      <div {...rest}>
        <h3>Collection</h3>
        <ReactJsonPrint dataObject={collection} expanded />
      </div>
    );
  }
  else if (view === 'results') {
    return (
      <div {...rest}>
        <h3>Results of Queries</h3>
        <FormControlLabel
        control={
          <Checkbox
          checked = {checked}
            onChange={handleChange}
          />
        }
        label="Pretty Print"
      />

        {queryResults.map((result, index) => {
          if (checked)
          return (
            <div key = {index}>
              <h4> Query {index + 1}</h4>
              <ReactJsonPrint dataObject={result} expanded />
            </div>
          );

          else {
            return (
              <div key = {index}>
                <h4> Query {index + 1}</h4>
                {typeof(result) === 'string' ? <h5> {result} </h5> : 
                Array.isArray(result) ? <DisplayArray array = {result}/> : null
                }
                </div>
            )
          }
        })}
      </div>
    )
  }
  return (
    <>
    </>
  )
}

export default CollectionDisplay