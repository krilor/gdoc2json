// Script-as-app template.
function doGet() {
  return HtmlService.createTemplateFromFile('appFront').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function doPost() {
  return HtmlService.createTemplateFromFile('appFront').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}


function getJson(ID) {
  

 
  try {
    var doc = DocumentApp.openById(ID);
  } catch(err) {
    
    var json = {};
    ID = (ID == '' ? 'Not given' : ID);
    Stratos.add(json, 'error', 'Could not load document');
    Stratos.add(json, 'message', err.message);
    Stratos.add(json, 'ID', ID);
    return json;
  }
  
 
  
  return gdoc2json(doc);
}