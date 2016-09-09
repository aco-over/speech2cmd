var expect = require('chai').expect;
var context = require('../lib/context.js')

describe('context', function() {
  describe('isPrefix', function() {
    it('is true when collection has the prefix', function() {
      var collection = [1, 2, 3];
      var prefix = [1, 2];
      expect(context.isPrefix(collection, prefix)).to.equal(true);
    });
    it('is false when collection does not have the prefix', function() {
      var collection = [1, 3, 3];
      var prefix = [1, 2];
      expect(context.isPrefix(collection, prefix)).to.equal(false);
    });
    it('is false when collection is shorter than the prefix', function() {
      var collection = [1];
      var prefix = [1, 2];
      expect(context.isPrefix(collection, prefix)).to.equal(false);
    });
  });
  describe('mapTextToCmds', function() {
    it('handles single word', function() {
      var text = "hello";
      var phraseMap = {
        "hello": 1
      };
      expect(context.mapTextToCmds(text, phraseMap)).to.eql([1]);
    });
    it('handles missing phrase', function() {
      var text = "hello";
      var phraseMap = {
        "hella": 1
      };
      expect(context.mapTextToCmds(text, phraseMap)).to.eql(["hello"]);
    });
    it('handles multiple word phrases', function() {
      var text = "hi hello world";
      var phraseMap = {
        "hi": 1,
        "hello world": 2
      };
      expect(context.mapTextToCmds(text, phraseMap)).to.eql([1, 2]);
    });
    it('handles test one two three', function() {
      var text = "test one two three ";
      var phraseMap = {
        "one": "1",
        "two": "2",
        "three": "3"
      };
      expect(context.mapTextToCmds(text, phraseMap)).to.eql(["test", "1", "2", "3"]);
    });
  });
});
