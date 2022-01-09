// Copyright (c) 2018 Maen Artimy
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Called by readForm to get key,value pairs for action list
function readKeyValueToList(id, str1, str2, out) {
  $('#'+id+' tr').has(str1).each(function() {
    var $key = $(this).find(str1).val().trim();
    var $value = $(this).find(str2).val().trim();
    if($key != '') {
      var obj = {}; //TODO: simplify
      obj[$key] = $value;
      out.push(obj);
    }
  });
}

// Read form data
function readForm($form) {
  var formData = {};
  var $all = $form.find(':input');

  // Read switch ID
  formData['dpid'] = parseInt($('#dpid').val())

  // Read Flow Operation type
  var op = $('[name="operation"]:checked').val();
  formData['operation'] = op;

  // Read group type
  var gtype = $('#gtype').val();
  formData['type'] = gtype;

  // Read all fields of type=number
  var $nums = $all.filter('[type=number]');
  $nums.each( function() {
    var n = parseInt(this.value);
    formData[this.id] = isNaN(n) ? 0 : n;
  })
  // goto table must be > table_id

  // Read checkboxes
  var $ckb = $all.filter('[type=checkbox]');
  $ckb.each( function() {
    formData[this.id] = this.checked;
  })

  // Read Actions fields and values
  formData.buckets = []
  for(var i=1; i<4; i++) {
    var bucketList = [];
    readKeyValueToList('Bucket_'+i, '[name="applyaction"]', '[name="applyvalue"]', bucketList);
    formData.buckets.push({"actions": bucketList});
  }
  //console.log(formData.buckets)

  return formData;
}

function toInt(fields, info, msg, flag) {
  var HINT = 1;
  for(var key in fields) {
    if (key ==='' || key == null || !(key in info)) {
      msg += 'Field ' + key + ' is undefined!';
      flag = false;
    } else {
        var isInt = info[key][HINT].indexOf('int') !== -1;
        if (isInt) {
          var num = parseInt(fields[key]);
          if (isNaN(num)) {
            flag = false;
            msg += 'Invalid value for field ' + key + "!";
          } else {
            fields[key] = num;
          }
        }
    }
  }
  flag = true;
}

// validates form input
function validate(formData, matchflds, actionflds) {
  var r = {"valid":{}, "message":"" };

  toInt(formData.match, matchflds, r.message, r.valid.match)
  toInt(formData.apply, actionflds, r.message, r.valid.apply)
  toInt(formData.match, actionflds, r.message, r.valid.write)

  return r;
}
