import React, { useEffect, useState, FunctionComponent } from 'react';

// Misc
import * as showtimeAPI from '../../../api/showtimeAPI';
import * as clusterAPI from '../../../api/clusterAPI';
import * as movieAPI from '../../../api/movieAPI';
import * as roomAPI from '../../../api/roomAPI';
import * as screenTypeAPI from '../../../api/screenTypeAPI';
import moment from 'moment';

// Interface
import { Showtime } from '../../../interfaces/showtime';
import { Movie } from '../../../interfaces/movie';
import { Room } from '../../../interfaces/room';
import { ScreenType } from '../../../interfaces/screenType';

// Component
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import MaterialTable, { Column, MTableAction, MTableToolbar } from 'material-table';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

// Custom Component
import DialogAddOrEditShowtime from './components/DialogAddOrEditShowtime';
import DialogYesNo from '../../../components/DialogYesNo';
import { Cluster } from '../../../interfaces/cluster';

// Class
// import classes from './PageShowtimes.module.scss';

const PageShowtimes: FunctionComponent = () => {
  const [showtimes, setShowtimes] = useState<Array<Showtime>>([]);
  const [selectedClusterId, setSelectedClusterId] = useState<string>('');
  const [clusterList, setClusterList] = useState<Array<Cluster>>([]); // Naming convention: use abcList for non-primary array
  const [movieList, setMovieList] = useState<Array<Movie>>([]);
  const [roomList, setRoomList] = useState<Array<Room>>([]);
  const [screenTypeList, setScreenTypeList] = useState<Array<ScreenType>>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  // Add or edit Dialog
  const [isDialogAddOrEditOpen, setIsDialogAddOrEditOpen] = useState(false);
  const [showtimeToEdit, setShowtimeToEdit] = useState<Showtime | null>(null);
  // Delete Dialog
  const [showtimeIdToDelete, setShowtimeIdToDelete] = useState(''); // TODO: Find out if we need to make this a state
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  
  const columns: Array<Column<Showtime>> = [
    // { title: 'Id', field: 'id', editable: 'never', cellStyle: {width: '300px'} },
    // { title: 'Room', field: 'title', cellStyle: {width: '300px'} },
    {
      title: 'Room',
      field: 'room',
      render: (rowData) => {
        const roomDisplay = rowData.room.name;
        return (<span>{roomDisplay}</span>)
      }
    },
    {
      title: 'Movie',
      field: 'movie',
      render: (rowData) => {
        const movieDisplay = rowData.movie.title;
        return (<span>{movieDisplay}</span>)
      }
    },
    {
      title: 'Start at',
      field: 'startAt',
      render: (rowData) => {
        const startAtDisplay = moment(rowData.startAt).format('MMM. D, YYYY [at] h:mm A z');
        return (<span>{startAtDisplay}</span>)
      }
    },
    {
      title: 'End at',
      field: 'endAt',
      render: (rowData) => {
        const endAtDisplay = moment(rowData.endAt).format('MMM. D, YYYY [at] h:mm A z');
        return (<span>{endAtDisplay}</span>)
      }
    },
    {
      title: 'Screen type',
      field: 'screenType',
      render: (rowData) => {
        const screenTypeDisplay = rowData.screenType.name;
        return (<span>{screenTypeDisplay}</span>)
      }
    },
    {
      title: 'Price',
      field: 'basePrice',
      render: (rowData) => {
        const priceDisplay = '$' + rowData.basePrice.toLocaleString();
        return (<span>{priceDisplay}</span>)
      }
    },
    { title: 'Status', field: 'status', cellStyle: {width: '200px'} },
  ]

  useEffect(() => {
    // getAllShowtimes();
    getClusterList();
    getMovieList();
    // getRoomList();
    getScreenTypeList();
  }, []);
  
  useEffect(() => {
    if (clusterList.length > 0) {
      setSelectedClusterId(clusterList[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterList]);

  useEffect(() => {
    if (selectedClusterId !== '') {
      getAllShowtimesByClusterId();
      getRoomListByCluster();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClusterId]);
  
  // const getAllShowtimes = () => {
  //   setIsTableLoading(true);
  //   showtimeAPI.getAllShowtimes()
  //     .then(response => {
  //       setIsTableLoading(false);
  //       setShowtimes(response.data);
  //     })
  //     .catch(err => {
  //       setIsTableLoading(false);
  //       console.log(err);
  //     })
  // }

  const getAllShowtimesByClusterId = () => {
    setIsTableLoading(true);
    showtimeAPI.getAllShowtimesByClusterId(selectedClusterId)
      .then(response => {
        setIsTableLoading(false);
        setShowtimes(response.data);
      })
      .catch(err => {
        setIsTableLoading(false);
        console.log(err);
      })
  }
  
  const getClusterList = () => {
    setIsTableLoading(true);
    clusterAPI.getAllClusters()
      .then(response => {
        setIsTableLoading(false);
        setClusterList(response.data);
      })
      .catch(err => {
        console.log(err);
      })
  }
  
  const getMovieList = () => {
    movieAPI.getAllMovies()
      .then(response => {
        setMovieList(response.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const getRoomListByCluster = () => {
    roomAPI.getAllRoomsByClusterId(selectedClusterId)
      .then(response => {
        setRoomList(response.data);
      })
      .catch(err => {
        console.log(err);
      })
  }
  
  // const getRoomList = () => {
  //   roomAPI.getAllRooms()
  //     .then(response => {
  //       setRoomList(response.data);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     })
  // }

  const getScreenTypeList = () => {
    screenTypeAPI.getAllScreenTypes()
      .then(response => {
        setScreenTypeList(response.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const onAddClick = () => {
    setIsDialogAddOrEditOpen(true);
  }

  const onUpdateClick = (event: any, showtime: any) => {
    setShowtimeToEdit(showtime);
    setIsDialogAddOrEditOpen(true);
  }
  
  const onDeleteClick = (event: any, showtime: any) => {
    setShowtimeIdToDelete(showtime.id);
    setIsDialogDeleteOpen(true);
  }

  const deleteShowtime = (id: string) => {
    setIsLoadingDelete(true);
    showtimeAPI.deleteShowtime(id)
      .then((response) => {
        setIsLoadingDelete(false);
        closeDialogDelete();
        getAllShowtimesByClusterId();
      })
      .catch((err) => {
        setIsLoadingDelete(false);
        console.log(err);
      })
  }

  const closeDialogDelete = () => {
    setIsDialogDeleteOpen(false);
    setShowtimeIdToDelete('');
  }

  return (
    <div>
      <MaterialTable
        title="Showtimes"
        isLoading={isTableLoading}
        columns={columns}
        data={showtimes}
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
              return <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{marginLeft: '20px'}} onClick={() => onAddClick()}>Add Showtime</Button>;
            }

            return <MTableAction {...prevProps} />
          },
          Toolbar: prevProps => {
            return (
              <div>
                <MTableToolbar {...prevProps} />

                <div style={{display: 'flex', alignItems: 'center', paddingLeft: '24px', marginBottom: '12px'}}>
                  <div style={{marginRight: '10px', fontWeight: 'bold', fontSize: '16px', color: '#333'}}>Cluster:</div>
                  <Select
                    labelId="cluster-select-label"
                    value={selectedClusterId}
                    variant="outlined"
                    onChange={(event: any) => {setSelectedClusterId(event.target.value as string)}}
                  >
                    {clusterList.map(cluster => (
                      <MenuItem key={cluster.id} value={cluster.id}>{cluster.name}</MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
            )
          }
        }}
      />

      <DialogAddOrEditShowtime
        showtimeToEdit={showtimeToEdit}
        clusterList={clusterList}
        selectedClusterId={selectedClusterId}
        movieList={movieList}
        roomList={roomList}
        screenTypeList={screenTypeList}
        isOpen={isDialogAddOrEditOpen}
        onClose={() => {
          setIsDialogAddOrEditOpen(false);

          // setTimeout temp fix: transition (animation) doesn't catch up on setShowtimeToEdit(null)
          // TODO: Fix this
          setTimeout(() => {
            setShowtimeToEdit(null);
          }, 150);
        }}
        onSave={() => {
          setIsDialogAddOrEditOpen(false);

          // setTimeout temp fix: transition (animation) doesn't catch up on setShowtimeToEdit(null)
          // TODO: Fix this
          setTimeout(() => {
            setShowtimeToEdit(null);
          }, 150);

          getAllShowtimesByClusterId();
        }}
      />

      <DialogYesNo
        isOpen={isDialogDeleteOpen}
        isLoadingYes={isLoadingDelete}
        onYes={() => {deleteShowtime(showtimeIdToDelete);}}
        onNo={() => {closeDialogDelete();}}
        onClose={() => {closeDialogDelete();}}
      />
    </div>
  );
}

export default PageShowtimes;