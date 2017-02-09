import React from 'react';
import Auth from '../modules/Auth';
import Dashboard from '../components/Dashboard.jsx';
// import BarSearch from '../components/BarSearch.jsx';


class DashboardPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      secretData: "",
      blist: []
    };
    this.updateList()
  }

  deleteBar(selectedRows){
    const bar = this.state.blist[selectedRows[0]]
    // console.log('selectedRows',selectedRows)
    // console.log('selectedRows[0]',selectedRows[0])
    // console.log('barid',barid)
    const xhr = new XMLHttpRequest();
    const em = Auth.getEmail()
    xhr.open('get', '/api/removeBarFromUser'
      +(em ? "?uid=" + em : "")
      +(bar.barid ? "&barid=" + bar.barid : "")
      );
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log('deleteBar',xhr.response.message)
        this.updateSecretData(xhr.response.message)
        this.updateList()
        // this.setState({
        //   secretData: xhr.response.message
        // });
      }
    });
    xhr.send();
  }

  updateList() {
    const xhr = new XMLHttpRequest();
    console.log('hello from updatelist')
    const em = Auth.getEmail()
    xhr.open('get', '/api/viewUser'+(em ? "?uid=" + em : ""));
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      this.setState({
        blist: xhr.response.barIDs
      });

      });
    xhr.send();
  }

  updateSecretData(x) {
    this.setState({
      secretData: x
    })
  }
  /**
   * This method will be executed after initial rendering.
   */
  componentDidMount() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/dashboard');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log('this.updateSecretData1',this.updateSecretData)
        this.updateSecretData(xhr.response.message).bind(this)
      }
    });
    xhr.send();
  }

  /**
   * Render the component.
   */
  render() {
    // this.updateList().then((blist) => {
    //       console.log('hello from dashboardpage', blist);
    //       return (<div>
    //         <Dashboard secretData={this.state.secretData} barList={blist}/>
    //         </div>);
    // } )
    // let blist = this.updateList()
    // console.log('hello from dashboardpage', blist);
    // console.log('blist render',this.state.blist)
    // console.log('this.updateSecretData2',this.updateSecretData)
    // console.log('this.updateList2',this.updateList)
    return (<div>
      <Dashboard secretData={this.state.secretData} 
          updateSecretData={this.updateSecretData.bind(this)} 
          barList={this.state.blist} 
          functiondeleteBar={this.deleteBar.bind(this)}
          updateList={this.updateList.bind(this)}/>
      </div>);
      
  }

}

export default DashboardPage;