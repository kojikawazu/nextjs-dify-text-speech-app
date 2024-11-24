import { render } from '@testing-library/react';
import LoadingIcon from '@/components/common/LoadingIcon';

describe('LoadingIcon', () => {
    it('To be rendered correctly.', () => {
        const { container } = render(<LoadingIcon />);

        // divコンテナの確認
        const wrapper = container.firstChild;
        expect(wrapper).toHaveClass('flex', 'justify-center', 'items-center');

        // Spinnerコンポーネントの確認
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('animate-spin', 'w-6', 'h-6', 'text-primary');
    });
});
