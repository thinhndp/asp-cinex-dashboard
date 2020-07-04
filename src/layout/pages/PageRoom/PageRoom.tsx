import React, { useEffect, useState, FunctionComponent } from 'react';

// Misc
import * as clusterAPI from '../../../api/clusterAPI';
import * as roomAPI from '../../../api/roomAPI';
import * as screenTypeAPI from '../../../api/screenTypeAPI';

// Interface
import { Cluster } from '../../../interfaces/cluster';
import { Room } from '../../../interfaces/room';
import { ScreenType } from '../../../interfaces/screenType';

// Component
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import MaterialTable, { Column, MTableAction, MTableToolbar } from 'material-table';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

// Custom Component
import DialogAddOrEditRoom from './components/DialogAddOrEditRoom';
import DialogYesNo from '../../../components/DialogYesNo';

// Class
// import classes from './PageRooms.module.scss';

const PageRooms: FunctionComponent = () => {
  const [rooms, setRooms] = useState<Array<Room>>([]);
  const [selectedClusterId, setSelectedClusterId] = useState<string>('');
  const [clusterList, setClusterList] = useState<Array<Cluster>>([]); // Naming convention: use abcList for non-primary array
  const [screenTypeList, setScreenTypeList] = useState<Array<ScreenType>>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  // Add or edit Dialog
  const [isDialogAddOrEditOpen, setIsDialogAddOrEditOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  // Delete Dialog
  const [roomIdToDelete, setRoomIdToDelete] = useState(''); // TODO: Find out if we need to make this a state
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  
  const columns: Array<Column<Room>> = [
    { title: 'Id', field: 'id', editable: 'never', cellStyle: {width: '300px'} },
    { title: 'Name', field: 'name' },
    {
      title: 'Screen types',
      field: 'screenTypes',
      render: (rowData) => {
        const screenTypesDisplay = rowData.screenTypes.map(screenType => screenType.name).join(', ');
        return (<span>{screenTypesDisplay}</span>)
      }
    },
    { title: 'Seats per row', field: 'totalSeatsPerRow', cellStyle: {width: '200px'} },
    { title: 'Total rows', field: 'totalRows', cellStyle: {width: '200px'} },
  ]

  useEffect(() => {
    // getAllRooms();
    getClusterList();
    getScreenTypeList();
  }, []);

  useEffect(() => {
    if (clusterList.length > 0) {
      setSelectedClusterId(clusterList[0].id);
    }
  }, [clusterList]);

  useEffect(() => {
    if (selectedClusterId !== '') {
      getAllRoomsByClusterId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClusterId]);

  const getAllRoomsByClusterId = () => {
    setIsTableLoading(true);
    roomAPI.getAllRoomsByClusterId(selectedClusterId)
      .then(response => {
        setIsTableLoading(false);
        setRooms(response.data);
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

  const onUpdateClick = (event: any, room: any) => {
    setRoomToEdit(room);
    setIsDialogAddOrEditOpen(true);
  }
  
  const onDeleteClick = (event: any, room: any) => {
    setRoomIdToDelete(room.id);
    setIsDialogDeleteOpen(true);
  }

  const deleteRoom = (id: string) => {
    setIsLoadingDelete(true);
    roomAPI.deleteRoom(id)
      .then((response) => {
        setIsLoadingDelete(false);
        closeDialogDelete();
        getAllRoomsByClusterId();
      })
      .catch((err) => {
        setIsLoadingDelete(false);
        console.log(err);
      })
  }

  const closeDialogDelete = () => {
    setIsDialogDeleteOpen(false);
    setRoomIdToDelete('');
  }

  return (
    <div>
      <MaterialTable
        title="Rooms"
        isLoading={isTableLoading}
        columns={columns}
        data={rooms}
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
              return <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{marginLeft: '20px'}} onClick={() => onAddClick()}>Add Room</Button>;
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

      <DialogAddOrEditRoom
        roomToEdit={roomToEdit}
        isOpen={isDialogAddOrEditOpen}
        clusterList={clusterList}
        screenTypeList={screenTypeList}
        selectedClusterId={selectedClusterId}
        onClose={() => {
          setIsDialogAddOrEditOpen(false);

          // setTimeout temp fix: transition (animation) doesn't catch up on setRoomToEdit(null)
          // TODO: Fix this
          setTimeout(() => {
            setRoomToEdit(null);
          }, 150);
        }}
        onSave={() => {
          setIsDialogAddOrEditOpen(false);

          // setTimeout temp fix: transition (animation) doesn't catch up on setRoomToEdit(null)
          // TODO: Fix this
          setTimeout(() => {
            setRoomToEdit(null);
          }, 150);

          // getAllRooms();
          getAllRoomsByClusterId();
        }}
      />

      <DialogYesNo
        isOpen={isDialogDeleteOpen}
        isLoadingYes={isLoadingDelete}
        onYes={() => {deleteRoom(roomIdToDelete);}}
        onNo={() => {closeDialogDelete();}}
        onClose={() => {closeDialogDelete();}}
      />
    </div>
  );
}

export default PageRooms;