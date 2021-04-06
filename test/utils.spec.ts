import { expect } from 'chai';
import * as utils from '../controller/utils';

describe('utils test', () => {
  it('isEmail test', () => {
    expect(utils.isEmail('abced213@gmail.com')).to.equal(true);
    expect(utils.isEmail('asdfas@asdfsa')).to.equal(false);
    expect(utils.isEmail('asdfas1234dfsa')).to.equal(false);
    expect(utils.isEmail('asdfas1@234d.fsa')).to.equal(true);
  });
});
