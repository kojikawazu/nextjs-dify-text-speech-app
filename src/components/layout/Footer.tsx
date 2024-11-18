import { COMMON_CONSTANTS } from '@/lib/constants';

/**
 * フッター
 * @returns JSX.Element
 */
const Footer = () => {
    return (
        <footer className="border-t">
            <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} {COMMON_CONSTANTS.FOOTER.COPYRIGHT}
            </div>
        </footer>
    );
};

export default Footer;
