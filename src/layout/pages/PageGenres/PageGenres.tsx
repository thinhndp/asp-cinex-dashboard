import React, { useEffect, useState, FunctionComponent } from 'react';

// Misc
import * as genreAPI from '../../../api/genreAPI';

// Interface
import { Genre } from '../../../interfaces/genre';

// Component
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import MaterialTable, { Column, MTableAction } from 'material-table';

// Custom Component
import DialogAddOrEditGenre from './components/DialogAddOrEditGenre';
import DialogYesNo from '../../../components/DialogYesNo';

// Class
// import classes from './PageGenres.module.scss';

const PageGenres: FunctionComponent = () => {
  const [genres, setGenres] = useState<Array<Genre>>([]);
  const [genreToEdit, setGenreToEdit] = useState<Genre | null>(null);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isDialogAddOrEditOpen, setIsDialogAddOrEditOpen] = useState(false);
  // Delete Dialog
  const [genreIdToDelete, setGenreIdToDelete] = useState(''); // TODO: Find out if we need to make this a state
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  
  const columns: Array<Column<Genre>> = [
    { title: 'Id', field: 'id', editable: 'never', cellStyle: {width: '300px'} },
    { title: 'Name', field: 'name' },
  ]

  useEffect(() => {
    getAllGenres();
  }, []);

  const getAllGenres = () => {
    setIsTableLoading(true);
    genreAPI.getAllGenres()
      .then(response => {
        setIsTableLoading(false);
        setGenres(response.data);
      })
      .catch(err => {
        setIsTableLoading(false);
        console.log(err);
      })
  }

  const onAddClick = () => {
    setIsDialogAddOrEditOpen(true);
  }

  const onUpdateClick = (event: any, genre: any) => {
    setGenreToEdit(genre);
    setIsDialogAddOrEditOpen(true);
  }
  
  const onDeleteClick = (event: any, genre: any) => {
    setGenreIdToDelete(genre.id);
    setIsDialogDeleteOpen(true);
  }
  
  const deleteGenre = (id: string) => {
    setIsLoadingDelete(true);
    genreAPI.deleteGenre(id)
      .then((response) => {
        setIsLoadingDelete(false);
        closeDialogDelete();
        getAllGenres();
      })
      .catch((err) => {
        setIsLoadingDelete(false);
        console.log(err);
      })
  }
  
  const closeDialogDelete = () => {
    setGenreIdToDelete('');
    setIsDialogDeleteOpen(false);
  }

  return (
    <div>
      <MaterialTable
        title="Genres"
        isLoading={isTableLoading}
        columns={columns}
        data={genres}
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
              return <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{marginLeft: '20px'}} onClick={() => onAddClick()}>Add Genre</Button>;
            }

            return <MTableAction {...prevProps} />
          }
        }}
      />

      <DialogAddOrEditGenre
        genreToEdit={genreToEdit}
        isOpen={isDialogAddOrEditOpen}
        onClose={() => {
          setIsDialogAddOrEditOpen(false);

          // setTimeout temp fix: transition (animation) doesn't catch up on setGenreToEdit(null)
          // TODO: Fix this
          setTimeout(() => {
            setGenreToEdit(null);
          }, 150);
        }}
        onSave={() => {
          setIsDialogAddOrEditOpen(false);

          // setTimeout temp fix: transition (animation) doesn't catch up on setGenreToEdit(null)
          // TODO: Fix this
          setTimeout(() => {
            setGenreToEdit(null);
          }, 150);

          getAllGenres();
        }}
      />

      
      <DialogYesNo
        isOpen={isDialogDeleteOpen}
        isLoadingYes={isLoadingDelete}
        onYes={() => {deleteGenre(genreIdToDelete);}}
        onNo={() => {closeDialogDelete();}}
        onClose={() => {closeDialogDelete();}}
      />
    </div>
  );
}

export default PageGenres;