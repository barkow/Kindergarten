{"filter":false,"title":"taglist-page.js","tooltip":"/client/src/components/taglist-page/taglist-page.js","undoManager":{"mark":50,"position":50,"stack":[[{"group":"doc","deltas":[{"start":{"row":21,"column":30},"end":{"row":22,"column":0},"action":"insert","lines":["",""]},{"start":{"row":22,"column":0},"end":{"row":22,"column":8},"action":"insert","lines":["        "]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":8},"end":{"row":33,"column":11},"action":"insert","lines":["$.ajax({","\t        url: \"/server/API/familien\",","\t        type: \"GET\",","\t        dataType: 'json',","\t        username: params.auth.username(),","\t        password: params.auth.password()","        }).done(function(data) {","          self.families.removeAll();","          $.each(data, function(index, value){","            self.families.push(value);","          });","        });"]}]}],[{"group":"doc","deltas":[{"start":{"row":34,"column":16},"end":{"row":34,"column":73},"action":"remove","lines":["\"/server/API/schlagwoerter/\"+self.selectedTag()+\"/kinder\""]}]}],[{"group":"doc","deltas":[{"start":{"row":23,"column":14},"end":{"row":23,"column":36},"action":"remove","lines":["\"/server/API/familien\""]},{"start":{"row":23,"column":14},"end":{"row":23,"column":71},"action":"insert","lines":["\"/server/API/schlagwoerter/\"+self.selectedTag()+\"/kinder\""]}]}],[{"group":"doc","deltas":[{"start":{"row":35,"column":7},"end":{"row":38,"column":11},"action":"remove","lines":[" self.children.removeAll();","        $.each(data, function(index, child){","          self.children.push(child);","        });"]}]}],[{"group":"doc","deltas":[{"start":{"row":29,"column":10},"end":{"row":32,"column":13},"action":"remove","lines":["self.families.removeAll();","          $.each(data, function(index, value){","            self.families.push(value);","          });"]},{"start":{"row":29,"column":10},"end":{"row":32,"column":11},"action":"insert","lines":[" self.children.removeAll();","        $.each(data, function(index, child){","          self.children.push(child);","        });"]}]}],[{"group":"doc","deltas":[{"start":{"row":34,"column":0},"end":{"row":36,"column":7},"action":"remove","lines":["      $.getJSON(, function(data) { ","       ","\t\t  });"]}]}],[{"group":"doc","deltas":[{"start":{"row":33,"column":11},"end":{"row":34,"column":0},"action":"remove","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":30,"column":8},"end":{"row":30,"column":10},"action":"insert","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":10},"end":{"row":31,"column":12},"action":"insert","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":32,"column":8},"end":{"row":32,"column":10},"action":"insert","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":43,"column":7},"end":{"row":44,"column":0},"action":"insert","lines":["",""]},{"start":{"row":44,"column":0},"end":{"row":44,"column":4},"action":"insert","lines":["\t\t  "]}]}],[{"group":"doc","deltas":[{"start":{"row":44,"column":4},"end":{"row":55,"column":11},"action":"insert","lines":["$.ajax({","\t        url: \"/server/API/schlagwoerter/\"+self.selectedTag()+\"/kinder\",","\t        type: \"GET\",","\t        dataType: 'json',","\t        username: params.auth.username(),","\t        password: params.auth.password()","        }).done(function(data) {","           self.children.removeAll();","          $.each(data, function(index, child){","            self.children.push(child);","          });","        });"]}]}],[{"group":"doc","deltas":[{"start":{"row":40,"column":8},"end":{"row":42,"column":11},"action":"remove","lines":["$.each(data, function(index, tag){","          self.availableTags.push(tag);","        });"]}]}],[{"group":"doc","deltas":[{"start":{"row":49,"column":11},"end":{"row":51,"column":38},"action":"remove","lines":["self.children.removeAll();","          $.each(data, function(index, child){","            self.children.push(child);"]},{"start":{"row":49,"column":11},"end":{"row":51,"column":11},"action":"insert","lines":["$.each(data, function(index, tag){","          self.availableTags.push(tag);","        });"]}]}],[{"group":"doc","deltas":[{"start":{"row":43,"column":8},"end":{"row":43,"column":9},"action":"remove","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":43,"column":6},"end":{"row":43,"column":8},"action":"remove","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":43,"column":4},"end":{"row":43,"column":6},"action":"remove","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":43,"column":2},"end":{"row":43,"column":4},"action":"remove","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":43,"column":1},"end":{"row":43,"column":2},"action":"remove","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":43,"column":0},"end":{"row":43,"column":1},"action":"remove","lines":["\t"]}]}],[{"group":"doc","deltas":[{"start":{"row":42,"column":12},"end":{"row":43,"column":0},"action":"remove","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":42,"column":4},"end":{"row":43,"column":0},"action":"insert","lines":["",""]},{"start":{"row":43,"column":0},"end":{"row":43,"column":4},"action":"insert","lines":["\t\t  "]}]}],[{"group":"doc","deltas":[{"start":{"row":43,"column":12},"end":{"row":44,"column":0},"action":"insert","lines":["",""]},{"start":{"row":44,"column":0},"end":{"row":44,"column":6},"action":"insert","lines":["\t\t    "]}]}],[{"group":"doc","deltas":[{"start":{"row":45,"column":8},"end":{"row":45,"column":9},"action":"remove","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":45,"column":6},"end":{"row":45,"column":8},"action":"remove","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":45,"column":6},"end":{"row":45,"column":7},"action":"insert","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":46,"column":7},"end":{"row":46,"column":8},"action":"remove","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":46,"column":7},"end":{"row":46,"column":8},"action":"remove","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":47,"column":7},"end":{"row":47,"column":8},"action":"remove","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":47,"column":7},"end":{"row":47,"column":8},"action":"remove","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":48,"column":7},"end":{"row":48,"column":8},"action":"remove","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":48,"column":7},"end":{"row":48,"column":8},"action":"remove","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":49,"column":6},"end":{"row":49,"column":8},"action":"remove","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":50,"column":10},"end":{"row":50,"column":11},"action":"remove","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":50,"column":8},"end":{"row":50,"column":10},"action":"remove","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":50,"column":6},"end":{"row":50,"column":8},"action":"remove","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":50,"column":6},"end":{"row":50,"column":8},"action":"insert","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":51,"column":8},"end":{"row":51,"column":10},"action":"remove","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":51,"column":8},"end":{"row":51,"column":10},"action":"insert","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":53,"column":8},"end":{"row":53,"column":10},"action":"remove","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":53,"column":6},"end":{"row":53,"column":8},"action":"remove","lines":["  "]}]}],[{"group":"doc","deltas":[{"start":{"row":54,"column":6},"end":{"row":54,"column":11},"action":"remove","lines":["  });"]}]}],[{"group":"doc","deltas":[{"start":{"row":53,"column":9},"end":{"row":54,"column":6},"action":"remove","lines":["","      "]}]}],[{"group":"doc","deltas":[{"start":{"row":44,"column":40},"end":{"row":44,"column":67},"action":"remove","lines":["self.selectedTag()+\"/kinder"]}]}],[{"group":"doc","deltas":[{"start":{"row":44,"column":39},"end":{"row":44,"column":40},"action":"remove","lines":["+"]}]}],[{"group":"doc","deltas":[{"start":{"row":44,"column":37},"end":{"row":44,"column":38},"action":"remove","lines":["/"]}]}],[{"group":"doc","deltas":[{"start":{"row":44,"column":37},"end":{"row":44,"column":39},"action":"remove","lines":["\"\""]}]}],[{"group":"doc","deltas":[{"start":{"row":39,"column":0},"end":{"row":41,"column":7},"action":"remove","lines":["      $.getJSON(\"/server/API/schlagwoerter\", function(data) { ","        ","\t\t  });"]}]}],[{"group":"doc","deltas":[{"start":{"row":39,"column":0},"end":{"row":40,"column":4},"action":"remove","lines":["","\t\t  "]}]}],[{"group":"doc","deltas":[{"start":{"row":41,"column":37},"end":{"row":41,"column":38},"action":"insert","lines":["\""]}]}]]},"ace":{"folds":[],"scrolltop":645,"scrollleft":0,"selection":{"start":{"row":63,"column":0},"end":{"row":63,"column":0},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":45,"state":"no_regex","mode":"ace/mode/javascript"}},"timestamp":1420461078812,"hash":"00113eae10d8cb0fa398ca3f69690c4a1977f4ca"}