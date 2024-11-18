/**
 * フッター
 * @returns JSX.Element
 */
const Footer = () => {
    return (
        <footer className="border-t">
            <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} AI Chat Assistant. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
