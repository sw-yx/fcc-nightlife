import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Auth from '../modules/Auth';
import _ from 'lodash';


const BarSearchResult = ({ searchbartext, barList }) => {
  
  // console.log('BarSearchResult', barList)
  if (!barList) {
    return (<p>Loading</p>)
  } else {
    var componentmap = barList.map((x, i) => (
      // <CardText key={i} style={{ fontSize: '16px', color: 'green' }}>
      //   {x.name} |
      //   {x.rating} |
      //   {x.reviews} |
      //   {x.url} |
      //   {x.img}
      // </CardText>
      <TableRow key={i}>
        <TableRowColumn>
          <a href={x.url} target="_blank">{x.name}</a> <br/>
          {x.loc}
        </TableRowColumn>
        <TableRowColumn>{x.rating} <br/> ({x.reviews})</TableRowColumn>
        <TableRowColumn><img src={x.img} alt={x.id} height="64px" /></TableRowColumn>
      </TableRow>
    ))
    return (<Card className="container">
      <CardTitle
        title="Bar List"
        subtitle={"List of " + searchbartext + " Bars."}
      />
      <Table>
        <TableHeader displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn>Name <br/> Address </TableHeaderColumn>
            <TableHeaderColumn>Rating <br/> (Reviews)</TableHeaderColumn>
            <TableHeaderColumn>Image</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {componentmap}
        </TableBody>
      </Table>
    </Card>
    )
  }
};

// BarSearchResult.propTypes = {
//   barList: PropTypes.string.isRequired
// };


class BarSearch extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      barList: [],
      searchbartext: ""
    };
  }

  /**
   * This method will be executed after initial rendering.
   */
  searchText(e){
    // e.preventDefault()
    // e.persist()
    this.setState({
      searchbartext: e.target.value
    })
    // console.log('target',e.target.value)
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/yelp?loc=' + this.state.searchbartext);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    // xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      // console.log('addEventListener',xhr.status)
      if (xhr.status === 200) {
        this.setState({
          barList: xhr.response.message
        });
        // console.log('xhr.response.message',xhr.response.message)
      }
    });
    xhr.send();
  }
  // componentDidMount() {
  //   console.log('componentDidMount')
  // }

  /**
   * Render the component.
   */
  render() {
    // const delayedText = _.debounce((term) => {this.searchText(term).bind(this)},300);
    const delayedText = this.searchText.bind(this);
    return (<div>
      <TextField
        hintText="Hint Text"
        floatingLabelText="Floating Label Text"
        value={this.state.searchbartext}
        onChange={delayedText}
      /><br />
      <BarSearchResult searchbartext={this.state.searchbartext} barList={this.state.barList} />
      </div>);
  }

}

export default BarSearch;



