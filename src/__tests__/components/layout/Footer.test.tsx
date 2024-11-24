import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';
import { COMMON_CONSTANTS } from '@/lib/constants';

describe('Footer', () => {
    it('should render correctly with current year and copyright text', () => {
        render(<Footer />);

        const currentYear = new Date().getFullYear();
        const expectedText = `© ${currentYear} ${COMMON_CONSTANTS.FOOTER.COPYRIGHT}`;

        // テキストの確認
        const footerElement = screen.getByText(expectedText);
        expect(footerElement).toBeInTheDocument();
    });

    it('should have proper styling classes', () => {
        const { container } = render(<Footer />);

        // footerの確認
        const footer = container.querySelector('footer');
        expect(footer).toHaveClass('border-t');

        // divの確認
        const div = container.querySelector('div');
        expect(div).toHaveClass(
            'container',
            'mx-auto',
            'px-4',
            'py-4',
            'text-center',
            'text-sm',
            'text-muted-foreground',
        );
    });
});
