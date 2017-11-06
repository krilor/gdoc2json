/**
 * Turn the gdoc into json
 * @param {object} gdoc - Document object
 * @return {json} json - json object
 */
function gdoc2json(gdoc){
  var json = {};
  var body = gdoc.getBody();
  var header = gdoc.getHeader();
  var footer =  gdoc.getFooter();
  
  Stratos.add(json, 'name', gdoc.getName());
  Stratos.add(json, 'ID', gdoc.getId());
  Stratos.add(json, 'url', gdoc.getUrl());
  Stratos.add(json, 'body', element2json(body));
  Stratos.add(json, 'header', (header ? element2json(header) : false));
  Stratos.add(json, 'footer', (footer ? element2json(footer) : false));
  
  return json;
}

/**
 * Get the current objects data
 * @param {element} element - the element to get data from
 * @return {object} json style object 
 */

function element2json(element){
  var json = {};
  
  // Type
  Stratos.add(json,'type',element.getType()+'');
  
  // Add heading type if exist
  if(typeof element.getHeading == 'function'){
    Stratos.add(json, 'heading', (element.getHeading()+'').toUpperCase().replace(/\s+/g, ''));
  }

  // Add number of children
  Stratos.add(json, 'numChildren', (typeof element.getNumChildren == 'function' ? element.getNumChildren() : 0));
  
  if(json.numChildren > 0){
    var children = [];
    
    // Iterate children
    for(var i = 0; i < json.numChildren; i++){
      children.push(element2json(element.getChild(i))); 
    }
    
    Stratos.add(json, 'children', children)
  } else if ( json.type == 'TEXT' ) {
    Stratos.add(json, 'content', element.getText());
    
  } else if ( json.type == 'INLINE_IMAGE' ) {
    Stratos.add(json, 'height', element.getHeight());
    Stratos.add(json, 'width', element.getWidth());
  }
  
  // Attributes
  if(typeof element.getTextAttributeIndices == 'function'){
    // Multiple attributes
    var attrIndices = element.getTextAttributeIndices(); // This is a javastipt set
    var attr = [];
    
    var j = 0;
    attrIndices.forEach( function(offset) {
      var attrRawObj = element.getAttributes(offset)
      var attrObj = santetizeAttr(attrRawObj);
      Stratos.add(attrObj, 'indexOffset', offset);
      attr.push(attrObj);
      j++
    });
    Stratos.add(json, 'numAttr', j);    
    Stratos.add(json, 'attr', attr);
    
  } else if (typeof element.getAttributes == 'function') {
    Stratos.add(json, 'numAttr', 1);
    Stratos.add(json, 'attr', [santetizeAttr(element.getAttributes())]);
  }
    
    
  
  return json;

}

/**
 * Sanetize attributes
 * @param {object} rawAttr - raw attributes of an element
 * @return {object} Object containing only attributes that actually have a value.
 */

function santetizeAttr(rawAttr){
  var posAttr = [
    'BACKGROUND_COLOR',
    'BOLD',
    'BORDER_COLOR',
    'BORDER_WIDTH',
    'CODE',
    'FONT_FAMILY',
    'FONT_SIZE',
    'FOREGROUND_COLOR',
    'HEADING',
    'HEIGHT',
    'HORIZONTAL_ALIGNMENT',
    'INDENT_END',
    'INDENT_FIRST_LINE',
    'INDENT_START',
    'ITALIC',
    'GLYPH_TYPE',
    'LEFT_TO_RIGHT',
    'LINE_SPACING',
    'LINK_URL',
    'LIST_ID',
    'MARGIN_BOTTOM',
    'MARGIN_LEFT',
    'MARGIN_RIGHT',
    'MARGIN_TOP',
    'NESTING_LEVEL',
    'MINIMUM_HEIGHT',
    'PADDING_BOTTOM',
    'PADDING_LEFT',
    'PADDING_RIGHT',
    'PADDING_TOP',
    'PAGE_HEIGHT',
    'PAGE_WIDTH',
    'SPACING_AFTER',
    'SPACING_BEFORE',
    'STRIKETHROUGH',
    'UNDERLINE',
    'VERTICAL_ALIGNMENT',
    'WIDTH'
  ];
  
  var attrObj = {};
  
  for(var i = 0; i < posAttr.length; i++){
    if (rawAttr[posAttr[i]])
      Stratos.add(attrObj, posAttr[i], rawAttr[posAttr[i]]);
  }
  
  return attrObj;
}