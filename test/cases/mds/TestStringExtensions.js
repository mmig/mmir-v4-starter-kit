describe("tools/StringExtensions", function() {

//  beforeEach(function() {
//  });
  
	describe("<String>.replaceAll(string,string, [optional] bool)", function() {
		it("String: function replaceAll( , ) [case sensitive]", function() {
			  var before= 'lakdjf alsjdf 34aKdß5äAkDä lajfakd0990 ASKLJKLakd';
			  var after = 'l_REPLACED_jf alsjdf 34aKdß5äAkDä lajf_REPLACED_0990 ASKLJKL_REPLACED_';
			  
			  expect(before.replaceAll('akd','_REPLACED_')).toEqual(after);
		});
		
		it("String: function replaceAll( , ,false) [case sensitive]", function() {
			  var before= 'lakdjf alsjdf 34aKdß5äAkDä lajfakd0990 ASKLJKLakd';
			  var after = 'l_REPLACED_jf alsjdf 34aKdß5äAkDä lajf_REPLACED_0990 ASKLJKL_REPLACED_';
			  
			  expect(before.replaceAll('akd','_REPLACED_', false)).toEqual(after);
		});

		it("String: function replaceAll( , , true) [case insensitive]", function() {
			  var before= 'lakdjf alsjdf 34aKdß5äAkDä lajfakd0990 ASKLJKLakd';
			  var after = 'l_REPLACED_jf alsjdf 34_REPLACED_ß5ä_REPLACED_ä lajf_REPLACED_0990 ASKLJKL_REPLACED_';
			  
			  expect(before.replaceAll('akd','_REPLACED_',true)).toEqual(after);
		});
	});
  
  describe("<String>.startsWith(string)", function() {
	  
	  it("String: function startsWith( ), where the String is starting with X", function() {
		  var before= 'lakdjf alsjdf 34aKdß5äAkDä lajfakd0990 ASKLJKLakd';
		  
		  expect(before.startsWith('lakdjf a')).toBe(true);
		  expect(before.startsWith('lakdjf a', false)).toBe(true);//explicitly using RESPECT CASE mode
	  });
	  
	  it("String: function startsWith( ), where the String is NOT starting with X (case mismatch)", function() {
		  var before= 'lakdjf alsjdf 34aKdß5äAkDä lajfakd0990 ASKLJKLakd';
		  
		  expect(before.startsWith('laLdjf a')).toBe(false);
		  expect(before.startsWith('laLdjf a', false)).toBe(false);//explicitly using RESPECT CASE mode
	  });
	  
	  it("String: function startsWith( ), where the String is starting with X using IGNORE CASE modus (and X contains some characters with mismatching case)", function() {
		  var before= 'lakdjf alsjdf 34aKdß5äAkDä lajfakd0990 ASKLJKLakd';
		  
		  expect(before.startsWith('Lakdjf a', true)).toBe(true);
	  });
	  
	  it("String: function startsWith( ), where the String is NOT starting with X (character mismatch)", function() {
		  var before= 'lakdjf alsjdf 34aKdß5äAkDä lajfakd0990 ASKLJKLakd';
		  
		  expect(before.startsWith('luldjf a')).toBe(false);
		  expect(before.startsWith('luldjf a', false)).toBe(false);//explicitly using RESPECT CASE mode
	  });
	  
	  it("String: function startsWith( ), where the String is NOT starting with X (contains, but does not start with)", function() {
		  var before= 'lakdjf alsjdf 34aKdß5äAkDä lajfakd0990 ASKLJKLakd';
		  
		  expect(before.startsWith('jdf 34aKdß')).toBe(false);
		  expect(before.startsWith('jdf 34aKdß', false)).toBe(false);//explicitly using RESPECT CASE mode
	  });
	  
	  it("String: function startsWith( ), where the String is NOT starting with X (ends, but does not start with)", function() {
		  var before= 'lakdjf alsjdf 34aKdß5äAkDä lajfakd0990 ASKLJKLakd';
		  
		  expect(before.startsWith('90 ASKLJKLakd')).toBe(false);
		  expect(before.startsWith('90 ASKLJKLakd',false)).toBe(false);//explicitly using RESPECT CASE mode
	  });
  });
  
  describe("<String>.escapeQuotes()", function() {
	  
	  it("String: function escapeQuotes(), where the String contains quotes", function() {
		  var before= 'lak\'djf alsjdf 34aKdß5äAkDä lajf\'ak\'d0990 ASKLJKLakd';
		  var after = 'lak\\\'djf alsjdf 34aKdß5äAkDä lajf\\\'ak\\\'d0990 ASKLJKLakd';
		  
		  expect(before.escapeQuotes()).toEqual(after);
	  });
	  
	  it("String: function escapeQuotes(), where the String contains quotes and double-quotes", function() {
		  var before= 'la{k\'djf alsjdf 34aK"dß5äAkDä lajf\'ak\'d0990 ASKLJ"KLakd}';
		  var after = 'la{k\\\'djf alsjdf 34aK"dß5äAkDä lajf\\\'ak\\\'d0990 ASKLJ"KLakd}';
		  
		  expect(before.escapeQuotes()).toEqual(after);
	  });
	  
	  it("String: function escapeQuotes(), where the String does NOT contain quotes, but double-quotes", function() {
		  var before= '"{la"kdjf alsjdf 34a"Kdß5ä"AkDä lajfakd0990 ASKLJ"KL}akd"';
		  var after = '"{la"kdjf alsjdf 34a"Kdß5ä"AkDä lajfakd0990 ASKLJ"KL}akd"';
		  
		  expect(before.escapeQuotes()).toEqual(after);
	  });
	  
  });
  
  describe("<String>.unescapeQuotes()", function() {
	  
	  it("String: function unescapeQuotes(), where the String contains quotes", function() {
		  var after  = 'lak\'djf alsjdf 34aKdß5äAkDä lajf\'ak\'d0990 ASKLJKLakd';
		  var before = 'lak\\\'djf alsjdf 34aKdß5äAkDä lajf\\\'ak\\\'d0990 ASKLJKLakd';
		  
		  expect(before.unescapeQuotes()).toEqual(after);
	  });
	  
	  it("String: function unescapeQuotes(), where the String contains quotes and double-quotes", function() {
		  var after  = 'la{k\'djf alsjdf 34aK"dß5äAkDä lajf\'ak\'d0990 ASKLJ"KLakd}';
		  var before = 'la{k\\\'djf alsjdf 34aK"dß5äAkDä lajf\\\'ak\\\'d0990 ASKLJ"KLakd}';
		  
		  expect(before.unescapeQuotes()).toEqual(after);
	  });
	  
	  it("String: function unescapeQuotes(), where the String does NOT contain quotes, but double-quotes", function() {
		  var after  = '"{la"kdjf alsjdf 34a"Kdß5ä"AkDä lajfakd0990 ASKLJ"KL}akd"';
		  var before = '"{la"kdjf alsjdf 34a"Kdß5ä"AkDä lajfakd0990 ASKLJ"KL}akd"';
		  
		  expect(before.unescapeQuotes()).toEqual(after);
	  });
	  
  });
  
  describe("<String>.escapeDoubleQuotes()", function() {
	  
	  it("String: function escapeDoubleQuotes(), where the String contains double-quotes", function() {
		  var before= 'lak"djf alsjdf 34aKdß5äAkDä lajf"ak"d0990 ASKLJKLakd';
		  var after = 'lak\\"djf alsjdf 34aKdß5äAkDä lajf\\"ak\\"d0990 ASKLJKLakd';
		  
		  expect(before.escapeDoubleQuotes()).toEqual(after);
	  });
	  
	  it("String: function escapeDoubleQuotes(), where the String contains double-quotes and quotes", function() {
		  var before= 'la{k"djf alsjdf 34aK\'dß5äAkDä lajf"ak"d0990 ASKLJ\'KLakd}';
		  var after = 'la{k\\"djf alsjdf 34aK\'dß5äAkDä lajf\\"ak\\"d0990 ASKLJ\'KLakd}';
		  
		  expect(before.escapeDoubleQuotes()).toEqual(after);
	  });
	  
	  it("String: function escapeDoubleQuotes(), where the String does NOT contain double-quotes, but quotes", function() {
		  var before= '\'{la\'kdjf alsjdf 34a\'Kdß5ä\'AkDä lajfakd0990 ASKLJ\'KL}akd\'';
		  var after = '\'{la\'kdjf alsjdf 34a\'Kdß5ä\'AkDä lajfakd0990 ASKLJ\'KL}akd\'';
		  
		  expect(before.escapeDoubleQuotes()).toEqual(after);
	  });
	  
  });
  
  describe("<String>.unescapeDoubleQuotes()", function() {
	  
	  it("String: function unescapeDoubleQuotes(), where the String contains double-quotes", function() {
		  var after  = 'lak"djf alsjdf 34aKdß5äAkDä lajf"ak"d0990 ASKLJKLakd';
		  var before = 'lak\\"djf alsjdf 34aKdß5äAkDä lajf\\"ak\\"d0990 ASKLJKLakd';
		  
		  expect(before.unescapeDoubleQuotes()).toEqual(after);
	  });
	  
	  it("String: function unescapeDoubleQuotes(), where the String contains double-quotes and quotes", function() {
		  var after = 'la{k"djf alsjdf 34aK\'dß5äAkDä lajf"ak"d0990 ASKLJ\'KLakd}';
		  var before= 'la{k\\"djf alsjdf 34aK\'dß5äAkDä lajf\\"ak\\"d0990 ASKLJ\'KLakd}';
		  
		  expect(before.unescapeDoubleQuotes()).toEqual(after);
	  });
	  
	  it("String: function unescapeDoubleQuotes(), where the String does NOT contain double-quotes, but quotes", function() {
		  var after = '\'{la\'kdjf alsjdf 34a\'Kdß5ä\'AkDä lajfakd0990 ASKLJ\'KL}akd\'';
		  var before= '\'{la\'kdjf alsjdf 34a\'Kdß5ä\'AkDä lajfakd0990 ASKLJ\'KL}akd\'';
		  
		  expect(before.unescapeDoubleQuotes()).toEqual(after);
	  });
	  
  });
  
  //TODO test for .htmlEncode([optional] boolean, [optional] number)
  
});