var label_padding = 8;
var size = 48;
var stroke = 1;
var padding = 2;

var pip = (size + padding) / 4;
var cross = size * 3 + padding * 6 + stroke * 4;

var cross_color = "#ebebeb";
var pip_color = "#b5b5b5";

exports.get_square = function(color) {
  return ui.Panel({
    style: {
      backgroundColor: color,
      
      width: size.toString() + "px",
      height: size.toString() + "px",
      margin: padding.toString() + "px"
    }
  })
}

exports.grid = {
  width: (cross + pip).toString() + "px",
  height: (cross + pip).toString() + "px"
}

exports.horizontal_cross = {
  backgroundColor: cross_color,
  
  width: cross.toString() + "px",
  height: stroke.toString() + "px"
}

exports.horizontal_pip = {
  backgroundColor: pip_color,
  
  width: pip.toString() + "px",
  height: stroke.toString() + "px"
}

exports.horizontal_label = {
  fontSize: "10px",
  height: "14px",
  padding: (label_padding).toString() + "px 0px " + (size + stroke + 2*padding - label_padding).toString() + "px 2px",
  margin: "0px"
}

exports.horizontal_label_container = {
  padding: "0px",
  margin: "0px"
}

exports.vertical_cross = {
  backgroundColor: cross_color,
  
  width: stroke.toString() + "px",
  height: (size + 2*padding).toString() + "px"
}

exports.vertical_pip = {
  backgroundColor: pip_color,
  
  width: stroke.toString() + "px",
  height: pip.toString() + "px",
  margin: "0px " + (size + 2*padding).toString() + "px 0px 0px"
}

exports.vertical_label = {
  fontSize: "8px",
  padding: "0px 0px 0px 0px",
  margin: "0px 0px 0px 2px"
}

exports.vertical_label_container = {
  padding: "0px",
  margin: "0px"
}

exports.up_label = {
  padding: "4px",
  margin: "0px " + (3 * size / 2).toString() + "px 0px 0px"
}

exports.right_label = {
  padding: "4px"
}

exports.threshold_box = {
  margin: "12px 0px 0px 0px",
  padding: "8px",
  width: "60%",
  
  backgroundColor: "#ebe8e8",
  border: "1px solid #919191"
}

exports.threshold_title = {
  
  margin: "0px 0px 4px 0px",
  fontWeight: "700"
}

exports.threshold_label = {
  height: (size + stroke).toString() + "px",  
  padding: "2px",
  margin: "0px"
}

exports.threshold_bins = {
  margin: "0px",
  
  backgroundColor: exports.threshold_box.backgroundColor
}