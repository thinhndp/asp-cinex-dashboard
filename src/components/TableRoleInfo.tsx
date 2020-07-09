import React, { FunctionComponent } from 'react';

// Component
import IconCheck from '@material-ui/icons/CheckCircleOutline';
import IconUncheck from '@material-ui/icons/HighlightOff';

interface ITableRoleInfoProps {
}

const ROLES = [
  {
    id: "1",
    role: "Admin",
    permissionIds: ['clusters', 'genres', 'screenTypes', 'rates', 'movies', 'rooms', 'discounts', 'users', 'showtimes'],
  },
  {
    id: "2",
    role: "Staff",
    permissionIds: ['showtimes'],
  },
]

const PERMISSIONS = [
  {
    id: 'clusters',
    name: 'Clusters',
  },
  {
    id: 'genres',
    name: 'Genres',
  },
  {
    id: 'screenTypes',
    name: 'Screen Types',
  },
  {
    id: 'rates',
    name: 'Rates',
  },
  {
    id: 'movies',
    name: 'Movies',
  },
  {
    id: 'rooms',
    name: 'Rooms',
  },
  {
    id: 'discounts',
    name: 'Discounts',
  },
  {
    id: 'users',
    name: 'Users',
  },
  {
    id: 'showtimes',
    name: 'Showtimes',
  },
]

const TableRoleInfo: FunctionComponent<ITableRoleInfoProps> = (props) => {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: 'flex', width: '100%', }}>
        <div style={{ flex: 1, padding: '3px', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc' }}></div>
        {
          ROLES.map(role => (
            <div style={{ flex: 1, padding: '3px', borderBottom: '1px solid #ccc', textAlign: 'center', }}>{role.role.charAt(0).toUpperCase() + role.role.slice(1)}</div>
          ))
        }
      </div>
      {PERMISSIONS.map(permission => (
        <div style={{ display: 'flex', width: '100%', }}>
          <div style={{ flex: 1, padding: '2px', borderRight: '1px solid #ccc' }}>Manage {permission.name}</div>
          {
            ROLES.map(role => (
              <div style={{ flex: 1, padding: '2px', textAlign: 'center', }}>
                {role.permissionIds.includes(permission.id) ? <IconCheck style={{ color: '#3DFF7B' }} /> : <IconUncheck style={{ color: '#FF7270' }} />}
              </div>
            ))
          }
        </div>
      ))}
    </div>
  );

  // return (
  //   <div style={{ width: 700 }}>
  //     <div style={{ display: 'flex', width: '100%', }}>
  //       <div style={{ flex: 1, padding: '5px', borderBottom: '2px solid #aaa', borderRight: '2px solid #aaa' }}></div>
  //       <div style={{ flex: 1, padding: '5px', borderBottom: '2px solid #aaa', textAlign: 'center', }}>Admin</div>
  //       <div style={{ flex: 1, padding: '5px', borderBottom: '2px solid #aaa', textAlign: 'center', }}>Staff</div>
  //     </div>
  //     <div style={{ display: 'flex', width: '100%', }}>
  //       <div style={{ flex: 1, padding: '5px', borderRight: '2px solid #aaa' }}>Manage Clusters</div>
  //       <div style={{ flex: 1, padding: '5px', textAlign: 'center', }}><IconCheck style={{ color: 'green' }} /></div>
  //       <div style={{ flex: 1, padding: '5px', textAlign: 'center', }}><IconCheck style={{ color: 'green' }} /></div>
  //     </div>
  //     <div style={{ display: 'flex', width: '100%', }}>
  //       <div style={{ flex: 1, padding: '5px', borderRight: '2px solid #aaa' }}>Manage Rates</div>
  //       <div style={{ flex: 1, padding: '5px', textAlign: 'center', }}><IconCheck style={{ color: 'green' }} /></div>
  //       <div style={{ flex: 1, padding: '5px', textAlign: 'center', }}><IconCheck style={{ color: 'green' }} /></div>
  //     </div>
  //     <div style={{ display: 'flex', width: '100%', }}>
  //       <div style={{ flex: 1, padding: '5px', borderRight: '2px solid #aaa' }}>Manage Rooms</div>
  //       <div style={{ flex: 1, padding: '5px', textAlign: 'center', }}><IconCheck style={{ color: 'green' }} /></div>
  //       <div style={{ flex: 1, padding: '5px', textAlign: 'center', }}><IconUncheck style={{ color: 'red' }} /></div>
  //     </div>
  //   </div>
  // );
}

TableRoleInfo.defaultProps = {
}

export default TableRoleInfo;