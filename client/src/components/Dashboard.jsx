import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import BarSearch from '../components/BarSearch.jsx';


const Dashboard = ({ secretData, updateSecretData, barList, functiondeleteBar, updateList}) => (
  <Card className="container">
    <CardTitle
      title="Dashboard"
      subtitle="You should get access to this page only after authentication."
    />

    {secretData && <CardText style={{ fontSize: '16px', color: 'green' }}>{secretData}</CardText>}
    <CardText>
      <Table onRowSelection={(selectedRows) => {functiondeleteBar(selectedRows)}}>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Name <br/> Address </TableHeaderColumn>
              <TableHeaderColumn>Going</TableHeaderColumn>
              <TableHeaderColumn>Image</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
    {
      // barList ? JSON.stringify(barList) : "No Bars Selected"
          barList.map((x, i) => (
              <TableRow key={i}>
                <TableRowColumn>
                  <a href={x.url} target="_blank">{x.name}</a> <br/>
                  {x.loc}
                </TableRowColumn>
                <TableRowColumn>{x.going.join(', ')}</TableRowColumn>
                <TableRowColumn><img src={x.img} alt={x.barid} height="64px" /></TableRowColumn>
              </TableRow>
          ))
    }
        </TableBody>
      </Table>
    </CardText>
    <BarSearch updateSecretData={updateSecretData} updateList={updateList}/>
  </Card>
);

Dashboard.propTypes = {
  secretData: PropTypes.string.isRequired
};

export default Dashboard;



// import React from 'react';
// import { Card, CardTitle } from 'material-ui/Card';
// import BarSearch from '../components/BarSearch.jsx';


// const HomePage = () => (
//   <Card className="container">
//     <CardTitle title="React Application" subtitle="This is the home page." />
//     <BarSearch />
//   </Card>
// );

// export default HomePage;