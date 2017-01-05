// https://github.com/stardotbmp/gas_JIRA_API

function test() {
  var endpoint = "priority/",
      parameters = "{}",
      titles = false,
      query = "/",
      parseOptions = "noHeader",
      includeUrl = true;
  
  var result = JIRAAPI(endpoint, parameters, titles, query, parseOptions, includeUrl);

  debugger;
}

/**
* Performs a JIRA API GET request to a given endpoint
*
* @param {"priority/"} endpoint The Jira API endpoint
* @param {"{'jql':'project = DMO'"} jql The JQL query as used in JIRA, Quoted JSON using single quotes.
* @param {false} titles A True/False flag to include the field titles
* @param {"summary, labels"} fields A JSON path query for the results
* @param {"/issues/fields/summary"} query A comma-separated list of paths to import. Any path starting with one of these paths gets imported.
* @param {IN DEVELOPMENT} parseOptions A comma-separated list of options that alter processing of the data
* @param {false} includeUrl A True/False flag to include the search url as a last row.
* @return An array of values including the matching rows and the columns specified in the filter - currently limited to a 1000 results
* @customfunction
*/
function JIRAAPI(endpoint, parameters, titles, query, parseOptions, includeUrl) {
  
  titles = titles || false;
  endpoint = endpoint || 'search/';
  query = query || "/issues/key";
  
  if(parameters) {
    parameters = parameters.replace(/'/gi,"\"");
  };
    
  try{
    parameters = JSON.parse(parameters);
  }catch(err){
    parameters = {
      maxResults: 5,
      fields: "",
      jql:encodeURI("project=DMO")
    };
  }
      
  var params = {},
      scriptProps = PropertiesService.getScriptProperties(),
      USERNAME = scriptProps.getProperty('jira_user'),
      PASSWORD = scriptProps.getProperty('jira_password'),
      JIRA_URL = scriptProps.getProperty('jira_url'),
      JIRA_SEARCH = scriptProps.getProperty('jira_url_search');
  
  var url = JIRA_URL;
  
  url += endpoint + "?";
  
  Object.keys(parameters).forEach(function(p){
    url += "&" + p + "=" + parameters[p];
  });
  
  params.headers = {
    'Authorization': 'Basic ' + Utilities.base64Encode(USERNAME + ':' + PASSWORD)
  };
  params.method = 'GET';
  params.muteHttpExceptions = true;
  params.contentType = 'application/json';
  
  var data = ImportJSONAdvanced(url, params, query, parseOptions, includeXPath_, defaultTransform_);
  var urlRow = new Array(data[0].length);

  if (includeUrl) {
    urlRow[0] = url;
    data = data.concat(urlRow);
  }
  
  return titles ? data : data.slice(1);
}