import React, { useState, FunctionComponent, useEffect } from 'react';

// Interface
import { Actor } from '../../../../interfaces/movie';

// Component
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import IconClose from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

interface IMultipleInputActorsProps {
  value: Actor[],
  onChange: Function,
}

const MultipleInputActors: FunctionComponent<IMultipleInputActorsProps> = (props) => {
  const [actorsInput, setActorsInput] = useState<Array<Actor>>([]);

  useEffect(() => {
    setActorsInput(props.value);
  }, [props.value])

  return (
    <div style={{ marginLeft: 10, width: '100%' }}>
      <FormLabel>Actors:</FormLabel>
      {actorsInput.map(actorInput => (
        <Grid container spacing={1} key={actorsInput.indexOf(actorInput)} style={{ position: 'relative' }}>
          <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <img src={actorInput.avatar ? actorInput.avatar : 'https://zcoin.io/storage/2017/01/blank-avatar-300x300.png'} alt={actorInput.name} style={{height: '60px', width: '60px', borderRadius: '50%'}}></img>
          </Grid>
          <Grid item xs={4}>
            <TextField
              required
              label="Avatar"
              style={{  }}
              placeholder="https://images-na.ssl-images-amazon.com/images/I/71YhAoqjX0L._SY606_.jpg"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, }}
              variant="outlined"
              value={actorInput.avatar}
              onChange={(event) => {
                const newActorsInput = [...actorsInput];
                const foundIndex = newActorsInput.indexOf(actorInput);
                newActorsInput[foundIndex].avatar = event.target.value;
                setActorsInput(newActorsInput);
                props.onChange(newActorsInput);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              label="Actor name"
              style={{  }}
              placeholder="Joaquin Phoenix"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, }}
              variant="outlined"
              value={actorInput.name}
              onChange={(event) => {
                const newActorsInput = [...actorsInput];
                const foundIndex = newActorsInput.indexOf(actorInput);
                newActorsInput[foundIndex].name = event.target.value;
                setActorsInput(newActorsInput);
                props.onChange(newActorsInput);
              }}
            />
          </Grid>

          <Tooltip title="Delete actor">
            <IconButton
              color="secondary"
              style={{ position: 'absolute', top: 0, left: 0, }}
              onClick={() => {
                const newActorsInput = [...actorsInput];
                const foundIndex = newActorsInput.indexOf(actorInput);
                if (foundIndex > -1) {
                  newActorsInput.splice(foundIndex, 1);
                }
                setActorsInput(newActorsInput);
                props.onChange(newActorsInput);
              }}
            >
              <IconClose />
            </IconButton>
          </Tooltip>
        </Grid>
      ))}
      <Button
        onClick={() => {
          const newActorsInput = [...actorsInput];
          newActorsInput.push({ avatar: '', name: '' });
          setActorsInput(newActorsInput);
          props.onChange(newActorsInput);
        }}
        color="primary"
        variant="contained"
        fullWidth
      >
        Add more actor
      </Button>
    </div>
  );
}

export default MultipleInputActors;