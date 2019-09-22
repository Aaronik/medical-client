import axios from 'axios'
import { dispatch } from '../../store'
let FormData        = require( 'form-data' );
// this is the user session token returned with each call to authenticate.
// if you are already "authenticated" and you authenticate again, a new token is generated
// nullifying the previous session (e.g. two of same user cannot be logged in at the same time).
var myToken = ""

// the flagship api host, where all the goodies are
// this will be set by querying the discovery service for an available
// flagship host.
var myFlagshipHost = ""

// the discovery service host, which gives us the url of flagship api host we want to call.
// it will pick a random one from the set of available stateless api servers.
// TODO @Bow make this available as a remote configuration value that can be shared.
var discoveryServiceHost = "ec2-3-19-237-167.us-east-2.compute.amazonaws.com:9000"

// TODO @Bow make this https on prod when certs are ready
var protocol = 'http'
// TODO @Aaron disable login controls until host map and host are resolved
function loadHostMap() {
  console.log("Loading Host Map")
  // TODO 
  axios({
    // This host url is the dynamic discovery service. You can use it to select hosts
    // from the serviceMap under the flagship node.
    /**
     * <code>
     * flagship: {
     *  ec2-18-188-238-37.us-east-2.compute.amazonaws.com:9000: {
     *    token: "WldNeUxURTRMVEU0T0MweU16Z3RNemN1ZFhNdFpXRnpkQzB5TG1OdmJYQjFkR1V1WVcxaGVtOXVZWGR6TG1OdmJUbzVNREF3T2pvMU1qTXdNek14",
     *    currentEpochTime: 1569099406480,
     *    securehost: false
     *  }
     * }
     * </code>
     */
    url: getDiscoveryServiceUrl("/api/milli/dynamicdiscovery/mesh/hosts?serviceKey=flagship"),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: "get",
    withCredentials: true
  })
  .then(handleLoadFlagshipHosts)
  .catch(function(error) {
      console.error("Failed to get flagship host", error);
  })
}

function correctPath(path:string):string {
  if(path.charAt(0) != '/') {
    path = '/' + path;
  }
  return path;
}

// returns the discovery service url, we use this to load the host map
function getDiscoveryServiceUrl(path: string):string {
  return protocol + '://' + discoveryServiceHost + correctPath(path)
}

// returns a full url from the selected flagship host
function getFlagshipEndpointUrl(path: string) {
  return protocol + '://' + myFlagshipHost + correctPath(path);
}


// handle loading hosts for flagship api
function handleLoadFlagshipHosts(response: any) {
  console.log("Loaded Service Hosts", response.data);

  /**
   * Data format:
   * {
   *   "hosts": [{
   *     "hostUrl": "ec2-18-188-238-37.us-east-2.compute.amazonaws.com",
   *     "port": 9000,
   *     "token": "ZWMyLTE4LTE4OC0yMzgtMzcudXMtZWFzdC0yLmNvbXB1dGUuYW1hem9uYXdzLmNvbTo5MDAwOjo1MjMwMzY1",
   *     "secure": false,
   *     "fullUrl": "ec2-18-188-238-37.us-east-2.compute.amazonaws.com:9000"
   *   }],
   *   "serviceToken": "",
   *   "serviceMap": {},
   *   "unannounced": false
   * }
   */
  var flagshipCluster = response.data.hosts;

  if(flagshipCluster != null) {
    // between 0 and len -1
    // this picks one at random
    console.log("total known hosts: " + flagshipCluster.length);

    if(flagshipCluster.length == 0) {
      console.error("No hosts were loaded please make sure discovery server are online at: " + discoveryServiceHost);
    } else {
      var randRound = Math.max(Math.round(Math.random() * flagshipCluster.length-1), flagshipCluster.length-1);
      console.log("Selecting host at : " + randRound)
      
      var host = flagshipCluster[randRound];
      var hostName = host.fullUrl;
      myFlagshipHost = hostName;
      
      console.log("selected host " + myFlagshipHost)
      addTokenToRequest()
    }
  } else {
    console.error("Cluster was null for flagship");
  }
}

/**
 * Response from the server is just an object. We care about the sesion token
 * specifically
 * {
 *   data: {
 *      sessionToken64: "blah12="
 *   }
 * }
 */
function updateMySessionToken(response : any) {
  console.log("Response", response);
  myToken = response.data.sessionToken64
  dispatch({ type: 'LOGIN_1', payload: response })
}

function clearMySession(response: any) {
  //handle success
  console.log(response);
  myToken = '';
  dispatch({ type: 'LOGOUT_1', payload: response })
}

// TODO @Bow, @Aaron -> Eventually this will be done by loading the application page
// TODO @Bow, @Aaron -> This adds CSRF Token to the request on the server before calling any post or delete methods

// calling the token endpoint means you generate a csrf token
// server side. Logging in needs nothing but user / pwd (Basic Auth)
export const addTokenToRequest = async () => {
  axios({
    //url: 'http://localhost:80/',
    url: getFlagshipEndpointUrl('/token'),
    headers: {
      'Accept': 'application/json; text/html',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: "get",
    withCredentials: true
  }).then(function(response){
    // TODO @Aaron at this point you can enable controls to login
    console.log("Token added to request", response.data)
  }).catch(function(err){
    // TODO @Aaron tell the user the server is unavailable.
    console.error("Token not added to request", err);
  })
}

export const loginWhatever = async () => {
  axios({
    url: getFlagshipEndpointUrl('/flagship/api/authenticate'),
    headers: {
      // TODO @Aaron - write the encoder for username and password to generate authorization header.
      'Authorization': 'Basic Ym9vbWFtYToxMTExMQ==',
      'Accept': 'application/json; text/html',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: "post",
    // TODO @Bow - for now this needs at least some non-null form data or the server pukes.
    data: {
     x: '1'
    },
    withCredentials: true,
  })
  .then(updateMySessionToken)
  .catch(function(err){
    console.error(err);
    dispatch({ type: 'LOGIN_1', payload: err })
  })
}

export const logoutWhatever = async () => {
  // TODO @Bow - for now this needs at least some non-null form data or the server pukes.
  let formData = new FormData();
  formData.append('x', 1);

  axios({
    url: getFlagshipEndpointUrl('/flagship/api/logout'),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
      'Session-Token': myToken,
    },
    data: formData,
    method: "delete",
    withCredentials: true,
  })
  .then(clearMySession)
  .catch(function (err) {
      //handle error
      console.error(err);
      dispatch({ type: 'LOGOUT_1', payload: err })
  })
}

// the first thing when page loads:
loadHostMap();
