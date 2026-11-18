const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const workflowPath = path.join(__dirname, '..', 'workflows', 'intake-retry-demo.json');
const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
const codeNodes = workflow.nodes.filter(node => node.type === 'n8n-nodes-base.code');
assert.equal(codeNodes.length, 1, 'The demo should contain one Code node');

const writesByMap = [];
class CountedMap extends Map {
  constructor() {
    super();
    this.counterIndex = writesByMap.length;
    writesByMap.push(0);
  }

  set(key, value) {
    writesByMap[this.counterIndex] += 1;
    return super.set(key, value);
  }
}

const script = new vm.Script(`(function () {\n${codeNodes[0].parameters.jsCode}\n})()`);
const items = script.runInNewContext({ Map: CountedMap }, { timeout: 1000 });

assert.equal(items.length, 7, 'All seven scenarios should return an item');
assert.ok(items.every(item => item.json.simulated === true && item.json.passed === true));
assert.deepEqual(Array.from(items, item => item.json.status), [201, 200, 503, 201, 503, 201, 409]);
assert.deepEqual(Array.from(items, item => item.json.outcome), [
  'accepted',
  'duplicate_replay',
  'sheet_unavailable',
  'accepted',
  'notification_unavailable',
  'accepted',
  'request_id_conflict',
]);

// Count actual simulated writes, including an overwrite of an existing Map key.
assert.equal(writesByMap[0], 3, 'Retries must not add row writes');
assert.equal(writesByMap[1], 3, 'Replays must not add notification writes');

console.log('7 simulated recovery scenarios passed. 3 row writes and 3 notification writes.');
