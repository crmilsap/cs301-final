import React from 'react';

// Mui Components
import Grid from '@material-ui/core/Grid';


// Custom Components
import CollectionReader from './components/CollectionReader'
import CollectionDisplay from './components/CollectionDisplay';
import QueryReader from './components/QueryReader'
import Buttons from './components/Buttons';

const App = () => {
  const [collection, setCollection] = React.useState([]);
  const [queryResults, setQueryResults] = React.useState(null);

  const [queryFile, setQueryFile] = React.useState(null);

  const [view, setView] = React.useState('all')


  return (
    <div className="App">
      <Grid container justify="space-around">
        <Grid item>
          <h3> Upload Data File</h3>
          <CollectionReader
            setCollection={(collection) => setCollection(collection)}
          />
        </Grid>

        <Grid item>
          <h3> Upload Query File</h3>
          <QueryReader
            collection={collection}
            setResults={(results) => setQueryResults(results)}
            queryFile={queryFile}
            setQueryFile={(file) => setQueryFile(file)}
            setView={(v) => setView(v)}
          />
        </Grid>
      </Grid>
      {collection.length ? (
        <>
          <Buttons
            setView={(e) => setView(e)}
            collection={collection}
            setResults={(results) => setQueryResults(results)}
            queryFile = {queryFile}
          />
          <CollectionDisplay
            collection={collection}
            queryResults={queryResults}
            view={view}
            style={{ marginLeft: 50, marginTop: 50 }}
          />
        </>
      ) : null}
    </div>
  );
}

export default App;
