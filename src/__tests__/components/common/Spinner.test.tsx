import { render } from '@testing-library/react';
import Spinner from '@/components/common/Spinner';

describe('Spinner', () => {
    it('To be rendered correctly.', () => {
        const { container } = render(<Spinner />);
        const svg = container.querySelector('svg');

        // svgの確認
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('animate-spin');
    });

    it('Custom class name is applied.', () => {
        const { container } = render(<Spinner className="w-8 h-8" />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('animate-spin', 'w-8', 'h-8');
    });
});
