describe("tools/Dicitionary", function() {

//  beforeEach(function() {
//  });
  
	describe("<Dictionary>", function() {
		it("Dictionary: add", function() {
			  var d = new Dictionary();
			  
			  d.put('k', 'dd');
			  d.put('kk', 'dd2');
			  d.put('K', 'dd3');
			  
			  expect(d.get('k')).toEqual('dd');
			  expect(d.get('kk')).toEqual('dd2');
			  expect(d.get('K')).toEqual('dd3');
		});
		
		it("Dictionary: size", function() {
			  var d = new Dictionary();

			  expect(d.size()).toEqual(0);
			  
			  d.put('k', 'dd');
			  expect(d.size()).toEqual(1);
			  d.put('kk', 'dd2');
			  expect(d.size()).toEqual(2);
			  d.put('K', 'dd3');
			  expect(d.size()).toEqual(3);
			  
		});
		
		it("Dictionary: remove", function() {
			  var d = new Dictionary();
			  
			  d.put('k', 'dd');
			  d.put('kk', 'dd2');
			  d.put('K', 'dd3');
			  
			  d.remove('k');
			  
			  expect(d.containsKey('k')).toEqual(false);
			  expect(d.get('kk')).toEqual('dd2');
			  expect(d.get('K')).toEqual('dd3');

			  expect(d.size()).toEqual(2);
		});
		
		it("Dictionary: clear", function() {
			  var d = new Dictionary();
			  
			  d.put('k', 'dd');
			  d.put('kk', 'dd2');
			  d.put('K', 'dd3');
			  
			  d.clear();
			  
			  expect(d.containsKey('k')).toEqual(false);
			  expect(d.containsKey('kk')).toEqual(false);
			  expect(d.containsKey('K')).toEqual(false);

			  expect(d.size()).toEqual(0);
		});
		
		it("Dictionary: clear & add", function() {
			  var d = new Dictionary();
			  
			  d.put('k', 'dd');
			  d.put('kk', 'dd2');
			  d.put('K', 'dd3');
			  
			  d.clear();
			  
			  expect(d.containsKey('k')).toEqual(false);
			  expect(d.containsKey('kk')).toEqual(false);
			  expect(d.containsKey('K')).toEqual(false);

			  expect(d.size()).toEqual(0);
			  
			  d.put('k', 'dd');
			  d.put('kk', 'dd2');
			  d.put('K', 'dd3');

			  expect(d.get('k')).toEqual('dd');
			  expect(d.get('kk')).toEqual('dd2');
			  expect(d.get('K')).toEqual('dd3');
		});
		
		it("Dictionary: key list", function() {
			  
			  var d = new Dictionary();
			  var keys = [];
			  
			  d.put('k', 'dd');
			  keys.push('k');
			  
			  d.put('kk', 'dd2');
			  keys.push('kk');
			  
			  d.put('K', 'dd3');
			  keys.push('K');
			  
			  var keyList = d.getKeys();
			  
			  var isContained = function(val, list){
				  for(var i=0, size= list.length; i < size; ++i){
					  if( list[i] == val){
						  return true;
					  }
				  }
				  return false;
			  };
			  
			  //verify: count of KEYs == getKeys().length
			  expect(keyList.length).toEqual(keys.length);
			  
			  //verify: if KEY  => KEY is in getKeys()
			  var isAllInGetKeys = true;
			  for(var i=0, size= keys.length; i < size; ++i){
				  if( ! isContained(keys[i], keyList)){
					  isAllInGetKeys = false;
					  break;
				  }
			  }
			  expect(isAllInGetKeys).toEqual(true);
			  
			  //verify: if KEY in getKeys() => KEY exists
			  var isAllInKeys = true;
			  for(var i=0, size= keyList.length; i < size; ++i){
				  if( ! isContained(keyList[i], keys)){
					  isAllInKeys = false;
					  break;
				  }
			  }
			  expect(isAllInKeys).toEqual(true);
		});
	});
  
  
});