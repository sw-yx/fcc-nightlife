import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Auth from '../modules/Auth';
import _ from 'lodash';


// const BarSearchResult = ({ selectedBars, searchbartext, barList, functionPickBar}) => {
const BarSearchResult = ({ searchbartext, barList, functionPickBar}) => {
  
  // console.log('BarSearchResult', barList)
  if (!barList) {
    return (<p>Loading</p>)
  } else {
    // console.log('selectedBars',selectedBars)
    // console.log('barsearchresult',barList)
    var componentmap = barList.map((x, i) => (
      <TableRow key={i}>
        <TableRowColumn>
          <a href={x.url} target="_blank">{x.name}</a> <br/>
          {x.loc}
        </TableRowColumn>
        <TableRowColumn>{x.rating} <br/> ({x.reviews})</TableRowColumn>
        <TableRowColumn><img src={x.img} alt={x.id} height="64px" /></TableRowColumn>
      </TableRow>
    ))
    // <TableHeader displaySelectAll={false}>
    // <TableBody displayRowCheckbox={false}>
    return (<Card className="container">
      <CardTitle
        title="Bar List"
        subtitle={"List of " + searchbartext + " Bars."}
      />
      <Table onRowSelection={(selectedRows) => {functionPickBar(selectedRows)}}>
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
    // console.log('barsearch constructor', props);
    this.state = {
      barList: [],
      searchbartext: "",
      // selectedBars: props.selectedBars
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

  pickBar(selectedRows){
    const bar = this.state.barList[selectedRows[0]]
    console.log('selectedRows',selectedRows)
    // console.log('selectedRows[0]',selectedRows[0])
    // console.log('barid',barid)
    const xhr = new XMLHttpRequest();
    const em = Auth.getEmail()
    xhr.open('get', '/api/addBarToUser'
      +(em ? "?uid=" + em : "")
      +(bar.id ? "&barid=" + bar.id : "")
      +(bar.img ? "&barimg=" + bar.img : "")
      +(bar.name ? "&barname=" + bar.name : "")
      +(bar.url ? "&barurl=" + bar.url : "")
      +(bar.loc ? "&barloc=" + bar.loc : "")
      );
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log('pickBar',xhr.response.message)
        this.props.updateSecretData(xhr.response.message)
        this.props.updateList()
        // this.setState({
        //   secretData: xhr.response.message
        // });
      }
    });
    xhr.send();
  }

  /**
   * Render the component.
   */
  render() {
    // const delayedText = _.debounce((term) => {this.searchText(term).bind(this)},300);
    // console.log('this.searchText',this.searchText)
    // console.log('this.pickBar',this.pickBar)
    const delayedText = this.searchText.bind(this);
    return (<div>
      <TextField
        hintText="Hint Text"
        floatingLabelText="Enter your location"
        value={this.state.searchbartext}
        onChange={delayedText}
      /><br />
      <BarSearchResult searchbartext={this.state.searchbartext} barList={this.state.barList} functionPickBar={this.pickBar.bind(this)} />
      </div>);
  }

}

export default BarSearch;



