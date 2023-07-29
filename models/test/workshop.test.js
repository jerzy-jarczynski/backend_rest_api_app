const Workshop = require('../workshops.model');
const expect = require('chai').expect;

describe('Workshop', () => {

  it('should throw an error if no "name" arg', () => {
    const wsp = new Workshop({}); // create new Workshop, but don't set `name` attr value

    wsp.validate(err => {
      expect(err.errors.name).to.exist;
      expect(err.errors.concertId).to.exist;
    });

  });

  it('should throw an error if args are not strings', () => {

    const cases = [{}, []];
    for(let name of cases) {
      const wsp = new Workshop({ name: name, concertId: name });
  
      wsp.validate(err => {
        expect(err.errors.name).to.exist;
        expect(err.errors.concertId).to.exist;
      });
  
    }
  });

  it('should not throw an error if args are okay', () => {

    const emp = new Workshop({ 
      name: 'Rock Music Style', concertId: '64b97150ffa47c34222692dc'
    });
  
    emp.validate(err => {
      expect(err).to.not.exist;
    });
  
  });
  
});