import React, { useEffect, useState, FunctionComponent } from 'react';

// Misc
import * as movieAPI from '../../../api/movieAPI';
import * as rateAPI from '../../../api/rateAPI';
import * as screenTypeAPI from '../../../api/screenTypeAPI';

// Interface
import { Movie } from '../../../interfaces/movie';
import { Rate } from '../../../interfaces/rate';
import { ScreenType } from '../../../interfaces/screenType';

// Component
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import MaterialTable, { Column, MTableAction } from 'material-table';

// Custom Component
import DialogAddMovie from './components/DialogAddMovie';
import DialogEditMovie from './components/DialogEditMovie';
import DialogYesNo from '../../../components/DialogYesNo';
import moment from 'moment';

// Class
// import classes from './PageMovies.module.scss';

const PageMovies: FunctionComponent = () => {
  const [movies, setMovies] = useState<Array<Movie>>([]);
  const [screenTypeList, setScreenTypeList] = useState<Array<ScreenType>>([]); // Naming convention: use abcList for non-primary array 
  const [rateList, setRateList] = useState<Array<Rate>>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  // Add Dialog
  const [isDialogAddOpen, setIsDialogAddOpen] = useState(false);
  // Edit Dialog
  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  // Delete Dialog
  const [movieIdToDelete, setMovieIdToDelete] = useState(''); // TODO: Find out if we need to make this a state
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  
  const columns: Array<Column<Movie>> = [
    // { title: 'Id', field: 'id', editable: 'never', cellStyle: {width: '300px'} },
    { title: 'Title', field: 'title', cellStyle: {width: '300px'} },
    {
      title: 'Genres',
      field: 'genres',
      render: (rowData) => {
        const genresDisplay = rowData.genres.map(genre => genre.name).join(', ');
        return (<span>{genresDisplay}</span>)
      }
    },
    {
      title: 'Screen types',
      field: 'screenTypes',
      render: (rowData) => {
        const screenTypesDisplay = rowData.screenTypes.map(screenType => screenType.name).join(', ');
        return (<span>{screenTypesDisplay}</span>)
      }
    },
    {
      title: 'Directors',
      field: 'directors',
      render: (rowData) => {
        const directorsDisplay = rowData.directors.join(', ');
        return (<span>{directorsDisplay}</span>)
      }
    },
    {
      title: 'Actors',
      field: 'actors',
      render: (rowData) => {
        const actorsDisplay = rowData.actors.map(actor => actor.name).join(', ');
        return (<span>{actorsDisplay}</span>)
      }
    },
    { title: 'Country', field: 'country', cellStyle: {width: '200px'} },
    {
      title: 'Released',
      field: 'releasedAt',
      render: (rowData) => {
        const releasedDisplay = moment(rowData.releasedAt).format('DD/MM/YYYY');
        return (<span>{releasedDisplay}</span>)
      },
    },
    {
      title: 'End at',
      field: 'endAt',
      render: (rowData) => {
        const endAtDisplay = moment(rowData.endAt).format('DD/MM/YYYY');
        return (<span>{endAtDisplay}</span>)
      },
    },
    // { title: 'End at', field: 'endAt', cellStyle: {width: '200px'} },
    { title: 'Duration (min)', field: 'runtime', cellStyle: {width: '200px'} },
    {
      title: 'Poster',
      field: 'poster',
      render: (rowData) => {
        return (<span><img src={rowData.poster} alt={rowData.title} style={{height: 150, width: 'auto'}} /></span>)
      }
    },
    {
      title: 'Rated',
      field: 'rate',
      render: (rowData) => {
        return (<span>{rowData.rate ? rowData.rate.name : ''}</span>)
      }
    },
  ]

  useEffect(() => {
    getAllMovies();
    getRateList();
    getScreenTypeList();
  }, []);

  const getAllMovies = () => {
    setIsTableLoading(true);
    movieAPI.getAllMovies()
      .then(response => {
        setIsTableLoading(false);
        setMovies(response.data);
      })
      .catch(err => {
        setIsTableLoading(false);
        console.log(err);
      })
  }

  const getScreenTypeList = () => {
    screenTypeAPI.getAllScreenTypes()
      .then(response => {
        setScreenTypeList(response.data);
      })
      .catch(err => {
        console.log(err);
      })
  }
  
  const getRateList = () => {
    rateAPI.getAllRates()
      .then(response => {
        setRateList(response.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const onAddClick = () => {
    setIsDialogAddOpen(true);
  }

  const onUpdateClick = (event: any, movie: any) => {
    setMovieToEdit(movie);
    setIsDialogEditOpen(true);
  }
  
  const onDeleteClick = (event: any, movie: any) => {
    setMovieIdToDelete(movie.id);
    setIsDialogDeleteOpen(true);
  }

  const deleteMovie = (id: string) => {
    setIsLoadingDelete(true);
    movieAPI.deleteMovie(id)
      .then((response) => {
        setIsLoadingDelete(false);
        closeDialogDelete();
        getAllMovies();
      })
      .catch((err) => {
        setIsLoadingDelete(false);
        console.log(err);
      })
  }

  const closeDialogDelete = () => {
    setIsDialogDeleteOpen(false);
    setMovieIdToDelete('');
  }

  return (
    <div>
      <MaterialTable
        title="Movies"
        isLoading={isTableLoading}
        columns={columns}
        data={movies}
        options={{
          headerStyle: {
            backgroundColor: '#009be5',
            color: '#fff',
          },
          rowStyle: {
            backgroundColor: '#eee',
          },
        }}
        actions={[
          { icon: 'edit', tooltip: 'Edit', onClick: (event, rowData) => onUpdateClick(event, rowData) },
          { icon: 'delete', tooltip: 'Delete', onClick: (event, rowData) => onDeleteClick(event, rowData) },
          { icon: 'add', tooltip: 'Add', onClick: () => {}, isFreeAction: true }, // Will be overrided right below
        ]}
        components={{
          Action: prevProps => {
            if (prevProps.action.icon === 'add') {
              // Override 'add' Action
              return <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{marginLeft: '20px'}} onClick={() => onAddClick()}>Add Movie</Button>;
            }

            return <MTableAction {...prevProps} />
          }
        }}
      />

      <DialogAddMovie
        isOpen={isDialogAddOpen}
        rateList={rateList}
        screenTypeList={screenTypeList}
        onClose={() => {
          setIsDialogAddOpen(false);

          // setTimeout temp fix: transition (animation) doesn't catch up on setMovieToEdit(null)
          // TODO: Fix this
          setTimeout(() => {
            setMovieToEdit(null);
          }, 150);
        }}
        onSave={() => {
          setIsDialogAddOpen(false);

          // setTimeout temp fix: transition (animation) doesn't catch up on setMovieToEdit(null)
          // TODO: Fix this
          setTimeout(() => {
            setMovieToEdit(null);
          }, 150);

          getAllMovies();
        }}
      />
      
      <DialogEditMovie
        isOpen={isDialogEditOpen}
        movieToEdit={movieToEdit}
        rateList={rateList}
        screenTypeList={screenTypeList}
        onClose={() => {
          setIsDialogEditOpen(false);

          // setTimeout temp fix: transition (animation) doesn't catch up on setMovieToEdit(null)
          // TODO: Fix this
          setTimeout(() => {
            setMovieToEdit(null);
          }, 150);
        }}
        onSave={() => {
          setIsDialogEditOpen(false);

          // setTimeout temp fix: transition (animation) doesn't catch up on setMovieToEdit(null)
          // TODO: Fix this
          setTimeout(() => {
            setMovieToEdit(null);
          }, 150);

          getAllMovies();
        }}
      />

      <DialogYesNo
        isOpen={isDialogDeleteOpen}
        isLoadingYes={isLoadingDelete}
        onYes={() => {deleteMovie(movieIdToDelete);}}
        onNo={() => {closeDialogDelete();}}
        onClose={() => {closeDialogDelete();}}
      />
    </div>
  );
}

export default PageMovies;