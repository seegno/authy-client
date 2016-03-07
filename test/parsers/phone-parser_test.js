
/**
 * Module dependencies.
 */

import parse from '../../src/parsers/phone-parser';

/**
 * Test `PhoneParser`.
 */

describe('PhoneParser', () => {
  describe('parse()', () => {
    it('should support a numeric `countryOrCallingCode` part of NANPA', () => {
      parse({ countryOrCallingCode: 1, phone: '408-555-5555' }).should.eql({ countryCallingCode: 1, phone: '4085555555' });
    });

    it('should support a numeric `countryOrCallingCode` formatted as a number', () => {
      parse({ countryOrCallingCode: 351, phone: '91 555 5555' }).should.eql({ countryCallingCode: 351, phone: '915555555' });
    });

    it('should support a numeric `countryOrCallingCode` formatted as a string', () => {
      parse({ countryOrCallingCode: '351', phone: '91 555 5555' }).should.eql({ countryCallingCode: 351, phone: '915555555' });
    });

    it('should support a literal `countryOrCallingCode` in the ISO 3166-1 alpha-2 format', () => {
      parse({ countryOrCallingCode: 'PT', phone: '915 555 555' }).should.eql({ countryCallingCode: 351, phone: '915555555' });
    });

    it('should support a literal `countryOrCallingCode` in the ISO 3166-1 alpha-2 format that is part of NANPA', () => {
      parse({ countryOrCallingCode: 'LC', phone: '758-2845678' }).should.eql({ countryCallingCode: 1, phone: '7582845678' });
    });

    it('should support a phone in the e164 format with a numeric `countryOrCallingCode`', () => {
      parse({ countryOrCallingCode: 351, phone: '+351 915 555 555' }).should.eql({ countryCallingCode: 351, phone: '915555555' });
    });

    it('should support a phone in the e164 format with the same `countryOrCallingCode` in the ISO 3166-1 alpha-2 format', () => {
      parse({ countryOrCallingCode: 'PT', phone: '+351 915 555 555' }).should.eql({ countryCallingCode: 351, phone: '915555555' });
    });

    it('should support a phone in the e164 format with a different `countryOrCallingCode` in the ISO 3166-1 alpha-2 format', () => {
      parse({ countryOrCallingCode: 'PT', phone: '+34 915 555 555' }).should.eql({ countryCallingCode: 34, phone: '915555555' });
    });

    it('should support a phone in the e164 format with an invalid `countryOrCallingCode` formatted as as number', () => {
      parse({ countryOrCallingCode: 341, phone: '+351 915 555 555' }).should.eql({ countryCallingCode: 351, phone: '915555555' });
    });

    it('should support a phone in the national format', () => {
      parse({ countryOrCallingCode: 'MX', phone: '044 55 1502-5000' }).should.eql({ countryCallingCode: 52, phone: '15515025000' });
    });

    it('should support a phone with a numeric `countryOrCallingCode` which includes a NANPA area code', () => {
      parse({ countryOrCallingCode: 1758, phone: '2845678' }).should.eql({ countryCallingCode: 1, phone: '7582845678' });
    });

    it('should support a phone with a numeric `countryCallingCode and `phone` which includes a NANPA area code', () => {
      parse({ countryOrCallingCode: 1, phone: '758-2845678' }).should.eql({ countryCallingCode: 1, phone: '7582845678' });
    });

    it('should support non-geographical entities', () => {
      parse({ countryOrCallingCode: '001', phone: '+88213300655' }).should.eql({ countryCallingCode: 882, phone: '13300655' });
    });

    it('should support non-geographical entities when `countryOrCallingCode` is a voip country code', () => {
      parse({ countryOrCallingCode: '882', phone: '13300655' }).should.eql({ countryCallingCode: 882, phone: '13300655' });
    });

    it('should return original values if `countryOrCallingCode` is an invalid ISO 3166-1 alpha-2 country', () => {
      parse({ countryOrCallingCode: 'OO', phone: '408-555-5555' }).should.eql({ countryCallingCode: 'OO', phone: '408-555-5555' });
    });

    it('should return original values if non-geographical entity cannot be parsed', () => {
      parse({ countryOrCallingCode: '001', phone: '+88513300655' }).should.eql({ countryCallingCode: '001', phone: '+88513300655' });
    });
  });
});
