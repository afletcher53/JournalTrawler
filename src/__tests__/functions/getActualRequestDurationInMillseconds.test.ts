import getActualRequestDurationInMilliseconds from '../../middleware/functions/getActualRequestDurationInMilliseconds';


describe('Convert Request Duration into Milliseconds', () => {
    test('it should return a number', () => {
       const input: [number, number] = [ 580, 482458694 ];
       expect(typeof getActualRequestDurationInMilliseconds(input)).toBe('number');
      });
});
