import {render} from '@testing-library/react';
import Header from '../Header';

it('Basic test', () => {
    const {getByText} = render(<Header/>);
    expect(getByText('What\'s up?')).toBeTruthy();
});